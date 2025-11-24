// src/app/components/character-card/character-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CharacterCardComponent {
  @Input() character!: any;
  @Input() isFavorite: boolean = false;
  @Input() showFavoriteButton: boolean = true; // Agregar esta propiedad
  @Output() favoriteToggled = new EventEmitter<string>();
  @Output() cardClicked = new EventEmitter<string>();

  // Métodos de utilidad para el template
  getAffiliationColor(affiliation: string): string {
    const colors: { [key: string]: string } = {
      'Heroes': 'primary',
      'Villains': 'danger',
      'Anti-Heroes': 'warning',
      'Neutral': 'medium'
    };
    return colors[affiliation] || 'medium';
  }

  getAffiliationIcon(affiliation: string): string {
    const icons: { [key: string]: string } = {
      'Heroes': 'heart',
      'Villains': 'skull',
      'Anti-Heroes': 'warning',
      'Neutral': 'help'
    };
    return icons[affiliation] || 'help';
  }

  getPowerLevelColor(power: number): string {
    if (power >= 80) return 'success';
    if (power >= 60) return 'warning';
    if (power >= 40) return 'tertiary';
    return 'danger';
  }

  getPowerLevel(powerStats: any): number {
    if (!powerStats) return 0;
    
    const stats = [
      powerStats.intelligence || 0,
      powerStats.strength || 0,
      powerStats.speed || 0,
      powerStats.durability || 0,
      powerStats.power || 0,
      powerStats.combat || 0
    ];
    
    return Math.round(stats.reduce((sum, stat) => sum + stat, 0) / stats.length);
  }

  onFavoriteClick(event: Event) {
    event.stopPropagation();
    this.favoriteToggled.emit(this.character.id);
  }

  onCardClick() {
    this.cardClicked.emit(this.character.id);
  }
}