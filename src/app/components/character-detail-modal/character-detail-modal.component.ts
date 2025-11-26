import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Character } from '../../models/character.interface';

@Component({
  selector: 'app-character-detail-modal',
  templateUrl: './character-detail-modal.component.html',
  styleUrls: ['./character-detail-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class CharacterDetailModalComponent implements OnInit {
  @Input() character!: Character;
  isLoading: boolean = false;
  isFavorite: boolean = false;
  
  // Propiedades calculadas una sola vez
  powerStatsArray: { label: string; value: number }[] = [];
  overallPowerLevel: number = 50;

  constructor(private modalController: ModalController) {}

  async ngOnInit() {
    console.log('Modal initialized with character:', this.character);
    
    // Calcular propiedades una sola vez
    this.powerStatsArray = this.calculatePowerStatsArray();
    this.overallPowerLevel = this.calculateOverallPowerLevel();
    
    this.isLoading = false;
  }

  private calculatePowerStatsArray(): { label: string; value: number }[] {
    if (!this.character?.powerStats) {
      return [];
    }
    
    return Object.entries(this.character.powerStats)
      .filter(([key, value]) => typeof value === 'number')
      .map(([key, value]) => ({
        label: this.getStatLabel(key),
        value: value as number
      }));
  }

  private calculateOverallPowerLevel(): number {
    if (!this.character?.powerStats) return 50;
    
    const stats = [
      this.character.powerStats.intelligence || 0,
      this.character.powerStats.strength || 0, 
      this.character.powerStats.speed || 0,
      this.character.powerStats.durability || 0,
      this.character.powerStats.power || 0,
      this.character.powerStats.combat || 0
    ];
    
    const average = stats.reduce((sum, stat) => sum + stat, 0) / stats.length;
    return Math.round(average);
  }

  getStatLabel(statKey: string): string {
    const labels: { [key: string]: string } = {
      'intelligence': 'Inteligencia',
      'strength': 'Fuerza',
      'speed': 'Velocidad',
      'durability': 'Resistencia',
      'power': 'Poder',
      'combat': 'Combate'
    };
    return labels[statKey] || statKey;
  }

  getAffiliationColor(affiliation: string): string {
    const colors: { [key: string]: string } = {
      'Heroes': 'primary',
      'Villains': 'danger', 
      'Anti-Heroes': 'warning',
      'Neutral': 'medium',
      'Hero': 'primary',
      'Villain': 'danger'
    };
    return colors[affiliation] || 'medium';
  }

  getAffiliationIcon(affiliation: string): string {
    const icons: { [key: string]: string } = {
      'Heroes': 'heart',
      'Villains': 'skull',
      'Anti-Heroes': 'warning', 
      'Neutral': 'help',
      'Hero': 'heart',
      'Villain': 'skull'
    };
    return icons[affiliation] || 'help';
  }

  getStatColor(stat: number): string {
    if (stat >= 80) return 'success';
    if (stat >= 60) return 'warning';
    if (stat >= 40) return 'tertiary';
    return 'danger';
  }

  getPowerLevelColor(power: number): string {
    if (power >= 80) return 'success';
    if (power >= 60) return 'warning';
    if (power >= 40) return 'tertiary';
    return 'danger';
  }

  async toggleFavorite(event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (!this.character) return;
    
    this.isFavorite = !this.isFavorite;
    console.log('Favorite toggled for:', this.character.name, 'New state:', this.isFavorite);
  }

  async shareCharacter(event?: Event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (!this.character) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: this.character.name,
          text: `Mira a ${this.character.name} - ${this.character.biography || 'Personaje de Heroes & Villains'}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      console.log('Web Share API not supported');
    }
  }

  openExternalLink(url: string) {
    window.open(url, '_blank');
  }

  closeModal() {
    this.modalController.dismiss();
  }
}