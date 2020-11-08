import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.component.html'
})
export class HistorialComprasComponent implements OnInit {

  usuario:any = {};

  historial:any = [];

  hayCompras:boolean = false;

  loggedIn:boolean = false;

  constructor(private router:Router,
              private usuariosService:UsuariosService) { }

  ngOnInit(): void {

    this.loggedIn = this.usuariosService.getEstadoSesion();

    if(!this.loggedIn){
      this.router.navigate(['inicio']);
    }
    else{
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
      this.usuariosService.verVentas(this.usuario['id_usuario']).subscribe(resultado => {
        console.log(resultado)
        if(resultado != null){
          this.hayCompras = true;
          this.historial = resultado;
          console.log(this.historial);
        }
        else{
          this.hayCompras = false;
        }
      })
    }
  }

  verCompra(id_venta:number){
    this.router.navigate(['info-compra', id_venta])
  }

}
