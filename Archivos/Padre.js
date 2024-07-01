class PlanetaBase {
    constructor(id, nombre, tamanio, masa, tipo) {
        this.id = id;
        this.nombre = nombre;
        this.tamanio = tamanio;
        this.masa = masa;
        this.tipo = tipo;
    }

    static validarSoloLetra(string) {
        return /^[a-zA-Z\s]{1,15}$/.test(string);
    }

    static validarNumeroDecimal(numero) {
        return /^\d+(\.\d+)?$/.test(numero);
    }
}

export { PlanetaBase };
