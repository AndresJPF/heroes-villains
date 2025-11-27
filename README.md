# 🦸‍♂️ Héroes y Villanos - Ionic App

Una aplicación móvil desarrollada con Ionic y Angular para explorar personajes de cómics de Marvel y DC.

## 🚀 Características

### ✨ Funcionalidades Principales
- **📱 Explorar Personajes**: Navega por más de 30 personajes de Marvel y DC
- **⭐ Sistema de Favoritos**: Guarda tus personajes favoritos con persistencia local
- **🎨 Modo Oscuro/Claro**: Toggle entre temas con persistencia de preferencias
- **🔍 Búsqueda Avanzada**: Filtra por nombre, universo y afiliación
- **📊 Estadísticas Detalladas**: Visualiza power stats de cada personaje
- **📖 Biografías Completas**: Información detallada de cada personaje

### 🎯 Pantallas Implementadas
- **Explorar**: Búsqueda y filtrado de personajes
- **Favoritos**: Lista de personajes guardados
- **Configuración**: Gestión de tema y preferencias
- **Detalles**: Modal con información completa del personaje

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Ionic Framework 8** + **Angular 17**
- **TypeScript** + **Standalone Components**
- **Capacitor** para build móvil
- **Ionic Components** con diseño material

### Backend/Data
- **JSON Server** - API REST simulada
- **Local Storage** - Persistencia de favoritos
- **Assets JSON** - Base de datos de personajes

### Características Técnicas
- **Signals** para estado reactivo
- **Services** con inyección de dependencias
- **Modals** para detalles de personajes
- **Infinite Scroll** para carga progresiva
- **Pull-to-Refresh** para actualización

## 📦 Instalación y Ejecución

### Prerrequisitos
```bash
Node.js 18+ 
npm 9+
Ionic CLI: npm install -g @ionic/cli
```

### 1. Clonar e Instalar
```bash
git clone https://github.com/AndresJPF/heroes-villains.git
cd heroes-villains
npm install
```

### 2. Ejecutar en Desarrollo
```bash
# Inicia tanto el frontend (puerto 8100) como el backend (puerto 3000)
npm start

# O por separado:
npm run start:front    # Frontend en http://localhost:8100
npm run start:back     # JSON Server en http://localhost:3000
```

### 3. Comandos Disponibles
```bash
npm start              # Desarrollo completo (front + back)
npm run start:front    # Solo frontend Ionic
npm run start:back     # Solo JSON Server API
npm run build          # Build producción
npm run build:android  # Build para Android
npm run open:android   # Abrir proyecto Android Studio
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── pages/
│   │   ├── explore/           # Explorar personajes
│   │   ├── favorites/         # Favoritos
│   │   └── settings/          # Configuración
│   ├── components/
│   │   ├── character-card/    # Tarjeta de personaje
│   │   └── character-detail-modal/ # Modal de detalles
│   ├── services/
│   │   ├── characters.service.ts    # API characters
│   │   ├── favorites.service.ts     # Gestión favoritos
│   │   └── theme.service.ts         # Tema claro/oscuro
│   └── models/
│       └── character.interface.ts   # Interface Character
├── assets/
│   ├── data/
│   │   └── characters.json    # Base de datos de personajes
│   └── images/
│       └── characters/        # Imágenes de personajes
└── themes/                    # Variables CSS personalizadas
```

## 🎨 Características de UI/UX

### Diseño Responsive
- **Grid adaptable** para desktop/tablet/mobile
- **Modals con breakpoints** para mejor experiencia
- **Componentes Ionic** optimizados para móvil

### Temas
- **Modo oscuro** por defecto
- **Toggle persistente** usando Capacitor Preferences
- **Variables CSS** personalizadas

### Interacciones
- **Gestos nativos** con Ionic
- **Feedback háptico** en acciones importantes
- **Animaciones fluidas** entre transiciones

## 📊 Datos de Personajes

Cada personaje incluye:
```typescript
{
  id: string;
  name: string;
  aliases: string[];
  universe: 'Marvel' | 'DC';
  affiliation: 'Hero' | 'Villain' | 'Anti-Hero';
  powerStats: { // 6 categorías de 0-100
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
  };
  powers: string[];
  weaknesses: string[];
  firstAppearance: number;
  rating: number;
  image: string;
  biography: string;
  links: { wiki: string };
}
```

## 🔧 Desarrollo

### Agregar Nuevos Personajes
1. Editar `src/assets/data/characters.json`
2. Agregar imagen en `src/assets/images/characters/`
3. La app actualizará automáticamente

### Servicios Principales
- **CharactersService**: API calls y filtrado
- **FavoriteService**: Gestión local storage
- **ThemeService**: Control tema claro/oscuro

### Build Producción
```bash
npm run build
npx cap sync android
npx cap open android
```


## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push al branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto es con fines educativos como parte de un proyecto académico.

## 👨‍💻 Autors

**AndresJPF** - [GitHub](https://github.com/AndresJPF)
**KevAlta** - [GitHub](https://github.com/KevAlta)
