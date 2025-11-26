import { Component, inject, Signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ThemeService } from '../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class SettingsPage {
  private themeService = inject(ThemeService);
  
  // Exponer la signal del servicio
  public currentTheme: Signal<'light' | 'dark'> = this.themeService.currentTheme;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getThemeLabel(): string {
    return this.currentTheme() === 'dark' ? 'Activado' : 'Desactivado';
  }
}