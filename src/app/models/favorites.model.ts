export interface Favorite {
  id?: string;
  characterId: string; // Cambiar a string
  userId: string;
  addedAt: string;
  character?: any;
}