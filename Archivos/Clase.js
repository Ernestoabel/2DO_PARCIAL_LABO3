import { PlanetaBase } from './Padre.js'; 

class Planeta extends PlanetaBase {
  constructor(id, nombre, tamanio, masa, tipo, distancia, anillo, vida) {
    super(id, nombre, tamanio, masa, tipo);
    this.distancia = distancia;
    this.anillo = anillo;
    this.vida = vida;
  }
}

export { Planeta };
