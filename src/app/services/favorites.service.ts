import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Character } from '../models/character.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly FAVORITES_KEY = 'favoriteCharacters';

  constructor() { }

  // Obtener todos los favoritos
  async getFavorites(): Promise<Character[]> {
    try {
      const { value } = await Preferences.get({ key: this.FAVORITES_KEY });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  // Agregar a favoritos
  async addToFavorites(character: Character): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      
      // Evitar duplicados
      if (!favorites.some(fav => fav.id === character.id)) {
        favorites.push(character);
        await Preferences.set({
          key: this.FAVORITES_KEY,
          value: JSON.stringify(favorites)
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }

  // Remover de favoritos
  async removeFromFavorites(characterId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== characterId);
      
      await Preferences.set({
        key: this.FAVORITES_KEY,
        value: JSON.stringify(updatedFavorites)
      });
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }

  // Verificar si un personaje es favorito
  async isFavorite(characterId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.id === characterId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }

  // Toggle favorito
  async toggleFavorite(character: Character): Promise<boolean> {
    const isFav = await this.isFavorite(character.id);
    
    if (isFav) {
      return await this.removeFromFavorites(character.id);
    } else {
      return await this.addToFavorites(character);
    }
  }

  async getFavoriteIds(): Promise<string[]> {
    const favorites = await this.getFavorites();
    return favorites.map(fav => fav.id);
  }
}