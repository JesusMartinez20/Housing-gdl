import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-compra-info',
  templateUrl: './compra-info.component.html'
})
export class CompraInfoComponent implements OnInit {

  elementosVenta:any = null;
  pago:string = null;
  usuario:any = null;
  loggedIn: boolean = false;

  constructor(private usuariosService:UsuariosService,
              private activatedRoute:ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.loggedIn = this.usuariosService.getEstadoSesion();
    if (this.loggedIn == false) {
        this.router.navigate(['inicio'])
    }
    this.activatedRoute.params.subscribe(params => {
      //this.verificarPago(params['id']);
      this.usuario = JSON.parse(localStorage.getItem("usuario"));
      this.usuariosService.miCompra(params['id'], this.usuario.id_usuario).subscribe(resultado=>{
        if(resultado == false){
          this.router.navigate(['inicio'])
        }
      })
      this.usuariosService.elementosVenta(params['id']).subscribe(resultado => {
        this.elementosVenta = resultado;
        console.log(this.elementosVenta);
      });

    });
  }

  /*verificarPago( id_venta:number ){
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.usuariosService.verificarPago(id_venta, this.usuario['id_usuario']).subscribe(datos => {
      console.log(datos);
      this.pago = datos['pago'];
    })
  }*/

}
