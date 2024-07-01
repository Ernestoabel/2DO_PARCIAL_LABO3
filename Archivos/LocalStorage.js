//TENER EN CUENTA QUE SE LE QUITO EL TIME OUT A LOS SPINER 
//SOLO QUEDA LA MODIFICACION DE LOS PUNTOS EN EL TEXTO PARA DARLE ANIMCION

const delay = 2.5;

// Función para leer del localStorage
export function leer(clave) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const valor = JSON.parse(localStorage.getItem(clave));
            resolve(valor);
          } 
          catch (error) {
            reject(error);
          }
        }, delay * 1000);
      });
}

// Función para escribir en el localStorage
export function escribir(clave, valor) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            localStorage.setItem(clave, JSON.stringify(valor));
            resolve();
          } catch (error) {
            reject(error);
          }
        }, delay * 1000);
      });
}

export function limpiar(clave) {
    localStorage.removeItem(clave);
}

// Función para convertir de JSON string a objeto
export function jsonToObject(jsonString) {
    return JSON.parse(jsonString);
}

// Función para convertir de objeto a JSON string
export function objectToJson(objeto) {
    return JSON.stringify(objeto);
}

//funcion para mostrar el cargando
export function mostrarSpinner() {
    const loadingText = document.getElementById('loading-text');
    loadingText.style.display = 'block';
    animateLoadingText();
}

//funcion para ocultar y mostrar los spinner
export function ocultarSpinner() {
    const loadingText = document.getElementById('loading-text');
    loadingText.style.display = 'none';
}

export function mostrarSpinnerGuardar() {
  const loadingText = document.getElementById('loading-textg');
  loadingText.style.display = 'block';
  animateLoadingTextG();
}

export function ocultarSpinnerGuardar() {
  const loadingText = document.getElementById('loading-textg');
  loadingText.style.display = 'none';
}

export function mostrarSpinnerMod() {
  const loadingText = document.getElementById('loading-textm');
  loadingText.style.display = 'block';
  animateLoadingTextM();
}

export function ocultarSpinnerMod() {
  const loadingText = document.getElementById('loading-textm');
  loadingText.style.display = 'none';
}

export function mostrarSpinnerBorrar() {
  const loadingText = document.getElementById('loading-textb');
  loadingText.style.display = 'block';
  animateLoadingTextB();
}

export function ocultarSpinnerBorrar() {
  const loadingText = document.getElementById('loading-textb');
  loadingText.style.display = 'none';
}

//funciones para animar los puntitos
function animateLoadingText() {
    const loadingText = document.getElementById('loading-text');
    let counter = 0;
    const interval = setInterval(() => {
        loadingText.textContent = 'Cargando' + '.'.repeat(counter % 4);
        counter++;
    }, 500);
}

function animateLoadingTextG() {
  const loadingText = document.getElementById('loading-textg');
  let counter = 0;
  const interval = setInterval(() => {
      loadingText.textContent = 'Guardando' + '.'.repeat(counter % 4);
      counter++;
  }, 500);
}

function animateLoadingTextM() {
  const loadingText = document.getElementById('loading-textg');
  let counter = 0;
  const interval = setInterval(() => {
      loadingText.textContent = 'Modificando' + '.'.repeat(counter % 4);
      counter++;
  }, 500);
}

function animateLoadingTextB() {
  const loadingText = document.getElementById('loading-textb');
  let counter = 0;
  const interval = setInterval(() => {
      loadingText.textContent = 'Borrando' + '.'.repeat(counter % 4);
      counter++;
  }, 500);
}
