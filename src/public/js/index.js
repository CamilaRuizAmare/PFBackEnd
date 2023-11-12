const socket = io();

socket.on('products', (data) => {
    const divProducts = document.getElementById('products');
    divProducts.innerHTML = '';
    data.forEach((product) => {
      divProducts.innerHTML += `
      <div class="product">
        <ul>
            <h2>${product.title}</h2>
            <li>Precio: $ ${product.price}</li>
            <li>Descripcion: ${product.description}</li>
            <li>Stock: ${product.stock}</li>
            <img class='imgWidth' src="../img/${product.thumbnail[0].originalname}" alt="Sin imagen">
            <img class='imgWidth' src="../img/${product.thumbnail[1].originalname}" alt="Sin imagen">
            </ul>
    </div>`;
    });
});

