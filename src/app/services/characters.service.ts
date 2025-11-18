import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Character, CharacterFilter } from '../models/character.interface';

export interface CharactersResponse {
  characters: Character[];
}

@Injectable({
  providedIn: 'root'
})
export class CharactersService {
  private apiUrl = 'http://localhost:3000/characters';

  constructor(private http: HttpClient) { }

  // Obtener todos los personajes con filtros opcionales
  getCharacters(
    filters?: CharacterFilter,
    sort?: string,
    page: number = 1,
    limit: number = 20
  ): Observable<{ characters: Character[]; total: number }> {
    let params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    // Aplicar filtros a los parámetros
    if (filters) {
      if (filters.universe) {
        params = params.set('universe', filters.universe);
      }
      if (filters.affiliation) {
        params = params.set('affiliation', filters.affiliation);
      }
      if (filters.search) {
        params = params.set('q', filters.search);
      }
    }

    // Aplicar ordenamiento
    if (sort) {
      let sortField = 'name';
      let sortOrder = 'asc';
      
      switch (sort) {
        case 'name-asc':
          sortField = 'name';
          sortOrder = 'asc';
          break;
        case 'name-desc':
          sortField = 'name';
          sortOrder = 'desc';
          break;
        case 'rating-desc':
          sortField = 'rating';
          sortOrder = 'desc';
          break;
        case 'rating-asc':
          sortField = 'rating';
          sortOrder = 'asc';
          break;
      }
      
      params = params.set('_sort', sortField).set('_order', sortOrder);
    }

    return this.http.get<Character[]>(this.apiUrl, { 
      params, 
      observe: 'response' 
    }).pipe(
      map(response => {
        const characters = response.body || [];
        const total = parseInt(response.headers.get('X-Total-Count') || characters.length.toString());
        
        // Si hay búsqueda por texto, aplicar filtro adicional
        if (filters?.search) {
          const searchTerm = filters.search.toLowerCase();
          const filtered = characters.filter(char =>
            char.name.toLowerCase().includes(searchTerm) ||
            char.aliases.some(alias => alias.toLowerCase().includes(searchTerm))
          );
          return { characters: filtered, total: filtered.length };
        }

        return { characters, total };
      })
    );
  }

  // Obtener personaje por ID
  getCharacterById(id: string): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }

  // Obtener universos únicos para filtros
  getUniverses(): Observable<string[]> {
    return this.http.get<Character[]>(this.apiUrl).pipe(
      map(characters => [...new Set(characters.map(char => char.universe))])
    );
  }

  // Obtener afiliaciones únicas para filtros
  getAffiliations(): Observable<string[]> {
    return this.http.get<Character[]>(this.apiUrl).pipe(
      map(characters => [...new Set(characters.map(char => char.affiliation))])
    );
  }

  // Búsqueda avanzada con múltiples filtros
  searchCharacters(query: string, filters?: CharacterFilter): Observable<Character[]> {
    let params = new HttpParams();

    if (query && query.trim() !== '') {
      params = params.set('q', query.trim());
    }

    if (filters) {
      if (filters.universe && filters.universe !== 'all') {
        params = params.set('universe', filters.universe);
      }
      if (filters.affiliation && filters.affiliation !== 'all') {
        params = params.set('affiliation', filters.affiliation);
      }
    }

    return this.http.get<Character[]>(this.apiUrl, { params }).pipe(
      map(characters => {
        // Aplicar búsqueda por texto si existe
        if (query && query.trim() !== '') {
          const searchTerm = query.toLowerCase().trim();
          return characters.filter(char =>
            char.name.toLowerCase().includes(searchTerm) ||
            char.aliases.some(alias => alias.toLowerCase().includes(searchTerm))
          );
        }
        return characters;
      })
    );
  }
}