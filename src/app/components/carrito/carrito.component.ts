import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html'
})
export class CarritoComponent implements OnInit {

  vacioMsg:string = null;
  vacio:boolean = null;
  carrito:any = null;
  precioTotal:number = null;

  bloqBtn:boolean = false;

  loggedIn:boolean = false;


  constructor(private router:Router,
              private usuariosService:UsuariosService) { }

  ngOnInit() {
    console.log(this.loggedIn);
    this.carrito = JSON.parse(localStorage.getItem("carrito"));
    if( localStorage.getItem("carrito") && this.carrito.length != 0 ) {

      this.vacio = false;
      let subtotal = 0

      for(let x = 0; x < this.carrito.length; x++){
        subtotal = this.carrito[x]['cantidad'] * this.carrito[x]['precio'];
        this.precioTotal += subtotal;
      }

    }else{
        this.vacio = true;
    }
    console.log(this.carrito);
  }

  modificarCarrito( i:number, cant:number, op:number ){
    console.log(cant);

    this.carrito = JSON.parse(localStorage.getItem("carrito"));

    if(this.carrito[i]['index'] == i){
      this.carrito[i]['cantidad'] = cant;
      this.carrito[i]['bloqueado'] = false;

      if(op == 1){
        this.precioTotal = this.precioTotal + Number(this.carrito[i]['precio']);
      }
      else if(op == 0 && cant >= 0){

        if(cant == 0 && this.carrito[i]['bloqueado'] == false){
          this.precioTotal = this.precioTotal - Number(this.carrito[i]['precio']);
          this.carrito[i]['bloqueado'] = true;
        }
        else{
          this.precioTotal = this.precioTotal - Number(this.carrito[i]['precio']);
        }
      }
    }

    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }

  eliminarBoleto( i:number ){
    this.carrito = JSON.parse(localStorage.getItem("carrito"));
    this.carrito.splice(i,1);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    if(this.carrito.length != 0) {
      let subtotal = 0

      this.vacio = false;

      this.precioTotal = 0;

      for(let x = 0; x < this.carrito.length; x++){
        subtotal = this.carrito[x]['cantidad'] * this.carrito[x]['precio'];
        this.precioTotal += subtotal;
      }
    }
    else{
      this.vacio = true;

    }
  }

  irACompra(){
    this.loggedIn = this.usuariosService.getEstadoSesion();
    console.log(this.loggedIn);
    if(this.loggedIn == true){
      this.router.navigate(['compra']);
    }
    else{
      window.confirm("No puede realizar compras si no ha iniciado sesión");
    }
  }
}
