//PERDON POR EL SELECT QUE NO HACE NADA
//QUEDO DEL PARCIAL 1 QUE TENIA UN SOLO BOTON ELIMINAR
//ELIJO DEJARLO PARA TOQUETEAR LUEGO  Y DEJARLO MAS BONITO PARA PRESENTARLO EN MI GITHUB EN ENTREVSITAS

import { initModal, cerrarModal } from "./Modal.js";
import { Planeta } from "./Clase.js";
import { mostrarSpinner, ocultarSpinner,mostrarSpinnerGuardar,ocultarSpinnerGuardar,mostrarSpinnerMod,ocultarSpinnerMod,mostrarSpinnerBorrar,ocultarSpinnerBorrar } from "./LocalStorage.js";
 
document.addEventListener("DOMContentLoaded", onInit);

const planetas = [];
const formulario = document.getElementById("form-planeta");
const botonAplicarFiltro = document.getElementById("aplicarFiltro");
botonAplicarFiltro.addEventListener('click', aplicarFiltro);
//document.getElementById('btnEliminarTodos').addEventListener('click', eliminarTodosLosPlanetas);
const selectorTipo = document.getElementById('filtro-tipo');
selectorTipo.addEventListener('change', aplicarFiltroYMostrarPromedio);

function onInit() {
    loadItems();
    initModal();
    escuchandoFormulario();
}

// Función para cargar los items desde el servidor
function loadItems() {
    mostrarSpinner();
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/planetas", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            ocultarSpinner();
            if (xhr.status === 200) {
                const objetos = JSON.parse(xhr.responseText) || [];

                objetos.forEach(obj => {
                    const model = new Planeta(
                        obj.id,
                        obj.nombre,
                        obj.tamanio,
                        obj.masa,
                        obj.tipo,
                        obj.distancia,
                        obj.anillo,
                        obj.vida,
                        obj.composicion
                    );
                    planetas.push(model);
                });

                rellenarTabla();
            } else {
                console.error('Error al cargar los datos:', xhr.statusText);
            }
        }
    };
    xhr.send();
}

// Función para crear la tabla
function rellenarTabla() {
    const tabla = document.getElementById("table-items");
    const tbody = tabla.getElementsByTagName('tbody')[0];

    limpiarTabla(tbody);
    agregarFilas(tbody);
    agregarBotonEliminar(tbody);
}

// Función para limpiar la tabla
function limpiarTabla(tbody) {
    tbody.innerHTML = '';
}

//Bloque para manejar el filto de columnas, como se crea dinamicamente.
//Utilizo el nombre (string) para  mostrarla ocultarla
function aplicarFiltro() {
    const tabla = document.getElementById("table-items");
    const checkboxes = document.querySelectorAll('#contenedor-checkboxes input[type="checkbox"]');
    const headers = tabla.getElementsByTagName('th');

    checkboxes.forEach(checkbox => {
        const columna = checkbox.id.replace('chk-', '');
        const index = getColumnIndex(columna, headers);

        if (index !== -1) {
            headers[index + 1].style.display = checkbox.checked ? '' : 'none'; // +1 to account for the radio button column

            for (let i = 0; i < tabla.rows.length; i++) {
                const row = tabla.rows[i];
                const cell = row.cells[index + 1]; // +1 to account for the radio button column
                if (cell) {
                    cell.style.display = checkbox.checked ? '' : 'none';
                }
            }
        }
    });

    limpiarFilasInvisibles(tabla);
}

function getColumnIndex(columna, headers) {
    for (let i = 1; i < headers.length; i++) { // Start from 1 to skip the radio button column
        if (headers[i].textContent.trim().toLowerCase() === columna.toLowerCase()) {
            return i - 1; // Return the actual index without the radio button column
        }
    }
    return -1;
}

function limpiarFilasInvisibles(tabla) {
    const filas = tabla.rows;
    for (let i = 1; i < filas.length; i++) {
        let filaVisible = false;
        for (let j = 1; j < filas[i].cells.length; j++) { // Start from 1 to skip the radio button column
            if (filas[i].cells[j].style.display !== 'none') {
                filaVisible = true;
                break;
            }
        }
        filas[i].style.display = filaVisible ? '' : 'none';
    }
}

// Función para cargar datos en la fila
function agregarFilas(tbody) {
    const celdas = ["id", "nombre", "tamanio", "masa", "tipo", "distancia", "anillo", "vida"];

    planetas.forEach((item, index) => {
        const nuevaFila = crearFila(item, index, celdas);
        tbody.appendChild(nuevaFila);
    });
}

// Función para generar las filas
function crearFila(item, index, celdas) {
    const nuevaFila = document.createElement("tr");
    const radioBtn = crearRadioBtn(index);

    nuevaFila.appendChild(crearCeldaRadio(radioBtn));

    celdas.forEach((celda) => {
        const nuevaCelda = document.createElement("td");
        if (celda != null) {
            nuevaCelda.textContent = item[celda];
            agregarEventoModificacion(nuevaCelda, index, celda);
        }
        nuevaFila.appendChild(nuevaCelda);
    });

    return nuevaFila;
}

// Función para tomar el evento doble click sobre las celdas y llamar a modificar el campo
function agregarEventoModificacion(celda, index, campo) {
    celda.addEventListener("dblclick", () => modificar(index, campo));
}

// Función para modificar un campo
function modificar(index, campo) {
    if (campo === "anillo" || campo === "vida") {
        modificarTrueoFalse(index, campo);
    } else if (campo === "tipo") {
        modificarTipo(index);
    } else {
        modificarCampo(index, campo);
    }
}

// Función para validar las opciones del campo tipo
function modificarTipo(index) {
    const nuevoValor = prompt("Ingrese el nuevo valor para el tipo (ej: Rocoso, Gaseoso, Helado o Enano):");

    const tiposValidos = ["Rocoso", "Gaseoso", "Helado", "Enano"];

    if (!tiposValidos.includes(nuevoValor)) {
        alert(`El tipo ingresado no es válido. Los valores válidos son: ${tiposValidos.join(", ")}`);
        return;
    }

    // Actualizar localmente
    planetas[index].tipo = nuevoValor;
    const str = JSON.stringify(planetas);
    guardarYRellenarTabla(str);

    // Llamar a enviarPUT después de modificar localmente
    enviarPUT(`http://localhost:3000/planetas/${planetas[index].id}`, index, 'tipo', nuevoValor);
}

// Función para modificar campos booleanos
function modificarTrueoFalse(index, campo) {
    const nuevoValor = prompt(`Ingrese el nuevo valor para ${campo} (true o false):`);
    const valoresValidos = ["true", "false"];

    if (!valoresValidos.includes(nuevoValor)) {
        alert("El valor ingresado no es válido. Debe ser 'true' o 'false'.");
        return;
    }

    // Actualizar localmente
    planetas[index][campo] = nuevoValor === 'true';
    const str = JSON.stringify(planetas);
    guardarYRellenarTabla(str);

    // Llamar a enviarPUT después de modificar localmente
    enviarPUT(`http://localhost:3000/planetas/${planetas[index].id}`, index, campo, nuevoValor);
}

// Función para enviar la solicitud PUT
function enviarPUT(url, index, campo, nuevoValor) {
    mostrarSpinnerMod();
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            ocultarSpinnerMod();
            if (xhr.status === 200) {
                rellenarTabla(); // Recargar la tabla si es necesario
            } else {
                console.error('Error al actualizar el planeta:', xhr.statusText);
            }
        }
    };

    const planetaActualizado = { ...planetas[index] }; // Clonar el planeta
    planetaActualizado[campo] = nuevoValor;
    reiniciarFiltrosYPromedio();

    xhr.send(JSON.stringify(planetaActualizado));
}

// Función para validar y modificar campos de solo texto o solo números
function modificarCampo(index, campo) {
    const nuevoValor = prompt(`Ingrese el nuevo valor para ${campo}:`);

    if (campo === "nombre") {
        const nombreValido = Planeta.validarSoloLetra(nuevoValor);
        if (!nombreValido) {
            alert("El nombre debe contener solo letras y tener un máximo de 15 caracteres.");
            return;
        }
    } else if (campo === "tamanio" || campo === "distancia") {
        const precioValido = Planeta.validarNumeroDecimal(nuevoValor);
        if (!precioValido) {
            alert("El tamaño debe ser solo números con o sin decimales.");
            return;
        }
    }

    planetas[index][campo] = nuevoValor;
    const str = JSON.stringify(planetas);
    guardarYRellenarTabla(str);

    // Llamar a enviarPUT después de modificar localmente
    enviarPUT(`http://localhost:3000/planetas/${planetas[index].id}`, index, campo, nuevoValor);
}

// Función para crear un botón de selección
function crearRadioBtn(index) {
    const radioBtn = document.createElement("input");
    radioBtn.type = "radio";
    radioBtn.name = "item";
    radioBtn.value = index;
    return radioBtn;
}

// Función para agregar celdas de botones de selección
function crearCeldaRadio(radioBtn) {
    const celda = document.createElement("td");
    celda.appendChild(radioBtn);
    return celda;
}

// Función para agregar botón de eliminar a cada fila
function agregarBotonEliminar(tbody) {
    const filas = tbody.getElementsByTagName("tr");
    for (let i = 0; i < filas.length; i++) {
        const botonEliminar = crearBotonEliminar(i);
        filas[i].appendChild(botonEliminar);
    }
}

// Función para crear un botón de eliminar
function crearBotonEliminar(index) {
    const celdaEliminar = document.createElement("td");
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => {
        const id = planetas[index].id;
        eliminarItem(id, index);
    });
    celdaEliminar.appendChild(btnEliminar);
    return celdaEliminar;
}

// Función para eliminar un item
// BLOQUE DELETE
function eliminarItem(id, index) {
    mostrarSpinnerBorrar();
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `http://localhost:3000/planetas/${id}`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            ocultarSpinnerBorrar();
            if (xhr.status === 200) {
                planetas.splice(index, 1);
                const str = JSON.stringify(planetas);
                guardarYRellenarTabla(str);

                reiniciarFiltrosYPromedio();
            } else {
                console.error('Error al eliminar el planeta:', xhr.statusText);
            }
        }
    };
    xhr.send();
}


// Función para guardar y recargar la tabla

function guardarYRellenarTabla(str) {
    localStorage.setItem("planetas", str);
    rellenarTabla();
}

// submit del botón enviar en el modal para cargar un nuevo item a la lista
// BLOQUE DE POST
// NO LOGRO QUE  FUNCIONE BIEN ObtenerProximoId, estan los consolelog, hay de syncro me parece
function escuchandoFormulario() {
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const id = obtenerProximoId();
        console.log(id);
        const nombre = formulario.querySelector("#nombre").value;
        const tamanio = formulario.querySelector("#tamanio").value;
        const masa = formulario.querySelector("#masa").value;
        const tipo = formulario.querySelector("#tipo").value;
        const distancia = formulario.querySelector("#distancia").value;
        const anillo = formulario.querySelector("#anillo").checked;
        const vida = formulario.querySelector("#vida").checked;

        const model = new Planeta(id, nombre, tamanio, masa, tipo, distancia, anillo, vida);

        const nombreValido = Planeta.validarSoloLetra(nombre);
        const tamanioValido = Planeta.validarNumeroDecimal(tamanio);
        const distanciaValido = Planeta.validarNumeroDecimal(distancia);

        if (!nombreValido) {
            alert("El nombre debe contener solo letras y tener un máximo de 15 caracteres.");

        } else if (!tamanioValido) {
            alert("El tamaño debe ser solo numeros con o sin decimales");

        } else if (!distanciaValido) {
            alert("La distancia debe ser solo numeros con o sin decimales");

        } else {
            mostrarSpinnerGuardar();
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:3000/planetas", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    ocultarSpinnerGuardar();
                    if (xhr.status === 200) {
                        const nuevoPlaneta = JSON.parse(xhr.responseText);
                        planetas.push(new Planeta(
                            nuevoPlaneta.id,
                            nuevoPlaneta.nombre,
                            nuevoPlaneta.tamanio,
                            nuevoPlaneta.masa,
                            nuevoPlaneta.tipo,
                            nuevoPlaneta.distancia,
                            nuevoPlaneta.anillo,
                            nuevoPlaneta.vida,
                            nuevoPlaneta.composicion
                        ));
                        const str = JSON.stringify(planetas);
                        guardarYRellenarTabla(str);
                        formulario.reset();
                        cerrarModal();
                        reiniciarFiltrosYPromedio();
                    } else {
                        console.error('Error al crear el planeta:', xhr.statusText);
                    }
                }
            };
            xhr.send(JSON.stringify(model));
        }
    });
}

// Función para obtener el último ID de la lista en el servidor
// Se usa la funcion MAP DE LISTADO
// NO ESTA ANDANDO BIEN, HAY UN TEMA DE SYNCRO
async function obtenerUltimoId() {
    try {
        const response = await fetch('http://localhost:3000/planetas');
        if (!response.ok) {
            throw new Error('No se pudo obtener la lista de planetas');
        }
        const planetas = await response.json();
        if (planetas.length > 0) {
            const ultimoId = Math.max(...planetas.map(planeta => planeta.id));
            console.log(ultimoId);
            return ultimoId;
        } else {
            return 0;
        }
    } catch (error) {
        console.error('Error al obtener el último ID:', error.message);
        return 0; // Devolver 0 si hay un error
    }
}

// Función para obtener el próximo ID basado en el último ID del servidor
async function obtenerProximoId() {
    const ultimoId = await obtenerUltimoId();
    return ultimoId + 1;
}

function aplicarFiltroYMostrarPromedio() {
    const tipoSeleccionado = selectorTipo.value;
    const planetasFiltrados = filtrarPorTipo(planetas, tipoSeleccionado);
    rellenarTabla(planetasFiltrados);

    const promedio = calcularPromedioDistancia(planetasFiltrados);
    mostrarPromedio(promedio);
}

//Bloque para el filtro del promedio por distancia
function filtrarPorTipo(planetas, tipo) {
    if (!tipo) {
        return planetas;
    }
    return planetas.filter(planeta => planeta.tipo === tipo);
}

function calcularPromedioDistancia(planetas) {
    if (planetas.length === 0) {
        return 0;
    }
    const sumatoria = planetas.reduce((total, planeta) => total + parseFloat(planeta.distancia), 0);
    return sumatoria / planetas.length;
}

function mostrarPromedio(promedio) {
    const promedioSpan = document.getElementById('promedio-distancia');
    promedioSpan.textContent = `Promedio de Distancia al Sol: ${promedio.toFixed(2)}`;
}

// Función para reiniciar el filtro por tipo y el promedio de distancia
function reiniciarFiltrosYPromedio() {
    document.getElementById('filtro-tipo').value = ''; // Reiniciar el select
    document.getElementById('promedio-distancia').textContent = 'Promedio de Distancia al Sol: N/A'; // Reiniciar el span
}

/*
Este bloque anda defectuoso, por eso lo desactive
// Función para verificar si la base de datos está vacía
async function baseDeDatosVacia() {
    const url = 'http://localhost:3000/planetas';
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener los planetas desde el servidor');
        }
        
        const data = await response.json();
        return data.length === 0;
        
    } catch (error) {
        console.error('Error:', error.message);
        return true; // En caso de error, consideramos la base de datos como vacía
    }
}

// Función asincrónica para actualizar el estado del botón
async function actualizarEstadoBotonEliminar() {
    const btnEliminarTodos = document.getElementById('btnEliminarTodos');
    
    try {
        const vacia = await baseDeDatosVacia();
        btnEliminarTodos.disabled = vacia;
    } catch (error) {
        console.error('Error al verificar la base de datos:', error.message);
        btnEliminarTodos.disabled = true; // En caso de error, deshabilitar el botón por precaución
    }
}

// Función para eliminar todos los planetas del servidor
function eliminarTodosLosPlanetas() {
    mostrarSpinner();
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `http://localhost:3000/planetas`, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            ocultarSpinner();
            if (xhr.status === 200) {
                planetas = []; // Limpiar la lista localmente
                guardarYRellenarTabla(JSON.stringify(planetas)); // Actualizar la tabla
                actualizarEstadoBotonEliminar(); // Actualizar estado del botón
            } else {
                console.error('Error al eliminar todos los planetas:', xhr.statusText);
            }
        }
    };
    xhr.send();
}

// Llama a esta función al cargar la página o después de cualquier modificación en la base de datos
actualizarEstadoBotonEliminar();
*/