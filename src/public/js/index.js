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
            <li> Código interno: ${product.code}</li>
            <li>Stock: ${product.stock}</li>
            <li>Propietario: ${product.owner}</li>
        </ul>
        <img src="${product.thumbnail}" alt="${product.description}" />
    </div>`;
  });
});



const deleteProduct = document.getElementById('deleteProductButton');
const formAddProduct = document.getElementById('addProduct');
const formDeleteProduct = document.getElementById('deleteProduct');

deleteProduct.addEventListener('click', async (e) => {
  e.preventDefault();
  let idToDelete = document.getElementById('id').value;
  Swal.fire({
    title: 'Desea eliminar el producto?',
    text: 'Está a punto de eliminar un producto',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Borrar'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/products/${idToDelete}`, { method: 'delete' })
      .then((response) => {
        response.json();
      })
      .then((data) => {
        Swal.fire({
          title: 'Producto Borrado',
          text: `El producto bajo el ID ${idToDelete} ha sido eliminado`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });     
        formDeleteProduct.reset();
        location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
          
    }
  })
});

