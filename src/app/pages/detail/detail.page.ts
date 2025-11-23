import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DetailPage implements OnInit {
  characterId: string | null = null;

  constructor(
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.characterId = this.route.snapshot.paramMap.get('id');
    console.log('Character ID:', this.characterId);
    //cargamos los datos del personaje
  }
}