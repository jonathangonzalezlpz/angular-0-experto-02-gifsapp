import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root' //a partir de angular 4 de esta forma se convierte en un ambito global
})
export class GifsService {

  private apiKey: string = '49UXFZ7bhSmxDE7Mq8eqY7B7nSqe4QCv';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];
  
  get historial(): string[] {
    return [...this._historial];
  }

  //Inyectamos el servicio del modulo httpclient
  constructor( private _http: HttpClient ) {
    //Recuperamos el historial de local
    //1 forma de hacerlo es 
    /*
    if(localStorage.getItem('historial')){
      this._historial = JSON.parse( localStorage.getItem("historial")! ); //como ya comprobamos el null hacemos que confie con !
    }*/
    //Otra forma más rapida, en 1 línea
    this._historial = JSON.parse( sessionStorage.getItem("historial")! ) || [];
    //Recuperamos el ultimor resultado
    this.resultados = JSON.parse( sessionStorage.getItem('ultimoResultado')! ) || [];
  }

  //metodos
  buscarGifs( query: string = ''): void{
    
    query = query.trim().toLowerCase(); //trim eliminamos espacios, pasamos todo a minusculas para evitar duplicados minus mayus
    //if ( valor.trim().length === 0 ){ return ; } Controla que no se haga nada con un ENTER vacío, pero ya lo hacemos en la busqueda
    if( !this._historial.includes( query ) ){ //controlamos que no se repitan
      this._historial.unshift( query ); //unshift para insertar al principio
      //Limitamos a 10
      this._historial = this._historial.splice(0,10); 
      //podría hacerse en el getter pero es mejor aqui para evitar cortes cuando no son necesarios, no se inserta nada desde el ultimo corte

      //Grabamos en local storage esto es propio de JS
      //Hay que hacer JSON.Stringify porque solo podemos guardar strings
      sessionStorage.setItem('historial', JSON.stringify( this._historial ) );
    }

    //angular nos ofrece un objeto ya encargado de las peticiones http utilizando el modulo HttpClientModule de angular/common/http
    //Va a trabajar con Observables que son más poderosos que las promesas
    //Utilizamos ``para poder acceder a interpolacion de strings
    //puede indicarse el tipo en resp: SearchGifsResponse pero ahora se recomienda
    //indicarlo en el generico del Get, Tipado estricto asi ya sabemos que propiedades tiene
    /* Forma bruta de hacer la consulta poco mantenible
    this._http.get<SearchGifsResponse>(`https://api.giphy.com/v1/gifs/search?api_key=49UXFZ7bhSmxDE7Mq8eqY7B7nSqe4QCv&q=${ query }&limit=10`)
    .subscribe( ( resp ) => {
      console.log( resp.data ); 
      this.resultados = resp.data;
      sessionStorage.setItem("ultimoResultado", JSON.stringify(resp.data));
    })
    */

    const params = new HttpParams()
      .set("api_key",this.apiKey)
      .set("limit","10")
      .set("q", query);

    //valdría con pasar solo { params } ya que el nombre de la propiedad y el objeto tienen el mismo nombre, es redundate
    this._http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, { params: params })
      .subscribe( ( resp ) => {
        console.log( resp.data ); 
        this.resultados = resp.data;
        sessionStorage.setItem("ultimoResultado", JSON.stringify(resp.data));
    });
    //subscribe es muy parecido a then se va a ejecutar una vez tengamos la respuesta anterior
    //En JS podriamos usar el fetch que nos devuelve una promesa.
    /*
      fetch('https://api.giphy.com/v1/gifs/search?api_key=49UXFZ7bhSmxDE7Mq8eqY7B7nSqe4QCv&q=Dragon Ball Z&limit=10')
      .then( resp => {
        resp.json().then( data => { console.log( data ) })
      })

      Otra forma tambien javaScript un poco más limpia es hacer el método async 
      y 
      const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=49UXFZ7bhSmxDE7Mq8eqY7B7nSqe4QCv&q=Dragon Ball Z&limit=10')
      const data = await resp.json();
      console.log(data);

    */
    
  }


}
