export function initModal() {
    // Obtener el modal
    let modal = document.getElementById("miModal");

    // Obtener el botón que abre el modal
    let btnAbrir = document.getElementById("abrirModal");

    // Obtener el elemento <span> que cierra el modal
    let spanCerrar = document.getElementsByClassName("cerrar")[0];

    // Cuando el usuario haga clic en el botón, abrir el modal
    btnAbrir.onclick = function () {
        modal.style.display = "block";
    }

    // Cuando el usuario haga clic en <span> (x), cerrar el modal
    spanCerrar.onclick = function () {
        modal.style.display = "none";
    }

    // Cuando el usuario haga clic en cualquier lugar fuera del modal, cerrarlo
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
};

export function cerrarModal() {
    let modal = document.getElementById("miModal");
    modal.style.display = "none";
}

