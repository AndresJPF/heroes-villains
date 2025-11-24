export interface Favorite {
  id?: number; // ID auto-generado por json Server
  characterId: string; // ID del personaje basado en su el nombre
  userId: string;
  addedAt: string;
  character?: any; // Para expandir con datos del personaje después
}