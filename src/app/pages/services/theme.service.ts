import { Injectable, signal, effect } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'user-theme';
  public currentTheme = signal<'light' | 'dark'>('dark');

  constructor() {
    this.loadTheme();
    
    // Efecto para aplicar el tema cuando cambia la signal
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  async loadTheme(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.THEME_KEY });
      if (value) {
        this.currentTheme.set(value as 'light' | 'dark');
      } else {
        this.currentTheme.set('dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
      this.currentTheme.set('dark');
    }
  }

  async toggleTheme(): Promise<void> {
    const newTheme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.currentTheme.set(newTheme);
    
    await Preferences.set({
      key: this.THEME_KEY,
      value: newTheme
    });
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    
    // Forzar re-renderizado de componentes
    setTimeout(() => {
      document.querySelectorAll('ion-card').forEach(card => {
        card.style.setProperty('background', 'var(--ion-card-background)');
      });
    }, 50);
  }
}