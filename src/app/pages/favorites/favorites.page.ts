import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular'; // Agregar ModalController
import { FavoriteService } from '../services/favorites.service';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { CharacterDetailModalComponent } from '../../components/character-detail-modal/character-detail-modal.component'; // Agregar esta importación
import { Character } from '../../models/character.interface'; // Agregar esta importación

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, CharacterCardComponent]
})
export class FavoritesPage implements OnInit {
  favorites: any[] = [];
  loading = true;

  constructor(
    private favoriteService: FavoriteService,
    private modalController: ModalController // Cambiar Router por ModalController
  ) {}

  async ngOnInit() {
    await this.loadFavorites();
  }

  async loadFavorites() {
    try {
      this.favorites = await this.favoriteService.getFavoritesWithCharacters();
      console.log('Favorites loaded:', this.favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      this.loading = false;
    }
  }

  // MÉTODO CORREGIDO - Ahora recibe characterId string
  async onFavoriteToggled(characterId: string) {
    try {
      await this.favoriteService.removeFavorite(characterId);
      console.log('Removed from favorites:', characterId);
      await this.loadFavorites(); // Recargar la lista
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }


  async onCharacterClicked(character: Character) {
  console.log('Opening modal for character from favorites:', character.name);
  
  // Timeout de seguridad
  const modalTimeout = setTimeout(() => {
    console.warn('Modal opening taking too long in favorites');
  }, 3000);
  
  try {
    const modal = await this.modalController.create({
      component: CharacterDetailModalComponent,
      componentProps: {
        character: character
      },
      cssClass: 'character-detail-modal',
      backdropDismiss: true,
      keyboardClose: true,
      mode: 'ios',
      breakpoints: [0.5, 0.75, 0.9],
      initialBreakpoint: 0.75,
      handle: false
    });

    modal.onDidDismiss().then(() => {
      console.log('Modal dismissed from favorites');
      clearTimeout(modalTimeout);
    });

    await modal.present();
    clearTimeout(modalTimeout);
    
  } catch (error) {
    console.error('Error opening modal from favorites:', error);
    clearTimeout(modalTimeout);
  }
}
  async doRefresh(event: any) {
    await this.loadFavorites();
    event.target.complete();
  }

  // Método auxiliar para obtener solo los personajes
  get favoriteCharacters(): Character[] {
    return this.favorites.map(fav => fav.character).filter(Boolean);
  }
}