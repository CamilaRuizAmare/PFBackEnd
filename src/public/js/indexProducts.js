const renderProducts = (products) => {
    const divProducts = document.getElementById('productsCartDiv');
    divProducts.innerHTML = ``
    products.forEach((product) => {
        divProducts.innerHTML += `
            <div id=${product._id._id} class="product flex"> 
                <h2>${product._id.title}</h2>
                <ul>
                    <li>Precio Unitario: $ ${product._id.price}</li>
                    <li>Descripción: ${product._id.description}</li>
                    <li>Cantidad: ${product.quantity}</li>
                    <li>Total: $ ${product._id.price * product.quantity}</li>
                </ul>
            </div>
            `
    })
};

const addProduct = () => {
    const buttonSearch = document.getElementById('buttonSearch').value;
    let buttonProduct = document.getElementsByClassName('buttonProduct');
    console.log(buttonSearch);
    for (const button of buttonProduct) {
        button.addEventListener('click', () => {
            fetch(`/api/carts/${buttonSearch}/product/${button.value}`, {method: 'POST'})
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




const searchCart = () => {

    const buttonSearch = document.getElementById('buttonSearch');
    //console.log(buttonSearch.value);
    buttonSearch.addEventListener('click', (e) => {
        //window.location.replace(`/api/carts/${buttonSearch.value}`);
        fetch(`/api/carts/${buttonSearch.value}`)
            .then((response) => {
                response.json();
            })
            .then((data) => {
                console.log(data);
                window.location.replace(`/api/carts/${buttonSearch.value}`);
                renderProducts(data); 
            })
            .catch((error) => {
                console.error(error);
            });
    });

};



searchCart();

addProduct();


