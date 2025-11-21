import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ExplorePageRoutingModule } from './explore-routing.module';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';  

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExplorePageRoutingModule,
    CharacterCardComponent  
  ],
  declarations: [] 
})
export class ExplorePageModule {}