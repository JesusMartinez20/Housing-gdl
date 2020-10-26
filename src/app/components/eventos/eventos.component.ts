import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html'
})
export class EventosComponent implements OnInit {

  eventos:any = null;

  formFiltros:FormGroup;

  noEventos:boolean = false;

  constructor( private router:Router,
               private eventosService:EventosService,
               private fb:FormBuilder
              ) { }

  ngOnInit() {
    this.getEventos();
    this.formFiltrosInit();
  }

  formFiltrosInit(){
    this.formFiltros = this.fb.group({
      tipo:[null],
      estado:[null],
      precioMin:[null],
      precioMax:[null]
    });
  }

  getEventos(){
    this.eventosService.getEventos(-1).subscribe( resultado => this.eventos = resultado );
  }

  filtrar(){
      console.log(this.formFiltros.value);
      this.eventosService.filtrarEventos(this.formFiltros.value).subscribe( resultado => {
        if(resultado == 0){
          this.noEventos = true;
          console.log(resultado);
          return
        }
        else{
          this.noEventos = false;
          this.eventos = resultado;
          console.log(resultado);
        }
      })
  }


  verEvento( id_evento:number ){
    this.router.navigate(['evento', id_evento]);
  }

}
