const CART_KEY = 'cart';
const cart = localStorage.getItem(CART_KEY);
const cartItemsElement = document.querySelector('#cart__items');

if (cart) {
    let cartItems = JSON.parse(cart);

    for (let cartItem of cartItems) {
        fetch('http://localhost:3000/api/products/' + cartItem.id)
        .then(response => response.json())
        .then(product => {
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
        })
    }
    
    cartItemsElement.addEventListener('click', e => {
        const cartItem = e.target.closest('.cart__item');
        const id = cartItem.dataset.id;
        const color = cartItem.dataset.color;
        let productIndex = cartItems.findIndex(product => product.id == id && product.color == color);

        if (e.target.classList.contains('deleteItem')) {
            cartItems.splice(productIndex, 1);
            localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
            cartItem.remove();
        }

        if (e.target.classList.contains('itemQuantity')) {
            const quantity = +e.target.value;
            cartItems[productIndex].quantity = quantity;
            localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
        }
    });
}