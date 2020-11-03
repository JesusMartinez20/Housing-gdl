import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {CuartosService} from '../../services/cuartos.service';
import {ActivatedRoute} from '@angular/router';
import {CasasService} from '../../services/casas.service';
import {UsuariosService} from '../../services/usuarios.service';
import {environment} from '../../../environments/environment'
import {Router} from '@angular/router';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";

declare var google;

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
  casa: any = {};
  imgs: any = null;

  //boletos:any = null;
  cuartos: any = null;
  usuario: any = null;
  noCuartos: boolean = false;

  puedeComentar: boolean = false;
  puedeEliminar: boolean = false;
  comentar: boolean = false;
  comentarios: any = null;
  sinComentarios: boolean = true;
  cancelado: boolean = false;
  id_casa:number = null;
  id_usuario:number = null;

  loggedIn: boolean = false;

  closerHouses: any = [];

  //@ViewChild('cantBoleto') cantBoleto: ElementRef;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private casasService: CasasService,
              private cuartosService: CuartosService,
              private usuariosService: UsuariosService,
              private httpClient: HttpClient
  ) {
  }

  ngOnInit() {

    this.loggedIn = this.usuariosService.getEstadoSesion();
    this.activatedRoute.params.subscribe(params => {
      //this.getEstadoEvento(params['id']);
      this.id_casa = params['id'];
      this.getComentarios(params['id']);
      if (this.loggedIn) {
        let usuario = JSON.parse(localStorage.getItem("usuario"));
        this.id_usuario = usuario["id_usuario"];
        this.validarComentarios(params['id']);
      }
      this.casasService.getCasa(params['id']).subscribe(resultado => {
        this.casa = resultado[0];

        this.casasService.getCasas().subscribe(response => {
          const origin = encodeURI(this.casa.direccion_casa);
          const responseArray = <Array<any>>response;
          let filteredHouses = responseArray.filter(c => c.id_casa !== this.casa.id_casa);
          let destinations = filteredHouses.map(c => c.direccion_casa);
          const service = new google.maps.DistanceMatrixService();

          let request = {
            origins: [this.casa.direccion_casa],
            destinations: destinations,
            travelMode: 'DRIVING',
            avoidHighways: false,
            avoidTolls: false,
          };

          service.getDistanceMatrix(request, (r, status) => {
              console.log("Recibio respuesta");
              let houses = [];
              r.rows[0].elements.forEach(((value, index) => {
                if (value.distance.value > 20000) return;
                houses.push({
                  ...filteredHouses[index],
                  distance: value.distance.value
                });
              }));

              houses = houses.sort((a, b) => a.distance - b.distance).slice(0, 5);

              this.closerHouses = houses;
              console.log(this.closerHouses);
            });
        }, error => {
          console.warn("Error");
          console.log(error);
        }, () => console.log('Completa'));
      });
      this.casasService.getImgs(params['id']).subscribe(resultado => this.imgs = resultado);
      this.getCuartos(params['id']);
    })
  }

  verCuarto(id_cuarto: number) {
    this.router.navigate(['cuarto', id_cuarto]);
  }

  getCuartos(id_casa: number) {
    this.cuartosService.getCuartos(id_casa).subscribe(resultado => {
      if (resultado == null) {
        this.noCuartos = true;
      } else {
        this.noCuartos = false;
        this.cuartos = resultado;
      }
    });
  }


  validarComentarios(id_casa: number) {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.usuariosService.comprobarComentarios(this.id_usuario, id_casa).subscribe(datos => {
      if (datos != null) {
        this.comentar = false;
        //this.getComentarios(id_casa);
        return
      } else {
        this.usuariosService.validarComentarios(this.id_usuario, id_casa).subscribe(resultado => {
          if (resultado["validacion"] = 0) {
            this.comentar = true;
            //this.getComentarios(id_casa);
          } else {
            this.comentar = false;
            //this.getComentarios(id_casa);
          }
        })
      }
    })
  }

  insertarComentario(comentario: string, cal_instalaciones: number, cal_ambiente: number, cal_limpieza: number) {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
      this.usuariosService.insertarComentario(comentario, cal_instalaciones, cal_ambiente, cal_limpieza, this.id_casa, this.id_usuario).subscribe(resultado => {
        this.comentar = false;
        this.getComentarios(this.id_casa);
      });
  }

  getComentarios(id_casa: number) {
    this.casasService.getComentarios(id_casa).subscribe(resultado => {
      this.comentarios = resultado;

      if (this.comentarios == null) {
        this.sinComentarios = true;
      } else {
        this.sinComentarios = false;

        for (let x = 0; x < this.comentarios.length; x++) {
          console.log(this.comentarios[x]['id_usuario']);
          if (this.comentarios[x]['id_usuario'] == this.usuario['id_usuario']) {
            this.comentarios[x]['eliminar'] = true;
          } else {
            this.comentarios[x]['eliminar'] = false;
          }
        }
      }
    })
  }

  eliminarComentario(id_calificacion: number) {
    if (window.confirm("Está seguro de querer eliminar el comentario?")) {
      this.usuariosService.eliminarComentrio(id_calificacion).subscribe(() => {
        this.activatedRoute.params.subscribe(params => {
          this.validarComentarios(params['id']);
        });
      });
    }
  }

  verCasa( id_casas:number ){
    this.router.navigate(['casa', id_casas]);
  }
}
