import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbicacionService } from '../../services/ubicacion.service';
import { Ubicacion } from '../../models/ubicacion.model';
import { HttpClientModule } from '@angular/common/http';
import { Map, tileLayer, Icon } from 'leaflet';
import * as L from 'leaflet'; // Importamos 'L' de Leaflet
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Asegúrate de importar el CSS si aún no lo has hecho

@Component({
  selector: 'app-asociado',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // Añadir HttpClientModule aquí
  templateUrl: './asociado.component.html',
  styleUrls: ['./asociado.component.css'],
  providers: [UbicacionService]
})
export class AsociadoComponent implements AfterViewInit {
  private map: Map | undefined;

  constructor(private elementRef: ElementRef, private ubicacionService: UbicacionService) {}

  ngAfterViewInit(): void {
    this.initializeMap().then(() => {
      this.drawRoute(); // Dibuja la ruta fija
      this.loadUbicaciones(); // Carga y agrega los marcadores adicionales
    });
  }

  private initializeMap(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.map = new Map('map').setView([7.0672,-73.0755], 13);
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(this.map);

      // Resolvemos la promesa una vez que el mapa esté completamente inicializado
      this.map.whenReady(() => {
        resolve();
      });
    });
  }

  private drawRoute(): void {
    if (this.map) {
      // Definir el icono personalizado para Anuc plaza de mercado
      const anucIcon = new Icon({
        iconUrl: 'assets/img/mi_finca.png',
        iconSize: [38, 38], // Ajusta el tamaño según sea necesario
        iconAnchor: [19, 38], // Punto del icono que corresponderá a la posición del marcador
        popupAnchor: [0, -38] // Punto desde el cual se abrirá el popup relativo al icono
      });

      // Definir el icono personalizado para las demás fincas
      const fincaIcon = new Icon({
        iconUrl: 'assets/img/fincasots.png',
        iconSize: [38, 38], // Ajusta el tamaño según sea necesario
        iconAnchor: [19, 38], // Punto del icono que corresponderá a la posición del marcador
        popupAnchor: [0, -38] // Punto desde el cual se abrirá el popup relativo al icono
      });

      const control = (L as any).Routing.control({
        waypoints: [
          L.latLng(7.062166379405107, -73.08538016671284), // Latitud, Longitud para Anuc plaza de mercado
          L.latLng(7.084659934159932, -73.05226529922037)  // Latitud, Longitud para Hacienda la judía
        ],
        draggableWaypoints: false,
        createMarker: (i: number, wp: any, nWps: number) => {
          if (i === 0) {
            return L.marker(wp.latLng, { icon: anucIcon }).bindPopup(`
              <div style="text-align: center;">
                <h3>ASOCIACIÓN MUNICIPAL DE USUARIOS CAMPESINOS DE FLORIDABLANCA ANUC</h3>
                <img src="assets/img/logo_anuc.png" alt="Logo ANUC" style="width: 100px; height: auto; margin-bottom: 10px;">
                <p>NIT: 890211458-4</p>
                <p>Dirección: CR 9 6 16 CASCO URBANO FLORIDABLANCA</p>
                <img src="assets/img/fachada_anuc.PNG" alt="Fachada ANUC" style="width: 200px; height: auto; margin-top: 10px;">
              </div>
            `);
          } else if (i === nWps - 1) {
            return L.marker(wp.latLng, { icon: fincaIcon }).bindPopup("Hacienda la judía");
          } else {
            return L.marker(wp.latLng, { icon: fincaIcon });
          }
        }
      }).addTo(this.map);

      control.on('routesfound', (e: any) => {
        const routes = e.routes;
        const summary = routes[0].summary;
        console.log(summary.totalDistance, summary.totalTime);
        // Eliminamos el div de las indicaciones de ruta
        const routingDiv = this.elementRef.nativeElement.querySelector('.leaflet-routing-container');
        if (routingDiv) {
          routingDiv.remove();
        }
      });
    }
  }

  private loadUbicaciones(): void {
    // Definir el icono personalizado para las demás fincas
    const fincaIcon = new Icon({
      iconUrl: 'assets/img/fincasots.png',
      iconSize: [38, 38], // Ajusta el tamaño según sea necesario
      iconAnchor: [19, 38], // Punto del icono que corresponderá a la posición del marcador
      popupAnchor: [0, -38] // Punto desde el cual se abrirá el popup relativo al icono
    });

    this.ubicacionService.getUbicaciones().subscribe((ubicaciones: Ubicacion[]) => {
      ubicaciones.forEach((ubicacion: Ubicacion) => {
        if (ubicacion.latitude && ubicacion.longitude) {
          const lat = parseFloat(ubicacion.latitude);
          const lng = parseFloat(ubicacion.longitude);
          L.marker([lat, lng], { icon: fincaIcon })
            .addTo(this.map!)
            .bindPopup(`Finca: ${ubicacion.nombre_finca}<br>Vereda: ${ubicacion.vereda}<br>Nombre: ${ubicacion.nombre}`);
        }
      });
    });
  }
}
