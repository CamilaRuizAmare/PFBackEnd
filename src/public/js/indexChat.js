const socket = io();

socket.on('messages', (data) => {
    const divChat = document.getElementById('chat');
    divChat.innerHTML = '';
    data.forEach((message) => {
      divChat.innerHTML += `
      <p><b>${message.user}:</b> ${message.message}</p>`
  })});
  
  const user = document.getElementById('user');
  console.log(user.value);
  const message = document.getElementById('message');
  const buttonChat = document.getElementById('chat-button');
  const formChat = document.getElementById('chatForm');
  buttonChat.addEventListener('click', (e) => {
    e.preventDefault();
    const newMessage = {
      user: user.value,
      message: message.value
    };
    console.log(newMessage);
    if (!newMessage.user || !newMessage.message) {
      Swal.fire({
        icon: 'error',
        title: 'Información incompleta',
        text: 'Alguno de los campos se encuentra vacío, por favor completar',
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    };
    socket.emit('newMessage', newMessage);
    formChat.reset();
  });
