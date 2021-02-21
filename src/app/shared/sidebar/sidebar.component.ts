import { Component } from '@angular/core';
import { GifsService } from '../../gifs/services/gifs.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {

  get historial(){
    return this._gifsService.historial;
  }

  constructor( private _gifsService: GifsService ) { }

  buscar( termino: string ){
    this._gifsService.buscarGifs( termino );
  }
}
