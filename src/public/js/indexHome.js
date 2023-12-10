/* const renderProducts = (products) => {
    const divProduct = document.getElementById('productDiv');
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

const orderByCategory = () => {
    const orderCategory = document.getElementById('category');
    //const buttonDesc = document.getElementById('orderPriceMax');
    //const buttonAsc = document.getElementById('orderPriceMin');

    orderCategory.addEventListener('change', async () => {
        try {
            const categoryValue = orderCategory.value;
            if (categoryValue === "") {
                history.pushState({ category: categoryValue }, {}, `/api/products/?category=${categoryValue}`);
                getProducts();
                return;
            }
            const response = await fetch(`/api/products/?category=${categoryValue}`);
            history.pushState({}, {}, `/api/products/?category=${categoryValue}`);
            const data = await response.json();
            console.log(data, response.url);
            console.log(categoryValue);
            renderProducts(data.docs);
        } catch (error) {
            console.log(error);
        }
    });
};

const getProducts = () => {
    fetch('/api/products')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data.docs[0]);
            console.log('asjdhasjdas!!!')
            return renderProducts(data.docs);

        })
        .catch((error) => {
            console.error(error);
        });
};

//getProducts();
orderByCategory(); */









