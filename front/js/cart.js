const CART_KEY = 'cart';
const cart = localStorage.getItem(CART_KEY);
const cartItemsElement = document.querySelector('#cart__items');
const totalPriceElement = document.querySelector('#totalPrice');
const totalQuantityElement = document.querySelector('#totalQuantity');
const pricesMap = new Map();

if (cart) {
    let cartItems = JSON.parse(cart);
    
    (async function() {
        //This is not really optimized, since we may query the same product multiple times, will fix that later (maybe)
        for (let cartItem of cartItems) {
            const response = await fetch('http://localhost:3000/api/products/' + cartItem.id);
            const product = await response.json();
            pricesMap.set(product._id, product.price);
            cartItemsElement.insertAdjacentHTML('afterbegin', `
                <article class="cart__item" data-id="${product._id}" data-color="${cartItem.color}">
                    <div class="cart__item__img">
                        <img src="${product.imageUrl}" alt="Photographie d'un canapé">
                    </div>
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <h2>${product.name}</h2>
                            <p>${cartItem.color}</p>
                            <p>${product.price} €</p>
                        </div>
                        <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : </p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                        </div>
                    </div>
                </article>
            `);
        }
        computeAndDisplayPriceAndQuantity(cartItems);
    })()
    
    cartItemsElement.addEventListener('click', e => {
        const cartItem = e.target.closest('.cart__item');
        const id = cartItem.dataset.id;
        const color = cartItem.dataset.color;
        let productIndex = cartItems.findIndex(product => product.id == id && product.color == color);

        if (e.target.classList.contains('deleteItem')) {
            cartItems.splice(productIndex, 1);
            localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
            cartItem.remove();
            computeAndDisplayPriceAndQuantity(cartItems);
        }

        if (e.target.classList.contains('itemQuantity')) {
            const quantity = +e.target.value;
            cartItems[productIndex].quantity = quantity;
            localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
            computeAndDisplayPriceAndQuantity(cartItems);
        }
    });
}

function computeAndDisplayPriceAndQuantity(cartItems) {
    let totalPrice = 0;
    let totalQuantity = 0;

    for (let cartItem of cartItems) {
        totalPrice += pricesMap.get(cartItem.id) * cartItem.quantity;
        totalQuantity += cartItem.quantity;
    }
    totalPriceElement.innerText = totalPrice;
    totalQuantityElement.innerText = totalQuantity;
}