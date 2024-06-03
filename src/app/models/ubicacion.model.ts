export class Produccion {
    categorias: string | undefined | null;
    productos: string | undefined | null;

    constructor(categorias: string, productos: string) {
        this.categorias = categorias;
        this.productos = productos;
    }
}

export class Ubicacion {
    id?: number;
    vereda: string | undefined | null;
    nombre_finca: string | undefined | null;
    latitude: string | undefined | null;
    longitude: string | undefined | null;
    hectareas: number | undefined | null;
    tipo_finca: string | undefined | null;
    asociado_id: number | undefined | null;
    nombre: string | undefined | null;
    producciones: Produccion[] | undefined | null;

    constructor(id: number, vereda: string, nombre_finca: string, latitude: string, longitude: string, hectareas: number, tipo_finca: string, asociado_id: number, nombre: string, producciones: Produccion[]) {
        this.id = id;
        this.vereda = vereda;
        this.nombre_finca = nombre_finca;
        this.latitude = latitude;
        this.longitude = longitude;
        this.hectareas = hectareas;
        this.tipo_finca = tipo_finca;
        this.asociado_id = asociado_id;
        this.nombre = nombre;
        this.producciones = producciones;
    }
}
