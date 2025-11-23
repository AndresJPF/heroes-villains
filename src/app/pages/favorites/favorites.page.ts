// src/app/pages/favorites/favorites.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FavoriteService } from '../services/favorites.service';
import { Favorite } from '../../models/favorites.model';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, CharacterCardComponent]
})
export class FavoritesPage implements OnInit {
  favorites: any[] = []; // Cambiar a any[] para incluir character expandido
  loading = true;

  constructor(
    private favoriteService: FavoriteService,
    private router: Router
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

  async onFavoriteToggled(characterId: string) {
    console.log('Favorite toggled:', characterId);
    await this.loadFavorites(); // Recargar después de eliminar
  }

  viewCharacter(characterId: string) {
    this.router.navigate(['/detail', characterId]);
  }

  async doRefresh(event: any) {
    await this.loadFavorites();
    event.target.complete();
  }
}