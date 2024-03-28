const deleteUser = () => {
    const buttonDelete = document.getElementsByClassName('deleteUser');
    for (const button of buttonDelete) {
        button.addEventListener('click', () => {
            Swal.fire({
                title: 'Desea eliminar al usuario?',
                text: 'Está a punto de eliminar un usuario',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Borrar'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/api/users/${button.value}`, {
                        method: 'DELETE',
                    })
                        .then((response) => {
                            response.json();
                        })
                        .then((data) => {
                            
                            Swal.fire({
                                title: 'Usuario Borrado',
                                text: `El usuario ha sido eliminado`,
                                icon: 'success',
                                timer: 1500,
                                showConfirmButton: false
                            })
                            .then((result) => {
                                location.reload();
                            });
                        })
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        })
    }
};

const deleteInactiveUsers = () => {
    const buttonDeleteInactiveUsers = document.getElementById('deleteInactiveUsers');
    buttonDeleteInactiveUsers.addEventListener('click', () => {
                fetch('/api/users/', {
                    method: 'DELETE'})
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        Swal.fire({
                            title: 'Usuarios Borrados',
                            icon: 'success',
                            timer: 1500,
                            showConfirmButton: false
                        })
                        .then((result) => {
                            location.reload();
                        });
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
    })
};


deleteUser();
deleteInactiveUsers();