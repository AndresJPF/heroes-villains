import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CharactersService } from '../services/characters.service';
import { FavoritesService } from '../services/favorites.service';
import { CharacterCardComponent } from '../components/character-card/character-card.component';
import { Character, CharacterFilter } from '../models/character.interface';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, CharacterCardComponent]
})
export class ExplorePage implements OnInit {
  characters: Character[] = [];
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

  // Debounce para búsqueda
  private searchTimeout: any;

  constructor(
    private charactersService: CharactersService,
    private favoritesService: FavoritesService
  ) { }

  async ngOnInit() {
    await this.loadCharacters();
    this.loadFilterOptions();
  }

  loadCharacters() {
    this.isLoading = true;
    this.charactersService.getCharacters().subscribe({
      next: (result) => {
        this.characters = result.characters;  // ✅ CORREGIDO: result.characters
        this.filteredCharacters = [...this.characters];
        this.applySorting();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading characters:', error);
        this.isLoading = false;
      }
    });
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
    // Debounce para evitar muchas búsquedas
    clearTimeout(this.searchTimeout);
    this.isSearching = true;
    
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 500);
  }

  performSearch() {
    try {
      const filters: CharacterFilter = {
        universe: this.selectedUniverse !== 'all' ? this.selectedUniverse : undefined,
        affiliation: this.selectedAffiliation !== 'all' ? this.selectedAffiliation : undefined
      };

      if (this.searchQuery.trim() === '' && !filters.universe && !filters.affiliation) {
        // Si no hay búsqueda ni filtros, mostrar todos
        this.charactersService.getCharacters().subscribe({
          next: (result) => {
            this.filteredCharacters = result.characters;  // ✅ CORREGIDO
            this.applySorting();
            this.isSearching = false;
          },
          error: (error) => {
            console.error('Error loading characters:', error);
            this.isSearching = false;
          }
        });
      } else {
        // Aplicar búsqueda y filtros
        this.charactersService.searchCharacters(this.searchQuery, filters).subscribe({
          next: (characters) => {
            this.filteredCharacters = characters;
            this.applySorting();
            this.isSearching = false;
          },
          error: (error) => {
            console.error('Error searching characters:', error);
            this.isSearching = false;
          }
        });
      }
    } catch (error) {
      console.error('Error in performSearch:', error);
      this.isSearching = false;
    }
  }

  onFilterChange() {
    this.performSearch();
  }

  onSortChange() {
    this.applySorting();
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

  get hasActiveFilters(): boolean {
    return this.searchQuery !== '' || 
           this.selectedUniverse !== 'all' || 
           this.selectedAffiliation !== 'all';
  }

  async checkFavoritesStatus() {
    console.log('Favorites status checked');
  }

  async onFavoriteToggled(character: Character) {
    await this.favoritesService.toggleFavorite(character);
    await this.checkFavoritesStatus();
  }

  onCharacterClicked(characterId: string) {
    console.log('Character clicked:', characterId);
  }

  async refreshCharacters(event: any) {
    await this.loadCharacters();
    event.target.complete();
  }
}