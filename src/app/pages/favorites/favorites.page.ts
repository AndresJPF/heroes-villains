import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FavoritesService } from '../services/favorites.service';
import { CharactersService } from '../services/characters.service';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { Character } from '../../models/character.interface';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, CharacterCardComponent]
})
export class FavoritesPage implements OnInit {
  favoriteCharacters: Character[] = [];
  isLoading: boolean = true;

  constructor(
    private favoritesService: FavoritesService,
    private charactersService: CharactersService
  ) { }

  async ngOnInit() {
    await this.loadFavorites();
  }

  async loadFavorites() {
    this.isLoading = true;
    try {
      this.favoriteCharacters = await this.favoritesService.getFavorites();
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async onFavoriteToggled(character: Character) {
    // Remover de favoritos cuando se hace toggle
    const success = await this.favoritesService.removeFromFavorites(character.id);
    if (success) {
      // Actualizar la lista localmente
      this.favoriteCharacters = this.favoriteCharacters.filter(
        fav => fav.id !== character.id
      );
    }
  }

  onCharacterClicked(characterId: string) {
    console.log('Favorite character clicked:', characterId);
    // Navegar a detalle más adelante
  }

  get emptyStateMessage(): string {
    return 'Aún no tienes personajes favoritos';
  }

  get emptyStateSubtitle(): string {
    return 'Explora personajes y agrega tus favoritos tocando el corazón';
  }

  async refreshFavorites(event: any) {
    await this.loadFavorites();
    event.target.complete();
  }
}