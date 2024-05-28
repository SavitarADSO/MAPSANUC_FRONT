export class Ubicacion {

    id?:number;
    vereda:string | undefined| null;
    nombre_finca:string | undefined| null;
    latitude:string | undefined| null;
    longitude:string | undefined| null;
    nombre:string | undefined| null;

    constructor(id:number,  vereda:string ,nombre_finca:string, latitude:string, longitude:string, nombre:string){
        this.id = id;
        this.vereda = vereda;
        this.nombre_finca = nombre_finca;
        this.latitude = latitude;
        this.longitude = longitude;
        this.nombre = nombre;
    }
}
