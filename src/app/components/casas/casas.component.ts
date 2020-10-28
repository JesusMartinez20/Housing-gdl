import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CasasService } from '../../services/casas.service';
import { FormBuilder, FormGroup } from "@angular/forms";
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-casas',
  templateUrl: './casas.component.html'
})
export class CasasComponent implements OnInit {
  rutaimgCasa = environment.imgUrl;
  casas:any = null;

  formFiltros:FormGroup;

  noCasas:boolean = false;

  constructor( private router:Router,
               private casasService:CasasService,
               private fb:FormBuilder
              ) { }

  ngOnInit() {
    this.getCasas();
    this.formFiltrosInit();
  }

  formFiltrosInit(){
    this.formFiltros = this.fb.group({
      tipo:[null]
    });
  }

  getCasas(){
    this.casasService.getCasas().subscribe( resultado => this.casas = resultado );
  }

  filtrar(){
      console.log(this.formFiltros.value);
      this.casasService.filtrarCasas(this.formFiltros.value).subscribe( resultado => {
        if(resultado == 0){
          this.noCasas = true;
          console.log(resultado);
          return
        }
        else{
          this.noCasas = false;
          this.casas = resultado;
          console.log(resultado);
        }
      })
  }


  verCasa( id_casas:number ){
    this.router.navigate(['casa', id_casas]);
  }

}
