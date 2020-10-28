import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { PublicacionesService } from '../../services/publicaciones.service';
import { CasasService } from '../../services/casas.service';
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html'
})
export class InicioComponent implements OnInit {
  rutaimgCasa = environment.imgUrl;
  rutaimgPublicacion = environment.imgUrlPublicacion;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['Anterior', 'Siguiente'],
    nav: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 3
      }
    }
  }

  casas = null;

  imgs = null;

  casa = {
    id_casa:null,
    nombre_casa:null,
    descripcion_casa:null
  }

  publicaciones = null;

  carousel = null;

  publicacion = {
    id_publicacion:null,
    titulo_pub:null,
    articulo_pub:null,
    creacion_pub:null
  }

  constructor( private router:Router,
               private publicacionesService:PublicacionesService,
               private casasService:CasasService,
              ) { }

  ngOnInit() {
    this.getCasas();
    this.getPublicaciones();
    this.getCarousel();
  }

  getCarousel(){
    this.casasService.getCarousel().subscribe( resultado => this.carousel = resultado);
    console.log(this.carousel);
  }

  getCasas(){
    this.casasService.getCasas().subscribe( resultado => this.casas = resultado );
  }

  getPublicaciones(){
    this.publicacionesService.getPublicaciones().subscribe( resultado => this.publicaciones = resultado);
  }

  verCasa( id_casa:number ){
    this.router.navigate(['casa', id_casa]);
  }

  verPublicacion( id_publicacion:number ){
    this.router.navigate(['publicacion', id_publicacion])
  }
}
