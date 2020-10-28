import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CuartosService } from '../../services/cuartos.service';
import { ActivatedRoute } from '@angular/router';
import { CasasService } from '../../services/casas.service';
import { UsuariosService } from '../../services/usuarios.service';
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-casa-view',
  templateUrl: './casa-view.component.html'
})
export class CasaViewComponent implements OnInit {
  rutaimgCasa = environment.imgUrl;
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

  //evento:any = {};
  casa:any = {};
  imgs:any = null;

  //boletos:any = null;
  cuartos:any = null;
  usuario:any = null;

  puedeComentar:boolean = false;
  puedeEliminar:boolean = false;
  comentar:boolean = false;
  comentarios:any = null;
  sinComentarios:boolean = true;
  cancelado: boolean = false;

  loggedIn:boolean = false;

  //@ViewChild('cantBoleto') cantBoleto: ElementRef;

  constructor( private activatedRoute:ActivatedRoute,
               private casasService:CasasService,
               private cuartosService:CuartosService,
               private usuariosService:UsuariosService
              ) { }

  ngOnInit(){
    this.loggedIn = this.usuariosService.getEstadoSesion();
    this.activatedRoute.params.subscribe( params => {
      //this.getEstadoEvento(params['id']);
      this.getComentarios(params['id']);
      if(this.loggedIn){
        this.validarComentarios(params['id']);
      }
      this.casasService.getCasa(params['id']).subscribe( resultado => this.casa = resultado[0]);
      this.casasService.getImgs(params['id']).subscribe(resultado => this.imgs = resultado);
      this.cuartosService.getBoletos(params['id']).subscribe(resultado => this.cuartos = resultado);
    })
  }

  validarComentarios( id_casa:number ){
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.usuariosService.validarComentarios(this.usuario['id_casa'], id_casa).subscribe(datos => {
        if(datos['estado'] == 0){
          this.comentar = false;
          this.getComentarios(id_casa);
          return
        }
        else{
          this.usuariosService.comprobarComentarios(this.usuario['id_usuario'], id_casa).subscribe(resultado => {
            if(resultado == 1){
              this.comentar = true;
              this.getComentarios(id_casa);
            }
            else{
              this.comentar = false;
              this.getComentarios(id_casa);
            }
          })
        }
    })
  }

  insertarComentario( comentario:string, cal:number){
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.activatedRoute.params.subscribe( params => {
      this.usuariosService.insertarComentario(comentario, cal, params['id'], this.usuario['id_usuario']).subscribe( resultado => {
          this.comentar = false;
          this.getComentarios(params['id']);
      });
    });
  }

  getComentarios(id_casa:number){
    this.casasService.getComentarios(id_casa).subscribe(resultado => {
      this.comentarios = resultado;

      if(this.comentarios == null){
        this.sinComentarios = true;
      }
      else{
        this.sinComentarios = false;

        for(let x = 0; x<this.comentarios.length; x++){
          console.log(this.comentarios[x]['id_usuario']);
          if(this.comentarios[x]['id_usuario'] == this.usuario['id_usuario']){
            this.comentarios[x]['eliminar'] = true;
          }
          else{
            this.comentarios[x]['eliminar'] = false;
          }
        }
      }
    })
  }

  eliminarComentario( id_calificacion:number ){
    if(window.confirm("Está seguro de querer eliminar el comentario?")){
      this.usuariosService.eliminarComentrio(id_calificacion).subscribe( () => {
        this.activatedRoute.params.subscribe( params => {
          this.validarComentarios(params['id']);
        });
      });
    }
  }

  /*agregarCarrito( nombre:string, precio:number, cantidad:number, id:number){
    let carrito = new Array(new Object);

    if(localStorage.getItem("carrito")){

        carrito = JSON.parse(localStorage.getItem("carrito"));

        let ultimaposicion = carrito.length;
        let paso = 1;
        for(let y = 0; y < ultimaposicion ; y++){
            if(carrito[y]['nombre'] == nombre){
                let cant = Number(carrito[y]['cantidad']);
                carrito[y]['cantidad'] = Number(cantidad) + Number(cant);
                paso = 0;
                break;
            }
        }
        if(paso == 1){
            carrito[ultimaposicion] = {};
            carrito[ultimaposicion]['id_boleto'] = id;
            carrito[ultimaposicion]['index'] = ultimaposicion;
            carrito[ultimaposicion]['nombre'] = nombre;
            carrito[ultimaposicion]['precio'] = precio;
            carrito[ultimaposicion]['cantidad'] = cantidad;
            carrito[ultimaposicion]['limite'] = 65535;
            carrito[ultimaposicion]['tipo'] = 0;
            carrito[ultimaposicion]['id_promo'] = null;
        }

    }else{
        let ultimaposicion = 0;
        carrito[ultimaposicion]['id_boleto'] = id;
        carrito[ultimaposicion]['index'] = ultimaposicion;
        carrito[ultimaposicion]['nombre'] = nombre;
        carrito[ultimaposicion]['precio'] = precio;
        carrito[ultimaposicion]['cantidad'] = cantidad;
        carrito[ultimaposicion]['limite'] = 65535;
        carrito[ultimaposicion]['tipo'] = 0;
        carrito[ultimaposicion]['id_promo'] = null;
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.confirm("Agregado al carrito...");
    console.log(carrito);
  }*/

}
