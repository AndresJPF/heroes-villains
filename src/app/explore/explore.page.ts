import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CharactersService } from '../services/characters.service';
import { FavoritesService } from '../services/favorites.service';
import { CharacterCardComponent } from '../components/character-card/character-card.component';
import { Character } from '../models/character.interface';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
})
export class ExplorePage implements OnInit {
  characters: Character[] = [];

  constructor(
    private charactersService: CharactersService,
    private favoritesService: FavoritesService
  ) { }

  ngOnInit() {
    this.loadCharacters();
  }

  async loadCharacters() {
    const result = await this.charactersService.getCharacters();
    this.characters = result.characters;
  }

  async onFavoriteToggled(character: Character) {
    await this.favoritesService.toggleFavorite(character);
    // Recargar o actualizar estado si es necesario
  }

  onCharacterClicked(characterId: string) {
    console.log('Character clicked:', characterId);
    // Navegar a detalle más adelante
  }
}