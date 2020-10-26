import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute } from '@angular/router';
import { PublicacionesService } from '../../services/publicaciones.service';

@Component({
  selector: 'app-publicacion-view',
  templateUrl: './publicacion-view.component.html'
})
export class PublicacionViewComponent implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['Previous', 'Next'],
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
    },
    nav: true
  }

  publicacion:any = {};

  imgs:any = null;

  constructor( private activatdRoute:ActivatedRoute,
               private publicacionesService:PublicacionesService
             ) { }

  ngOnInit(){
    this.activatdRoute.params.subscribe( params => {
      this.publicacionesService.getPublicacion(params['id']).subscribe( respuesta => this.publicacion = respuesta[0] );
      this.publicacionesService.getImgs(params['id']).subscribe( respuesta => this.imgs = respuesta);
    })
  }

}
