import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { VentasService } from 'src/app/services/ventas.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html'
})
export class PagoComponent implements OnInit {

  compra:any = null;
  total:number = null;
  usuario:any = null;
  loggedIn:boolean = null;
  respuestaTienda:any = null;

  constructor(private ventasService:VentasService,
              private usuariosService:UsuariosService,
              private router:Router) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    console.log(this.usuario);
    this.loggedIn = this.usuariosService.getEstadoSesion();

    if(!this.loggedIn){
      this.router.navigate(['carrito']);
    }
    else{
      this.compra = JSON.parse(localStorage.getItem("compra"));

      let subtotal = 0

      for(let x = 0; x < this.compra.length; x++){
        subtotal = this.compra[x]['cantidad'] * this.compra[x]['precio'];
        this.total += subtotal;
      }
    }
  }
  pagoTienda( id_venta:number ){
    let fechaPresente = new Date();
    let plazo = fechaPresente.getTime() + (3*24*60*60*1000);
    let fechaLimite = new Date(plazo);

    this.usuario = JSON.parse(localStorage.getItem("usuario"));

    this.ventasService.pagoTienda(this.total, fechaLimite, this.usuario, id_venta).subscribe(datos => {
      if(datos['resultado'] == "ERROR"){
        window.confirm("Ha ocurrido un error inesperado. Intentelo más tarde.");
        return
      }
      else{
        localStorage.removeItem('carrito');
        this.router.navigate(['historial']);
      }
    })
  }

  pagoTarjeta( id_venta:number ){
    this.usuario = JSON.parse(localStorage.getItem("usuario"));

    this.ventasService.pagoTarjeta(this.total, id_venta, this.usuario['id_usuario']).subscribe(datos => {
      if(datos['resultado'] == "ERROR"){
        window.confirm("Ha ocurrido un error inesperado. Intentelo más tarde.");
        return
      }
      else{
        window.location.href = datos['url'];
        localStorage.removeItem('carrito');
        // this.router.navigate(['historial']);
      }
    })
  }

  registrarVenta( metodo:number ){
    this.ventasService.crearVenta(this.compra, Number(this.usuario['id_usuario'])).subscribe( datos => {
      if(datos['resultado'] == "ERROR"){
        window.confirm("Ha ocurrido un error inesperado. Intentelo más tarde.");
        return
      }
      else{
        if(datos['estado'] == 0){
          for(let x = 0; x < datos['mensajes'].length; x++){
            window.confirm(datos['mensajes'][x]);
          }
        }
        else{
          // console.log(datos);
          if(metodo == 1){
            this.pagoTienda(datos['id_venta']);
          }
          else{
            this.pagoTarjeta(datos['id_venta']);
          }
        }
      }
    })
  }

}
