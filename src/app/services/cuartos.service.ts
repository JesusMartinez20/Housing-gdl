import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import {environment} from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CuartosService {

  // url = "https://proyectotapatio.com/PT-API-P/boletos/";
  url = environment.apiUrl+"/cuartos/";

  constructor(private http:HttpClient) { }

  getCuartos( id_casa:number ){
    return this.http.get(`${this.url}verCuartosCasa.php?id_casa=${id_casa}`).pipe(retry(3))
  }
/*
  getBoleto( id_boleto:number ){
    return this.http.get(`${this.url}getBoleto.php?id_boleto=${id_boleto}`).pipe(retry(3))
  }

  getPromosCodigo( id_boleto:number ){
    return this.http.get(`${this.url}getPromosCodigo.php?id_boleto=${id_boleto}`).pipe(retry(3))
  }

  getPromosFechas( id_boleto:number ){
    return this.http.get(`${this.url}getPromosFechas.php?id_boleto=${id_boleto}`).pipe(retry(3))
  }*/

}
