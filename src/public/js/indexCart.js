const finalizePurchase = () => {
    const buttonFinish = document.getElementById('buttonFinish');
    buttonFinish.addEventListener('click', () => {
        fetch(`/api/carts/${buttonFinish.value}/purchase`, { method: 'POST' })
            .then((response) => {
                response.json()
            })
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.log(error);
            });
    });
};

finalizePurchase();