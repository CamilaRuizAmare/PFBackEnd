const addProduct = () => {
    const buttonSearch = document.getElementById('buttonSearch').value;
    let buttonProduct = document.getElementsByClassName('buttonProduct');
    console.log(buttonSearch);
    for (const button of buttonProduct) {
        button.addEventListener('click', () => {
            fetch(`/api/carts/${buttonSearch}/product/${button.value}`, { method: 'POST' })
                .then((response) => {
                    response.json();
                })
                .then((data) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto Agregado Al carrito',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 600,
                        timerProgressBar: true,
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    }
}


addProduct();


