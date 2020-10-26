import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-compra-info',
  templateUrl: './compra-info.component.html'
})
export class CompraInfoComponent implements OnInit {

  elementosVenta:any = null;
  id_evento:number = null;
  pago:string = null;
  usuario:any = null;

  constructor(private usuariosService:UsuariosService,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.id_evento = params['id'];
      this.verificarPago(params['id']);
      this.usuariosService.elementosVenta(params['id']).subscribe(resultado => {
        this.elementosVenta = resultado;
        console.log(this.elementosVenta);
      });

    });
  }

  verificarPago( id_venta:number ){
    this.usuario = JSON.parse(localStorage.getItem("usuario"));
    this.usuariosService.verificarPago(id_venta, this.usuario['id_usuario']).subscribe(datos => {
      console.log(datos);
      this.pago = datos['pago'];
    })
  }

}
