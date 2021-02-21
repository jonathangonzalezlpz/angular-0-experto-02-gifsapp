import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../services/gifs.service';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: [
  ]
})
export class BusquedaComponent {

  @ViewChild('txtBuscar') txtBuscar!: ElementRef<HTMLInputElement>; //! not null, operador de Ts que asegura que el objeto no es nulo
  
  constructor( private _gifsService: GifsService ) { }

  buscar(): void{
    const valor = this.txtBuscar.nativeElement.value;

    if ( valor.trim().length === 0 ){ return ; } //Controla que no se haga nada con un ENTER vacío

    this._gifsService.buscarGifs( this.txtBuscar.nativeElement.value );

    this.txtBuscar.nativeElement.value = '';
    /*
    Para reiniciar la caja de texto podríamos utilizar
    JavaScript de la forma
    document.querySelector('input').value='';
    pero mejor utilizamos el decorador @viewChild de angular*/
  } 
  

}
