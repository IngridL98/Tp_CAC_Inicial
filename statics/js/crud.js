const BASEURL = 'http://127.0.0.1:5000';

/**
 * Función para realizar una petición fetch con JSON.
 * @param {string} url - La URL a la que se realizará la petición.
 * @param {string} method - El método HTTP a usar (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [data=null] - Los datos a enviar en el cuerpo de la petición.
 * @returns {Promise<Object>} - Una promesa que resuelve con la respuesta en formato JSON.
 */
async function fetchData(url, method, data = null) {
  const options = {
      method: method,
      headers: {
          'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : null,  // Si hay datos, los convierte a JSON y los incluye en el cuerpo
  };
  try {
    const response = await fetch(url, options);  // Realiza la petición fetch
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();  // Devuelve la respuesta en formato JSON
  } catch (error) {
    console.error('Fetch error:', error);
    alert('An error occurred while fetching data. Please try again.');
  }
}

/**
 * Funcion que permite crear un elemento <tr> para la tabla de peliculas
 * por medio del uso de template string de JS.
 */
async function showViajes(){
    let viajes =  await fetchData(BASEURL+'/api/viajes/', 'GET');
    const tableViajes = document.querySelector('#list-table-viajes tbody');
    tableViajes.innerHTML='';
    viajes.forEach((viaje, index) => {
      let tr = `<tr>
                    <td>${viaje.paquete}</td>
                    <td>${viaje.destino}</td>
                    <td>${viaje.precio}</td>
                    <td>
                        <button class="btn-cac" onclick='updateViaje(${viaje.id_viaje})'><i class="fa fa-pencil" ></button></i>
                        <button class="btn-cac" onclick='deleteViaje(${viaje.id_viaje})'><i class="fa fa-trash" ></button></i>
                    </td>
                  </tr>`;
      tableViajes.insertAdjacentHTML("beforeend",tr);
    });
  }

/**
 * Función para comunicarse con el servidor para poder Crear o Actualizar
 * un registro de pelicula
 * @returns 
 */
async function saveViaje(){
    const idViaje = document.querySelector('#id-viaje').value;
    const paquete = document.querySelector('#paquete').value;
    const destino = document.querySelector('#destino').value;
    const precio = document.querySelector('#precio').value;
    //VALIDACION DE FORMULARIO
    if (!paquete || !destino || !precio) {
      Swal.fire({
          title: 'Error!',
          text: 'Por favor completa todos los campos.',
          icon: 'error',
          confirmButtonText: 'Cerrar'
      });
      return;
    }
    // Crea un objeto con los datos del viaje
    const viajeData = {
        paquete: paquete,
        destino: destino,
        precio: precio,
    };
  let result = null;
  // Si hay un idViaje, realiza una petición PUT para actualizar el viaje existente
  if(idViaje!==""){
    result = await fetchData(`${BASEURL}/api/viajes/${idViaje}`, 'PUT', viajeData);
  }else{
    // Si no hay idViaje, realiza una petición POST para crear un nuevo viaje
    result = await fetchData(`${BASEURL}/api/viajes/`, 'POST', viajeData);
  }
  
  const formViaje = document.querySelector('#form-viaje');
  formViaje.reset();
  Swal.fire({
    title: 'Exito!',
    text: result.message,
    icon: 'success',
    confirmButtonText: 'Cerrar'
  })
  showViajes();
}
  
/**
 * Function que permite eliminar un viaje del array del localstorage
 * de acuedo al indice del mismo
 * @param {number} id posición del array que se va a eliminar
 */
function deleteMovie(id){
    Swal.fire({
        title: "Esta seguro de eliminar la pelicula?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
    }).then(async (result) => {
        if (result.isConfirmed) {
          let response = await fetchData(`${BASEURL}/api/viajes/${id}`, 'DELETE');
          showViajes();
          Swal.fire(response.message, "", "success");
        }
    });
    
}

/**
 * Function que permite cargar el formulario con los datos de la pelicula 
 * para su edición
 * @param {number} id Id de la pelicula que se quiere editar
 */
async function updateViaje(id){
    //Buscamos en el servidor el viaje de acuerdo al id
    let response = await fetchData(`${BASEURL}/api/viajes/${id}`, 'GET');
    const idMovie = document.querySelector('#id-viaje');
    const paquete = document.querySelector('#paquete');
    const destino = document.querySelector('#destino');
    const precio = document.querySelector('#precio');
    
    idViaje.value = response.id_viaje;
    paquete.value = response.paquete;
    destino.value = response.destino;
    precio.value = response.precio;
}
  
// Escuchar el evento 'DOMContentLoaded' que se dispara cuando el 
// contenido del DOM ha sido completamente cargado y parseado.
document.addEventListener('DOMContentLoaded',function(){
    const btnSaveViaje = document.querySelector('#btn-save-viaje');
    //ASOCIAR UNA FUNCION AL EVENTO CLICK DEL BOTON
    btnSaveViaje.addEventListener('click',saveViaje);
    showViajes();
});