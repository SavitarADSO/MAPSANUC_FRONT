import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UbicacionService } from '../../services/ubicacion.service';
import { Ubicacion } from '../../models/ubicacion.model';
import { HttpClientModule } from '@angular/common/http';
import { Map, Icon, tileLayer, marker, polygon, LatLngExpression } from 'leaflet';

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
  public tiposFinca: string[] = [];
  public categorias: string[] = [];
  public productos: string[] = [];
  public hectareas: number[] = [];
  public selectedVereda: string = '';
  public selectedTipoFinca: string = '';
  public selectedCategoria: string = '';
  public selectedProducto: string = '';
  public selectedHectarea: number | null = null;

  constructor(private elementRef: ElementRef, private ubicacionService: UbicacionService) {}

  ngAfterViewInit(): void {
    this.initializeMap().then(() => {
      this.loadUbicaciones();
      this.addVeredas(); // Agrega los polígonos de las veredas
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
            .bindPopup(`
              <div>
                <p><strong>Finca:</strong> ${ubicacion.nombre_finca}</p>
                <p><strong>Vereda:</strong> ${ubicacion.vereda}</p>
                <p><strong>Nombre:</strong> ${ubicacion.nombre}</p>
                <p><strong>Tipo de Finca:</strong> ${ubicacion.tipo_finca}</p>
                <p><strong>Hectáreas:</strong> ${ubicacion.hectareas}</p>
                <p><strong>Producción:</strong></p>
                <ul>
                  ${ubicacion.producciones?.map(prod => `<li>${prod.categorias}: ${prod.productos}</li>`).join('')}
                </ul>
              </div>
            `)
            .addTo(this.map!);

          this.markers.push({
            marker: markerItem,
            vereda: ubicacion.vereda,
            tipoFinca: ubicacion.tipo_finca,
            categoria: ubicacion.producciones?.map(prod => prod.categorias).join(', ') || '',
            producto: ubicacion.producciones?.map(prod => prod.productos).join(', ') || '',
            hectareas: ubicacion.hectareas || 0
          });

          if (ubicacion.vereda && !this.veredas.includes(ubicacion.vereda)) {
            this.veredas.push(ubicacion.vereda);
          }
          if (ubicacion.tipo_finca && !this.tiposFinca.includes(ubicacion.tipo_finca)) {
            this.tiposFinca.push(ubicacion.tipo_finca);
          }
          ubicacion.producciones?.forEach(prod => {
            if (prod.categorias && !this.categorias.includes(prod.categorias)) {
              this.categorias.push(prod.categorias);
            }
            if (prod.productos && !this.productos.includes(prod.productos)) {
              this.productos.push(prod.productos);
            }
          });
          if (ubicacion.hectareas && !this.hectareas.includes(ubicacion.hectareas)) {
            this.hectareas.push(ubicacion.hectareas);
          }
        }
      });
    });
  }

  public filterMarkers(): void {
    this.markers.forEach(item => {
      const showByVereda = this.selectedVereda === '' || item.vereda === this.selectedVereda;
      const showByTipoFinca = this.selectedTipoFinca === '' || item.tipoFinca === this.selectedTipoFinca;
      const showByCategoria = this.selectedCategoria === '' || item.categoria.includes(this.selectedCategoria);
      const showByProducto = this.selectedProducto === '' || item.producto.includes(this.selectedProducto);
      const showByHectareas = this.selectedHectarea === null || item.hectareas === this.selectedHectarea;

      if (showByVereda && showByTipoFinca && showByCategoria && showByProducto && showByHectareas) {
        item.marker.addTo(this.map!);
      } else {
        this.map!.removeLayer(item.marker);
      }
    });
  }

  private addVeredas(): void {
    const veredas = [
      {
        name: "Vereda 1",
        coordinates: [
          [7.067, -73.085],
          [7.068, -73.083],
          [7.065, -73.082],
          [7.064, -73.084],
        ] as LatLngExpression[],
        color: "red",
      },
      {
        name: "Vereda 2",
        coordinates: [
          [7.070, -73.089],
          [7.072, -73.087],
          [7.069, -73.086],
          [7.068, -73.088],
          [7.067, -73.089],
        ] as LatLngExpression[],
        color: "blue",
      },
    ];

    veredas.forEach((vereda) => {
      polygon(vereda.coordinates, { color: vereda.color }).addTo(this.map!).bindPopup(vereda.name);
    });
  }
}
