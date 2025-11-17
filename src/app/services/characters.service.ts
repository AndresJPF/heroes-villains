import { Injectable } from '@angular/core';
import { Character, CharacterFilter, SortOption } from '../models/character.interface';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {
  private characters: Character[] = [
    {
      id: 'batman',
      name: 'Batman',
      aliases: ['Bruce Wayne', 'The Dark Knight'],
      universe: 'DC',
      affiliation: 'Hero',
      powerStats: {
        intelligence: 95,
        strength: 30,
        speed: 30,
        durability: 40,
        power: 40,
        combat: 95
      },
      powers: ['Detective skills', 'Martial arts', 'Technology', 'Wealth'],
      weaknesses: ['Human limits', 'No superpowers'],
      firstAppearance: 1939,
      rating: 4.7,
      image: 'assets/images/batman.jpg',
      biography: 'Bruce Wayne, traumatizado por el asesinato de sus padres, se entrena física y mentalmente para combatir el crimen en Gotham City.',
      links: {
        wiki: 'https://es.wikipedia.org/wiki/Batman'
      }
    },
    {
      id: 'superman',
      name: 'Superman',
      aliases: ['Clark Kent', 'Man of Steel'],
      universe: 'DC',
      affiliation: 'Hero',
      powerStats: {
        intelligence: 90,
        strength: 100,
        speed: 100,
        durability: 100,
        power: 100,
        combat: 85
      },
      powers: ['Super strength', 'Flight', 'Heat vision', 'X-ray vision'],
      weaknesses: ['Kryptonite', 'Magic'],
      firstAppearance: 1938,
      rating: 4.9,
      image: 'assets/images/superman.jpg',
      biography: 'El último hijo de Krypton, enviado a la Tierra donde se convierte en su mayor protector.',
      links: {
        wiki: 'https://es.wikipedia.org/wiki/Superman'
      }
    },
    {
      id: 'joker',
      name: 'Joker',
      aliases: ['The Clown Prince of Crime'],
      universe: 'DC',
      affiliation: 'Villain',
      powerStats: {
        intelligence: 90,
        strength: 15,
        speed: 20,
        durability: 30,
        power: 25,
        combat: 70
      },
      powers: ['Criminal mastermind', 'Expert chemist', 'Manipulation'],
      weaknesses: ['Mental instability', 'Obsession with Batman'],
      firstAppearance: 1940,
      rating: 4.5,
      image: 'assets/images/joker.jpg',
      biography: 'Un criminal psicópata con un sentido del humor retorcido, obsesionado con Batman.',
      links: {
        wiki: 'https://es.wikipedia.org/wiki/Joker_(personaje)'
      }
    },
    {
      id: 'spiderman',
      name: 'Spider-Man',
      aliases: ['Peter Parker', 'Spidey'],
      universe: 'Marvel',
      affiliation: 'Hero',
      powerStats: {
        intelligence: 90,
        strength: 55,
        speed: 65,
        durability: 60,
        power: 70,
        combat: 85
      },
      powers: ['Wall-crawling', 'Spider-sense', 'Super strength', 'Web shooting'],
      weaknesses: ['Responsibility', 'Personal life conflicts'],
      firstAppearance: 1962,
      rating: 4.6,
      image: 'assets/images/spiderman.jpg',
      biography: 'Peter Parker, un adolescente que obtiene poderes arácnidos después de ser picado por una araña radiactiva.',
      links: {
        wiki: 'https://es.wikipedia.org/wiki/Spider-Man'
      }
    },
    {
      id: 'thanos',
      name: 'Thanos',
      aliases: ['The Mad Titan'],
      universe: 'Marvel',
      affiliation: 'Villain',
      powerStats: {
        intelligence: 95,
        strength: 95,
        speed: 50,
        durability: 90,
        power: 100,
        combat: 85
      },
      powers: ['Super strength', 'Energy projection', 'Teleportation', 'Immortality'],
      weaknesses: ['Arrogance', 'Emotional attachments'],
      firstAppearance: 1973,
      rating: 4.8,
      image: 'assets/images/thanos.jpg',
      biography: 'Un poderoso titán obsesionado con el concepto de equilibrio en el universo.',
      links: {
        wiki: 'https://es.wikipedia.org/wiki/Thanos'
      }
    }
  ];

  constructor() { }

  // Obtener todos los personajes con filtros opcionales
  getCharacters(
    filters?: CharacterFilter,
    sort?: SortOption,
    page: number = 1,
    limit: number = 20
  ): Promise<{ characters: Character[]; total: number }> {
    return new Promise((resolve) => {
      // Simular delay de API
      setTimeout(() => {
        let filteredCharacters = [...this.characters];

        // Aplicar filtros
        if (filters) {
          if (filters.universe) {
            filteredCharacters = filteredCharacters.filter(char => 
              char.universe === filters.universe
            );
          }
          if (filters.affiliation) {
            filteredCharacters = filteredCharacters.filter(char => 
              char.affiliation === filters.affiliation
            );
          }
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredCharacters = filteredCharacters.filter(char =>
              char.name.toLowerCase().includes(searchTerm) ||
              char.aliases.some(alias => alias.toLowerCase().includes(searchTerm))
            );
          }
        }

        // Aplicar ordenamiento
        if (sort) {
          filteredCharacters.sort((a, b) => {
            switch (sort) {
              case 'name-asc':
                return a.name.localeCompare(b.name);
              case 'name-desc':
                return b.name.localeCompare(a.name);
              case 'rating-desc':
                return b.rating - a.rating;
              case 'rating-asc':
                return a.rating - b.rating;
              default:
                return 0;
            }
          });
        }

        // Aplicar paginación
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedCharacters = filteredCharacters.slice(startIndex, endIndex);

        resolve({
          characters: paginatedCharacters,
          total: filteredCharacters.length
        });
      }, 300); // Simular delay de red
    });
  }

  // Obtener personaje por ID
  getCharacterById(id: string): Promise<Character | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const character = this.characters.find(char => char.id === id);
        resolve(character);
      }, 200);
    });
  }

  // Búsqueda rápida por nombre o alias
  searchCharacters(query: string): Promise<Character[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const searchTerm = query.toLowerCase();
        const results = this.characters.filter(char =>
          char.name.toLowerCase().includes(searchTerm) ||
          char.aliases.some(alias => alias.toLowerCase().includes(searchTerm))
        );
        resolve(results);
      }, 250);
    });
  }

  // Obtener universos únicos para filtros
  getUniverses(): string[] {
    return [...new Set(this.characters.map(char => char.universe))];
  }

  // Obtener afiliaciones únicas para filtros
  getAffiliations(): string[] {
    return [...new Set(this.characters.map(char => char.affiliation))];
  }
}