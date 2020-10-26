import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VentasService } from 'src/app/services/ventas.service';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html'
})
export class CompraComponent implements OnInit {

  formCodigo:FormGroup;
  formReferencia:FormGroup;
  carrito:any = null;
  usuario:any = null;
  compra:any = null;
  total:any = null;
  loggedIn:boolean = null;

  @ViewChild('cerrarModalPromoCod', {static: false}) cerrarModalPromoCod;
  @ViewChild('cerrarModalPromoRef', {static: false}) cerrarModalPromoRef;

  constructor( private fb:FormBuilder,
               private ventasService:VentasService,
               private usuariosService:UsuariosService,
               private router:Router) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.loggedIn = this.usuariosService.getEstadoSesion();

    if(!this.loggedIn){
      this.router.navigate(['carrito']);
    }
    else{
      this.formCodigoInit();
      this.formReferenciaInit();
      this.compra = JSON.parse(localStorage.getItem("carrito"));
      let subtotal = 0

      for(let x = 0; x < this.compra.length; x++){
        subtotal = this.compra[x]['cantidad'] * this.compra[x]['precio'];
        this.total += subtotal;
      }
    }


  }

  formCodigoInit(){
    this.formCodigo = this.fb.group({
      codigo:[null, [Validators.required, Validators.max(10), Validators.min(10)]]
    })
  }

  formReferenciaInit(){
    this.formReferencia = this.fb.group({
      codigoBoleto:[null, Validators.required]
    })
  }

  aplicarPromoCodigo(){
    this.ventasService.aplicarPromoCodigo(this.formCodigo.get('codigo').value).subscribe( datos => {
        if(datos['resultado'] == "ERROR"){
          window.confirm("Ha ocurrido un error inesperado.");
          return
        }
        else if(datos['resultado'] == "OK"){
          if(datos['estado'] == 0){
            window.confirm(datos['mensaje']);
            return
          }
          else if(datos['estado'] == 1){

            let id_promo = datos['id'];
            let id_boleto = datos['boleto'];
            let cantidad_cod = datos['cantidad'];
            let precio_cod = datos['precio'];

            let carrito;

            if(this.compra != null){
              carrito = this.compra
            }
            else{
              carrito = JSON.parse(localStorage.getItem("carrito"));
            }

            let cantCarrito = carrito.length;

            let y = 0;

            for(let x = 0; x < cantCarrito; x++){
              if(carrito[x]['id_promo'] == id_promo){
                window.confirm("El codigo que se intenta aplicar ya se aplico.");
                return
              }else if(carrito[x]['id_promo'] == null && carrito[x]['id_boleto'] == id_boleto){

                y = 1;
                let cantidad = Number(carrito[x]['cantidad']);
                cantidad = cantidad - Number(cantidad_cod);

                if(cantidad <= 0){
                    cantidad = cantidad + Number(cantidad_cod);
                    carrito[x]['precio'] = precio_cod;
                    carrito[x]['cantidad'] = cantidad;
                    carrito[x]['limite'] = cantidad_cod;
                    carrito[x]['tipo'] = 2;
                    carrito[x]['id_promo'] = id_promo;
                }else{
                    //sobrepasa la promocion
                    carrito[cantCarrito] = {};
                    carrito[cantCarrito]['id_boleto'] = carrito[x]['id_boleto'];
                    carrito[cantCarrito]['cantidad'] = cantidad;
                    carrito[cantCarrito]['nombre'] = carrito[x]['nombre'];
                    carrito[cantCarrito]['precio'] = carrito[x]['precio'];
                    carrito[cantCarrito]['limite'] = carrito[x]['limite'];
                    carrito[cantCarrito]['tipo'] = 0;
                    carrito[cantCarrito]['id_promo'] = null;
                    carrito[x]['cantidad'] = Number(cantidad_cod);
                    carrito[x]['precio'] = precio_cod;
                    carrito[x]['limite'] = cantidad_cod;
                    carrito[x]['tipo'] = 2;
                    carrito[x]['id_promo'] = id_promo;
                }
                break;
              }
            }
            if(y == 0){
              window.confirm("El código ingresado no aplica para ninguno de sus boletos.");
              return
            }
            this.compra = carrito;
            let subtotal = 0;
            this.total = 0;

            for(let x = 0; x < this.compra.length; x++){
              subtotal = this.compra[x]['cantidad'] * this.compra[x]['precio'];
              this.total += subtotal;
            }

            window.confirm("Promocion aplicada con exito.")
            this.cerrarModalPromoCod.nativeElement.click();
          }
        }
    })

  }

  aplicarPromoReferencia(){
    let codigo = Number(this.formReferencia.get('codigoBoleto').value);

    if(this.compra != null){
      this.carrito = this.compra
    }
    else{
      this.carrito = JSON.parse(localStorage.getItem("carrito"));
    }

    this.ventasService.aplicarPromoRelacionado( codigo, Number(this.usuario['id_usuario']), this.carrito).subscribe( datos => {
      if(datos["resultado"] == "ERROR"){
        window.confirm("Ocurrió un error inesperado, inténtelo de nuevo más tarde.");
        return
      }
      else{
        if(datos['estado'] == 0){
          window.confirm(datos["mensaje"]);
          return
        }
        else{
          window.confirm("Promocion aplicada con exito.")
          this.cerrarModalPromoRef.nativeElement.click();
          this.compra = datos["carrito"];

          console.log(this.compra);
          let subtotal = 0;
          this.total = 0;

          for(let x = 0; x < this.compra.length; x++){
            subtotal = this.compra[x]['cantidad'] * this.compra[x]['precio'];
            this.total += subtotal;
          }
        }
      }
    });


  }

  get codigoValidacion(){
    return this.formCodigo.get('codigo').invalid && this.formCodigo.get('codigo').touched
  }

  hacerCompra(){
    localStorage.setItem("compra", JSON.stringify(this.compra));
    this.router.navigate(['pago']);
  }
}
