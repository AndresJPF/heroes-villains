import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ExplorePageRoutingModule } from './explore-routing.module';
import { ExplorePage } from './explore.page';
import { CharacterCardComponent } from '../components/character-card/character-card.component';  // ✅ Importar el componente directamente

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExplorePageRoutingModule,
    CharacterCardComponent  // ✅ IMPORTAR el componente standalone (no el módulo)
  ],
  declarations: []  // ✅ Vacío porque todos los componentes se importan
})
export class ExplorePageModule {}