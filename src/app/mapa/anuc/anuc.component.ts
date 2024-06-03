import { Component, AfterViewInit } from '@angular/core';
import { Map, marker, tileLayer, Icon, LatLng } from 'leaflet';

@Component({
  selector: 'app-anuc',
  standalone: true,
  imports: [],
  templateUrl: './anuc.component.html',
  styleUrls: ['./anuc.component.css']
})
export class AnucComponent implements AfterViewInit {
  private initialView: LatLng = new LatLng(7.06260, -73.08583);
  private initialZoom: number = 17;
  private popupHeight: number = 200; // Ajustar esto según la altura esperada del popup

  ngAfterViewInit(): void {
    const map = new Map('map').setView(this.initialView, this.initialZoom);
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Definir el icono personalizado
    const customIcon = new Icon({
      iconUrl: 'assets/img/mi_finca.png',
      iconSize: [38, 38], // Tamaño del icono (ajustar según sea necesario)
      iconAnchor: [19, 38], // Punto del icono que corresponderá a la posición del marcador (ajustar según sea necesario)
      popupAnchor: [0, -38] // Punto desde el cual se abrirá el popup relativo al icono (ajustar según sea necesario)
    });

    // Contenido del popup con imágenes y texto
    const popupContent = `
    <div style="text-align: center;">
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
        <img src="assets/img/logo_anuc.png" alt="Logo ANUC" style="width: 100px; height: auto; margin-right: 10px;">
        <h3 style="margin: 0;">ASOCIACIÓN MUNICIPAL DE USUARIOS CAMPESINOS DE FLORIDABLANCA ANUC</h3>
      </div>
      <p><strong>Dirección:</strong> CR 9 6 16 CASCO URBANO FLORIDABLANCA</p>
      <p><strong>Horarios de venta:</strong></p>
      <ul style="list-style: none; padding: 0;">
        <li>Martes: 8:00 am - 4:00 pm</li>
        <li>Jueves: 8:00 am - 4:00 pm</li>
        <li>Sábado: 8:00 am - 4:00 pm</li>
        <li>Domingo: 8:00 am - 4:00 pm</li>
      </ul>
      <img src="assets/img/fachada_anuc.PNG" alt="Fachada ANUC" style="width: 200px; height: auto; margin-top: 10px;">
    </div>
  `;

    // Crear el marcador con el icono personalizado y el contenido del popup
    const markerItem = marker([7.062166379405107, -73.08538016671284], { icon: customIcon })
      .addTo(map)
      .bindPopup(popupContent);

    // Abrir el popup automáticamente y ajustar la vista del mapa
    markerItem.openPopup();
    this.adjustPopupView(map, markerItem);

    // Ajustar la vista del mapa para mostrar completamente el popup cuando se abre
    markerItem.on('popupopen', () => {
      this.adjustPopupView(map, markerItem);
    });

    // Restablecer la vista del mapa y abrir el popup cuando se hace clic en el marcador
    markerItem.on('click', () => {
      map.setView(this.initialView, this.initialZoom);
      this.adjustPopupView(map, markerItem);
      markerItem.openPopup();
    });
  }

  private adjustPopupView(map: Map, markerItem: any): void {
    setTimeout(() => {
      map.panBy([0, -this.popupHeight / 2]);
    }, 300); // Ajuste de tiempo para asegurar que el popup esté completamente cargado
  }
}
