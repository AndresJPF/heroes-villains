// src/app/components/character-card/character-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Character } from '../../models/character.interface';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CharacterCardComponent {
  @Input() character!: Character;
  @Input() isFavorite: boolean = false;
  @Output() favoriteToggled = new EventEmitter<string>();
  @Output() cardClicked = new EventEmitter<Character>();

  // Métodos de utilidad
 getAffiliationColor(affiliation: string): string {
  const colors: { [key: string]: string } = {
    'Heroes': 'primary',
    'Villanos': 'danger', 
    'Anti-Heroes': 'warning',
    'Neutral': 'medium',
    'Hero': 'primary',
    'Villano': 'danger',
    'Anti-Hero': 'warning'
  };
  return colors[affiliation] || 'medium';
}

getAffiliationIcon(affiliation: string): string {
  const icons: { [key: string]: string } = {
    'Heroes': 'heart',
    'Villanos': 'skull',
    'Anti-Heroes': 'warning', 
    'Neutral': 'help',
    'Hero': 'heart',
    'Villano': 'skull',
    'Anti-Hero': 'warning'
  };
  return icons[affiliation] || 'help';
}

  getPowerLevelColor(power: number): string {
    if (power >= 80) return 'success';
    if (power >= 60) return 'warning';
    if (power >= 40) return 'tertiary';
    return 'danger';
  }

  getStatColor(stat: number): string {
    if (stat >= 80) return 'success';
    if (stat >= 60) return 'warning';
    if (stat >= 40) return 'tertiary';
    return 'danger';
  }

  getPowerLevel(powerStats: any): number {
    if (!powerStats) return 50;
    
    const stats = [
      powerStats.intelligence || 0,
      powerStats.strength || 0, 
      powerStats.speed || 0,
      powerStats.durability || 0,
      powerStats.power || 0,
      powerStats.combat || 0
    ];
    
    const average = stats.reduce((sum, stat) => sum + stat, 0) / stats.length;
    return Math.round(average);
  }

  onImageError(event: any) {
    event.target.src = 'https://via.placeholder.com/300x400/37474f/ffffff?text=Character+Image';
  }

  onFavoriteClick(event: Event) {
    // SOLO detener la propagación para que no active el click de la tarjeta
    event.stopPropagation();
    
    console.log('Favorite clicked for:', this.character.name);
    this.favoriteToggled.emit(this.character.id);
  }

  onCardClick() {
    console.log('Card clicked for:', this.character.name);
    this.cardClicked.emit(this.character);
  }

  getStarRating(rating: number): { filled: number, half: boolean } {
    const filled = Math.floor(rating / 2);
    const decimal = (rating / 2) - filled;
    const half = decimal >= 0.5;
    
    return { filled, half };
  }
}