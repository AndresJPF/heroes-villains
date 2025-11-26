import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CharactersService } from '../services/characters.service';
import { FavoriteService } from '../services/favorites.service';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { CharacterDetailModalComponent } from '../../components/character-detail-modal/character-detail-modal.component';
import { Character, CharacterFilter } from '../../models/character.interface';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, CharacterCardComponent]
})
export class ExplorePage implements OnInit {
  // Lista completa de personajes
  private allCharacters: Character[] = [];
  
  // Personajes mostrados (con paginación)
  displayedCharacters: Character[] = [];
  
  // Personajes filtrados (después de búsqueda/filtros)
  filteredCharacters: Character[] = [];
  
  // Búsqueda y Filtros
  searchQuery: string = '';
  selectedUniverse: string = 'all';
  selectedAffiliation: string = 'all';
  sortBy: string = 'name-asc';
  
  // Opciones de filtros
  universes: string[] = [];
  affiliations: string[] = [];
  
  // Estados
  isLoading: boolean = true;
  isSearching: boolean = false;
  showFilters: boolean = false;

  // Infinite Scroll - Configuración
  private readonly ITEMS_PER_PAGE = 12;
  private currentPage: number = 0;

  // Debounce para búsqueda - CORREGIDO: declarado correctamente
  private searchTimeout: any;

  private charactersService = inject(CharactersService);
  private favoriteService = inject(FavoriteService);
  private modalController = inject(ModalController);

  async ngOnInit() {
    await this.loadAllCharacters();
    this.loadFilterOptions();
  }

  // Cargar todos los personajes al inicio
  async loadAllCharacters() {
    this.isLoading = true;
    this.charactersService.getCharacters().subscribe({
      next: (result) => {
        this.allCharacters = result.characters;
        this.filteredCharacters = [...this.allCharacters];
        this.applySorting();
        this.resetPagination();
        this.loadFirstPage();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading characters:', error);
        this.isLoading = false;
      }
    });
  }

  // Cargar solo la primera página
  private loadFirstPage() {
    this.currentPage = 0;
    this.displayedCharacters = this.filteredCharacters.slice(0, this.ITEMS_PER_PAGE);
  }

  // Cargar más datos para infinite scroll CÍCLICO
  loadMoreCharacters(event: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      this.currentPage++;
      
      const totalPages = Math.ceil(this.filteredCharacters.length / this.ITEMS_PER_PAGE);
      
      // Si llegamos al final, volvemos al principio (comportamiento cíclico)
      if (this.currentPage >= totalPages) {
        this.currentPage = 0;
      }
      
      const startIndex = this.currentPage * this.ITEMS_PER_PAGE;
      const endIndex = startIndex + this.ITEMS_PER_PAGE;
      
      let newCharacters: Character[];
      
      // Si estamos en la última página y no hay suficientes personajes para llenar la página
      if (endIndex > this.filteredCharacters.length) {
        // Tomar los que quedan de esta página y agregar del inicio
        const remainingFromEnd = this.filteredCharacters.slice(startIndex);
        const neededFromStart = this.ITEMS_PER_PAGE - remainingFromEnd.length;
        const fromStart = this.filteredCharacters.slice(0, neededFromStart);
        
        newCharacters = [...remainingFromEnd, ...fromStart];
      } else {
        // Caso normal - tomar el rango de la página actual
        newCharacters = this.filteredCharacters.slice(startIndex, endIndex);
      }
      
      // Reemplazar los personajes mostrados (en lugar de agregar)
      this.displayedCharacters = newCharacters;
      
      // Completar el evento
      event.target.complete();
      
    }, 1000);
  }

  // Resetear paginación cuando cambian los filtros
  private resetPagination() {
    this.currentPage = 0;
    this.displayedCharacters = [];
  }

  async onCharacterClicked(character: Character) {
    try {
      const modal = await this.modalController.create({
        component: CharacterDetailModalComponent,
        componentProps: { character: character },
        cssClass: 'character-detail-modal',
        backdropDismiss: true,
        keyboardClose: true,
        mode: 'ios',
        breakpoints: [0.5, 0.75, 0.9],
        initialBreakpoint: 0.75,
        handle: false
      });

      await modal.present();
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  }

  loadFilterOptions() {
    this.charactersService.getUniverses().subscribe({
      next: (universes) => {
        this.universes = ['all', ...universes];
      },
      error: (error) => {
        console.error('Error loading universes:', error);
        this.universes = ['all', 'DC', 'Marvel'];
      }
    });

    this.charactersService.getAffiliations().subscribe({
      next: (affiliations) => {
        this.affiliations = ['all', ...affiliations];
      },
      error: (error) => {
        console.error('Error loading affiliations:', error);
        this.affiliations = ['all', 'Hero', 'Villain'];
      }
    });
  }

  onSearchInput() {
    clearTimeout(this.searchTimeout);
    this.isSearching = true;
    
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 500);
  }

  performSearch() {
    this.isSearching = true;

    try {
      const filters: CharacterFilter = {
        universe: this.selectedUniverse !== 'all' ? this.selectedUniverse : undefined,
        affiliation: this.selectedAffiliation !== 'all' ? this.selectedAffiliation : undefined
      };

      if (this.searchQuery.trim() === '' && !filters.universe && !filters.affiliation) {
        this.filteredCharacters = [...this.allCharacters];
        this.applySorting();
        this.resetPagination();
        this.loadFirstPage();
      } else {
        this.charactersService.searchCharacters(this.searchQuery, filters).subscribe({
          next: (characters) => {
            this.filteredCharacters = characters;
            this.applySorting();
            this.resetPagination();
            this.loadFirstPage();
          },
          error: (error) => { // CORREGIDO: sintaxis de arrow function
            console.error('Error searching characters:', error);
            this.filteredCharacters = [];
            this.resetPagination();
            this.loadFirstPage();
          }
        });
      }
    } catch (error) {
      console.error('Error in performSearch:', error);
      this.filteredCharacters = [];
      this.resetPagination();
      this.loadFirstPage();
    } finally {
      this.isSearching = false;
    }
  }

  onFilterChange() {
    this.performSearch();
  }

  onSortChange() {
    this.applySorting();
    this.resetPagination();
    this.loadFirstPage();
  }

  applySorting() {
    switch (this.sortBy) {
      case 'name-asc':
        this.filteredCharacters.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        this.filteredCharacters.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-desc':
        this.filteredCharacters.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-asc':
        this.filteredCharacters.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedUniverse = 'all';
    this.selectedAffiliation = 'all';
    this.sortBy = 'name-asc';
    this.performSearch();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  get resultsCount(): number {
    return this.filteredCharacters.length;
  }

  get displayedCount(): number {
    return this.displayedCharacters.length;
  }

  get hasActiveFilters(): boolean {
    return this.searchQuery !== '' || 
           this.selectedUniverse !== 'all' || 
           this.selectedAffiliation !== 'all';
  }

  async onFavoriteToggled(characterId: string) {
    try {
      const isCurrentlyFavorite = await this.favoriteService.isFavorite(characterId);
      
      if (isCurrentlyFavorite) {
        await this.favoriteService.removeFavorite(characterId);
      } else {
        await this.favoriteService.addFavorite(characterId);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }

  async refreshCharacters(event: any) {
    await this.loadAllCharacters();
    event.target.complete();
  }

  // Manejar el evento de infinite scroll
  onInfiniteScroll(event: InfiniteScrollCustomEvent) {
    this.loadMoreCharacters(event);
  }
}