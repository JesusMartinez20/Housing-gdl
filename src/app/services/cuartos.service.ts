import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import {environment} from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CuartosService {

  // url = "https://proyectotapatio.com/PT-API-P/boletos/";
  url = environment.apiUrl+"/casas/";

  constructor(private http:HttpClient) { }

  getCuartos( id_casa:number ){
    return this.http.get(`${this.url}cuartos/verCuartosCasa.php?id_casa=${id_casa}`).pipe(retry(3))
  }
  getCuarto( id_cuarto:number ){
    return this.http.get(`${this.url}cuartos/VerCuarto.php?id_cuarto=${id_cuarto}`)//.pipe(retry(3))
  }
  getImgs( id_cuarto:number ){
    return this.http.get(`${this.url}cuartos/verImagenesCuarto.php?id_cuarto=${id_cuarto}`)//.pipe(retry(3))
  }
  getSemestres(){
    return this.http.get(`${this.url}cuartos/verSemestres.php`)
  }
  getOferta(id_semestre:number, id_cuarto:number ){
    return this.http.get(`${this.url}cuartos/ofertaSemestre.php?id_semestre=${id_semestre} && id_cuarto=${id_cuarto}`)
  }

}
