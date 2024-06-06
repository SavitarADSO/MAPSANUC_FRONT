import { Component, AfterViewInit } from '@angular/core';
import { Map, marker, tileLayer, Icon, LatLng, Control } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-anuc',
  standalone: true,
  templateUrl: './anuc.component.html',
  styleUrls: ['./anuc.component.css']
})
export class AnucComponent implements AfterViewInit {
  private initialView: LatLng = new LatLng(7.06260, -73.08583);
  private initialZoom: number = 17;
  private popupHeight: number = 200;
  private map!: Map;
  private routeControl!: Control;
  private userMarker!: L.Marker;
  private anucMarker!: L.Marker;

  ngAfterViewInit(): void {
    this.map = new Map('map').setView(this.initialView, this.initialZoom);
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    const customIcon = new Icon({
      iconUrl: 'assets/img/mi_finca.png',
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38]
    });

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
      <img src="assets/img/fachada_anuc.PNG" alt="Fachada ANUC" style="width: 200px; height: auto; margin-top: 10px;"><br>
    </div>
  `;

    // Crear marcador de ANUC
    this.anucMarker = marker([7.062166379405107, -73.08538016671284], { icon: customIcon })
      .addTo(this.map)
      .bindPopup(popupContent)
      .openPopup();

    this.adjustPopupView(this.map, this.anucMarker);

    // Ajustar vista al hacer clic en el marcador de ANUC
    this.anucMarker.on('click', () => {
      this.map.setView(this.initialView, this.initialZoom);
      this.adjustPopupView(this.map, this.anucMarker);
      this.anucMarker.openPopup();
    });
  }

  private adjustPopupView(map: Map, markerItem: any): void {
    setTimeout(() => {
      map.panBy([0, -this.popupHeight / 2]);
    }, 300);
  }

  startNavigation(): void {
    console.log('Navigate button clicked');

    if (!this.anucMarker) {
      console.error('Marker for ANUC not found.');
      return;
    }

    const destination = this.anucMarker.getLatLng();
    this.navigate(destination);
  }

  private navigate(destination: LatLng): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = new LatLng(position.coords.latitude, position.coords.longitude);
  
          if (this.userMarker) {
            this.map.removeLayer(this.userMarker);
          }
  
          // Cambiar el icono del marcador del usuario
          const userIcon = new Icon({
            iconUrl: 'assets/img/memap.png',
            iconSize: [38, 38],
            iconAnchor: [19, 38],
            popupAnchor: [0, -38]
          });
  
          // Crear marcador de usuario
          this.userMarker = marker(userLocation, { icon: userIcon }).addTo(this.map).bindPopup('Tú estás aquí');
          this.userMarker.openPopup();
  
          if (this.routeControl) {
            this.map.removeControl(this.routeControl);
          }
  
          // Crear control de enrutamiento hacia el marcador de ANUC
          this.routeControl = (L as any).Routing.control({
            waypoints: [userLocation, destination],
            routeWhileDragging: true,
            showAlternatives: true,
            altLineOptions: {
              styles: [{ color: 'black', opacity: 0.15, weight: 9 }]
            },
            createMarker: (i: number, wp: any, nWps: number) => {
              if (i === 0) {
                return marker(wp.latLng, { icon: userIcon }).bindPopup('Tú estás aquí');
              } else if (i === nWps - 1) {
                const anucMarker = this.anucMarker;
                if (anucMarker && anucMarker.getPopup()) {
                  const popupContent = anucMarker.getPopup()?.getContent();
                  if (popupContent) {
                    return marker(wp.latLng, { icon: anucMarker.options.icon }).bindPopup(popupContent);
                  }
                }
                return marker(wp.latLng);
              } else {
                return marker(wp.latLng);
              }
            }
          }).addTo(this.map);
  
          this.map.setView(userLocation, this.initialZoom);
        },
        (error) => {
          alert('Error al obtener la ubicación: ' + error.message);
        }
      );
    } else {
      alert('Geolocalización no es soportada por este navegador.');
    }
  }
  
  
}
