const finalizePurchase = () => {
    const buttonFinish = document.getElementById('buttonFinish');
    buttonFinish.addEventListener('click', () => {
        Swal.fire({
            icon: 'info',
            title: 'Estamos procesando tu compra',
            position: 'top-end',
            showConfirmButton: false,
            timer: 6000,
            timerProgressBar: true,
        })
        fetch(`/api/carts/${buttonFinish.value}/purchase`, { method: 'POST' })
            .then((response) => {
                response.json()
            })
            .then((data) => {
                Swal.fire({
                    icon: 'success',
                    title: '¡Listo! Tu compra ha sido aprobada',
                    text: `Chequeá tu correo electrónico para conocer los detalles de la misma`,
                    position: 'top-end',
                    showConfirmButton: true,
                    timer: 10000,
                    timerProgressBar: true,
                }).then(() => {
                    location.reload();
                });
            })
            .catch((error) => {
                console.log(error);
            });
    });
};

const emptyCart = () => {
    const button = document.getElementById('deleteAllCart');
    const idCart = document.getElementById('buttonFinish');
    button.addEventListener('click', () => {
        fetch(`/api/carts/${idCart.value}`, { method: 'DELETE' })
            .then((response) => {
                response.json()
            })
            .then((data) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Carrito Vacío!',
                    position: 'top-end',
                    showConfirmButton: true,
                    timer: 10000,
                    timerProgressBar: true,
                }).then(() => {
                    location.reload();
                });
            })
            .catch((error) => {
                console.log(error);
            });
    })
};

const deleteProductFromCart = () => {
    const buttonDelete = document.getElementsByClassName('deleteFromCart');
    const idCart = document.getElementById('buttonFinish');
    for (const button of buttonDelete) {
        button.addEventListener('click', () => {
            fetch(`/api/carts/${idCart.value}/product/${button.value}`, { method: 'DELETE' })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto eliminado del carrito',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 600,
                        timerProgressBar: true,
                    })
                        .then((result) => {
                            location.reload();
                        });
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    }
};

finalizePurchase();
emptyCart();
deleteProductFromCart();