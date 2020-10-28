import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicacionesService } from '../../services/publicaciones.service';
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.component.html'
})
export class PublicacionesComponent implements OnInit {
  rutaimgPublicacion = environment.imgUrlPublicacion;
  publicaciones = null;

  publicacion = {
    id_publicacion:null,
    titulo_pub:null,
    articulo_pub:null,
    creacion_pub:null
  }

  constructor(private router:Router,
              private publicacionesService:PublicacionesService
              ) { }

  ngOnInit() {
    this.getPublicaciones();
  }

  getPublicaciones(){
    this.publicacionesService.getPublicaciones().subscribe( resultado => this.publicaciones = resultado);
  }

  verPublicacion( id_publicacion:number ){
    this.router.navigate(['publicacion', id_publicacion])
  }

}
