// src/app/pages/services/favorites.service.ts
import { Injectable } from '@angular/core';
import { Favorite } from '../../models/favorites.model';
import { CharactersService } from './characters.service';
import { lastValueFrom } from 'rxjs'; // Importar esto

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:3000';
  private userId = 'default-user';

  constructor(private charactersService: CharactersService) {}

  // Obtener todos los favoritos
  async getFavorites(): Promise<Favorite[]> {
    try {
      const response = await fetch(`${this.apiUrl}/favorites?userId=${this.userId}`);
      if (!response.ok) throw new Error('Error fetching favorites');
      return await response.json();
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }

  // Agregar a favoritos
  async addFavorite(characterId: string): Promise<Favorite> {
    const favorite: Favorite = {
      characterId,
      userId: this.userId,
      addedAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${this.apiUrl}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(favorite)
      });
      
      if (!response.ok) throw new Error('Error adding favorite');
      return await response.json();
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  // Eliminar de favoritos
  async removeFavorite(characterId: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const favorite = favorites.find(f => f.characterId === characterId);
      
      if (favorite && favorite.id) {
        const response = await fetch(`${this.apiUrl}/favorites/${favorite.id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error removing favorite');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  // Verificar si es favorito
  async isFavorite(characterId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.some(f => f.characterId === characterId);
  }

  // Obtener favoritos con datos de personajes - CORREGIDO
  async getFavoritesWithCharacters(): Promise<any[]> {
    const favorites = await this.getFavorites();
    
    // Obtener datos completos de cada personaje usando lastValueFrom
    const favoritesWithCharacters = await Promise.all(
      favorites.map(async (favorite) => {
        try {
          // Convertir Observable a Promise usando lastValueFrom
          const character = await lastValueFrom(
            this.charactersService.getCharacterById(favorite.characterId)
          );
          return {
            ...favorite,
            character: character
          };
        } catch (error) {
          console.error(`Error loading character ${favorite.characterId}:`, error);
          // Si falla, retorna el favorite básico
          return {
            ...favorite,
            character: {
              id: favorite.characterId,
              name: 'Personaje no disponible',
              thumbnail: { path: '', extension: '' },
              description: 'No se pudo cargar la información del personaje'
            }
          };
        }
      })
    );
    
    return favoritesWithCharacters;
  }
}