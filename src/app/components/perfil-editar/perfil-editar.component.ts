import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-editar',
  templateUrl: './perfil-editar.component.html'
})
export class PerfilEditarComponent implements OnInit {

  usuarioFB:any = null;
  usuario:any = {};

  formEditar:FormGroup;

  loggedIn:boolean = false;

  constructor(private usuariosService:UsuariosService,
              private fb:FormBuilder,
              private router:Router) { }

  ngOnInit() {

    this.loggedIn = this.usuariosService.getEstadoSesion();

    if(!this.loggedIn){
      this.router.navigate(['inicio']);
    }
    else{
      this.editarFormInit();
      this.usuarioFB = JSON.parse(localStorage.getItem("usuario"));
      this.usuariosService.getUsuario(this.usuarioFB.id).subscribe( resultado => {
        this.usuario = resultado;
        this.formEditar.setValue({
          correo: this.usuario.correo,
          celular: this.usuario.celular,
          celularExt: this.usuario.celular_ext
        });
      });
    }
  }

  editarFormInit(){
    this.formEditar = this.fb.group({
      correo:[null, [Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'), Validators.required]],
      celular:[null, Validators.required],
      celularExt:[null, Validators.required]
    });
  }

  get validacionCorreoR(){
    return this.formEditar.get('correo').invalid && this.formEditar.get('correo').touched
  }

  get validacionNumero(){
    return this.esAlfa(this.formEditar.get('celular').value) && this.formEditar.get('celular').value != ""
  }

  get validacionNumeroExtra(){
    return this.esAlfa(this.formEditar.get('celularExt').value) && this.formEditar.get('celularExt').value != ""
  }

  esAlfa(str) {
    if(str != null){
      if (!str.match(/^[0-9]+$/)){
        return true
      }
      else{
        return false
      }
    }
  }

  guardarCambios(){
    this.formEditar.addControl('id_usuario', this.fb.control(null));
    this.formEditar.get('id_usuario').setValue(this.usuarioFB['id_usuario']);
    console.log(this.formEditar.value);
    this.usuariosService.buscarCorreo(this.formEditar.get('correo').value, this.formEditar.get('id_usuario').value).subscribe(datos => {
      if(datos['estado'] == 0){
        window.confirm(datos['mensaje']);
        return
      }
      else if(datos['estado'] == 1){
        this.usuariosService.editarInformacion(this.formEditar.value).subscribe(datos => {
          if(datos['resultado'] == "ERROR"){
            window.confirm("Ha ocurrido un error inesperado. Intentar más tarde.")
            return
          }
          else{
            window.confirm("Información editada con éxito.")
            this.router.navigate(['perfil']);
          }
        })
      }
    });
  }

  regresar(){
    this.router.navigate(['perfil']);
  }

}
