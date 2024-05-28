import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UbicacionService } from '../../services/ubicacion.service';
import { Ubicacion } from '../../models/ubicacion.model';
import { HttpClientModule } from '@angular/common/http';
import { Map, Icon, tileLayer, marker } from 'leaflet';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css'],
  providers: [UbicacionService]
})
export class AdministradorComponent implements AfterViewInit {
  private map: Map | undefined;
  private markers: any[] = [];
  public veredas: string[] = [];
  public selectedVereda: string = '';

  constructor(private elementRef: ElementRef, private ubicacionService: UbicacionService) {}

  ngAfterViewInit(): void {
    this.initializeMap().then(() => {
      this.loadUbicaciones();
    });
  }

  private initializeMap(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.map = new Map('map').setView([7.06260, -73.08583], 13);
      tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(this.map);

      const anucIcon = new Icon({
        iconUrl: 'assets/img/mi_finca.png',
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
      });

      marker([7.062166379405107, -73.08538016671284], { icon: anucIcon })
        .addTo(this.map!)
        .bindPopup(`
          <div style="text-align: center;">
            <h3>ASOCIACIÓN MUNICIPAL DE USUARIOS CAMPESINOS DE FLORIDABLANCA ANUC</h3>
            <img src="assets/img/logo_anuc.png" alt="Logo ANUC" style="width: 100px; height: auto; margin-bottom: 10px;">
            <p>NIT: 890211458-4</p>
            <p>Dirección: CR 9 6 16 CASCO URBANO FLORIDABLANCA</p>
            <img src="assets/img/fachada_anuc.PNG" alt="Fachada ANUC" style="width: 200px; height: auto; margin-top: 10px;">
          </div>
        `);

      this.map.whenReady(() => {
        resolve();
      });
    });
  }

  private loadUbicaciones(): void {
    const fincaIcon = new Icon({
      iconUrl: 'assets/img/fincasots.png',
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -38]
    });

    this.ubicacionService.getUbicaciones().subscribe((ubicaciones: Ubicacion[]) => {
      const fincas = ubicaciones.slice(0, 10);

      fincas.forEach((ubicacion: Ubicacion) => {
        if (ubicacion.latitude && ubicacion.longitude) {
          const lat = parseFloat(ubicacion.latitude);
          const lng = parseFloat(ubicacion.longitude);

          const markerItem = marker([lat, lng], { icon: fincaIcon })
            .bindPopup(`Finca: ${ubicacion.nombre_finca}<br>Vereda: ${ubicacion.vereda}<br>Nombre: ${ubicacion.nombre}`)
            .addTo(this.map!);

          this.markers.push({ marker: markerItem, vereda: ubicacion.vereda });

          if (ubicacion.vereda && !this.veredas.includes(ubicacion.vereda)) {
            this.veredas.push(ubicacion.vereda);
          }
        }
      });
    });
  }

  public filterMarkers(): void {
    this.markers.forEach(item => {
      if (this.selectedVereda === '' || item.vereda === this.selectedVereda) {
        item.marker.addTo(this.map!);
      } else {
        this.map!.removeLayer(item.marker);
      }
    });
  }
}
