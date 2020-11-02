import { Component, OnInit, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CuartosService } from '../../services/cuartos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CasasService } from '../../services/casas.service';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-cuarto',
  templateUrl: './cuarto.component.html'
})
export class CuartoComponent implements OnInit {

  imgUrl = environment.imgUrl;
  cuarto:any = {};
  id_semestre:number = null;
  semestres:any = [];
  imgs:any = [];
  id_cuarto:number = null;
  oferta:any = [];

  public customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['Anterior', 'Siguietne'],
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

  constructor(private activatedRoute:ActivatedRoute,
    private cuartosService:CuartosService,
    private fb:FormBuilder,) { }

    ngOnInit() {
      this.activatedRoute.params.subscribe( params => {
        this.cuartosService.getCuarto(params['id']).subscribe( resultado => {

          this.cuarto = resultado[0];
          console.log(this.cuarto.descripcion_cuarto);
        });
        this.cuartosService.getImgs(params['id']).subscribe(resultado => {
          this.imgs = resultado
          console.log(this.imgs)
        });
        this.cuartosService.getSemestres().subscribe(resultado => {
          this.semestres = resultado
        });
        this.id_cuarto = params['id'];
      });

    }



  getOferta( event:any ){
    this.id_semestre = event
    if(this.id_semestre != null){
      this.cuartosService.getOferta(this.id_semestre, this.id_cuarto).subscribe( resultado => this.oferta = resultado)
    }
    else{
      return
    }
  }


}
