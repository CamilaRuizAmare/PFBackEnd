const socket = io();

socket.on('mensaje', (mensaje) => {
  console.log(mensaje);
});

socket.on('products', (data) => {
    const divPrueba = document.getElementById('prueba');
    divPrueba.innerHTML = `${data.length}`;
});

// Ejemplo: Emitir evento 'prueba' al servidor cuando se carga la página
socket.emit('prueba', 'Hola desde el cliente');