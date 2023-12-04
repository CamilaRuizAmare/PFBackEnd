
fetch('/api/products')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log(data);
        console.log('asjdhasjdas!!!')
        renderProducts(data.docs);
    })
    .catch((error) => {
        console.error(error);
    });



const renderProducts = (products) => {
    const divProduct = document.getElementById('productPrueba');
    divProduct.innerHTML = ``
    products.forEach((product) => {
        divProduct.innerHTML += `
            <div id=${product._id} class="product flex"> 
                <h2>${product.title}</h2>
                <ul>
                    <li>Precio: $ ${product.price}</li>
                    <li>Categoria: ${product.category}</li>
                    <li>Descripción: ${product.description}</li>
                    <li>Stock: ${product.stock}</li>
                </ul>
                <button type="submit" id=${product._id}>Agregar al carrito</button>
            </div>
            `
    })
};
