import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Character } from '../../models/character.interface';
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
  @Input() character!: Character;
  @Input() isFavorite: boolean = false;
  @Input() showFavoriteButton: boolean = true;
  
  @Output() favoriteToggled = new EventEmitter<Character>();
  @Output() cardClicked = new EventEmitter<string>();

  constructor() { }

  onFavoriteClick(event: Event) {
    event.stopPropagation();
    this.favoriteToggled.emit(this.character);
  }

  onCardClick() {
    this.cardClicked.emit(this.character.id);
  }

  getAffiliationColor(): string {
    switch (this.character.affiliation) {
      case 'Hero':
        return 'primary';
      case 'Villain':
        return 'danger';
      case 'Neutral':
        return 'warning';
      default:
        return 'medium';
    }
  }

  getAffiliationIcon(): string {
    switch (this.character.affiliation) {
      case 'Hero':
        return 'shield-checkmark';
      case 'Villain':
        return 'skull';
      case 'Neutral':
        return 'help';
      default:
        return 'person';
    }
  }

  getPowerLevel(): string {
    const totalPower = Object.values(this.character.powerStats).reduce((a, b) => a + b, 0);
    const maxPower = 600;
    
    if (totalPower >= 450) return 'Muy Alto';
    if (totalPower >= 300) return 'Alto';
    if (totalPower >= 150) return 'Medio';
    return 'Bajo';
  }

  getPowerLevelColor(): string {
    const totalPower = Object.values(this.character.powerStats).reduce((a, b) => a + b, 0);
    
    if (totalPower >= 450) return 'danger';
    if (totalPower >= 300) return 'warning';
    if (totalPower >= 150) return 'success';
    return 'medium';
  }
}