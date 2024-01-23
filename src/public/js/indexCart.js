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
                    <li>Total: $ ${product._id.price*product.quantity}</li>
                </ul>
            </div>
            `
    })
};



const searchCart = () => {

    const buttonSearch = document.getElementById('buttonSearch');
    console.log(buttonSearch.value);
    buttonSearch.addEventListener('click', (e) => {
        fetch(`/api/carts/${buttonSearch.value}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                renderProducts(data); 
            })
            .catch((error) => {
                console.error(error);
            });  
    });

};

searchCart();