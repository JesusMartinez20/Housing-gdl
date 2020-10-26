import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Router } from '@angular/router';
import { PublicacionesService } from '../../services/publicaciones.service';
import { EventosService } from '../../services/eventos.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html'
})
export class InicioComponent implements OnInit {

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

  eventos = null;

  imgs = null;

  evento = {
    id_evento:null,
    nombre_evento:null,
    descripcion_evento:null
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
               private eventosService:EventosService,
              ) { }

  ngOnInit() {
    this.getEventos();
    this.getPublicaciones();
    this.getCarousel();
  }

  getCarousel(){
    this.eventosService.getCarousel().subscribe( resultado => this.carousel = resultado);
    console.log(this.carousel);
  }

  getEventos(){
    this.eventosService.getEventos().subscribe( resultado => this.eventos = resultado );
  }

  getPublicaciones(){
    this.publicacionesService.getPublicaciones().subscribe( resultado => this.publicaciones = resultado);
  }

  verEvento( id_evento:number ){
    this.router.navigate(['evento', id_evento]);
  }

  verPublicacion( id_piblicacion:number ){
    this.router.navigate(['publicacion', id_piblicacion])
  }
}
