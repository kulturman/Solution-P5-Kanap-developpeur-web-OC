const id = new URLSearchParams(window.location.search).get('id');
const imageElement = document.querySelector('.item__img');
const priceElement = document.querySelector('#price');
const descriptionElement = document.querySelector('#description');
const titleElement = document.querySelector('#title')
const colorsElement = document.querySelector('#colors');
const addToCartButton = document.querySelector('#addToCart');
const quantityElement = document.querySelector('#quantity');
const CART_KEY = 'cart';

fetch('http://localhost:3000/api/products/' + id)
    .then(response => response.json())
    .then(product => {
        imageElement.insertAdjacentHTML('afterbegin', `<img src="${product.imageUrl}" alt="${product.altTxt}">`);
        priceElement.innerText = product.price;
        descriptionElement.innerText = product.description;
        titleElement.innerHTML = product.name;

        product.colors.forEach(color => colorsElement.insertAdjacentHTML('beforeend', `<option value="${color}">${color}</option>`));
    })

addToCartButton.addEventListener('click', e => {
    const quantity = +quantityElement.value;
    const color = colorsElement.value;

    if (quantity <= 0 || quantity > 100 || color == '') {
        alert('Veuillez sélectionner une quantité et une couleur');
    }
    else {
        let cart = localStorage.getItem(CART_KEY);
        if (cart == null) {
            let cartItems = [];
            cartItems.push({
                id,
                color,
                quantity
            });
            localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
        }
        else {
            let cartItems = JSON.parse(cart);
            let productIndex = cartItems.findIndex(product => product.id == id && product.color == color);
            if (productIndex < 0) {
                cartItems.push({
                    id,
                    color,
                    quantity
                });
            }
            else {
                cartItems[productIndex].quantity += quantity;
            }
            localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
            alert('Produit ajouté avec succès');
        }
    }
});
