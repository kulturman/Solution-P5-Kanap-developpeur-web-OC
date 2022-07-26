const CART_KEY = 'cart';
const cart = localStorage.getItem(CART_KEY);
const cartItemsElement = document.querySelector('#cart__items');
const totalPriceElement = document.querySelector('#totalPrice');
const totalQuantityElement = document.querySelector('#totalQuantity');
const pricesMap = new Map();
const submitButton = document.querySelector('#order');
const inputsElement = document.querySelectorAll('.cart__order__form__question input');

const fieldsMap = {
    firstName: { regex: /^[a-zA-Z]+$/, errorMessage: 'Veuillez entrer un prénom valide', isValid: false },
    lastName: { regex: /^[a-zA-Z]+$/, errorMessage: 'Veuillez entrer un nom valide', isValid: false },
    email: { regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, errorMessage: 'Veuillez entrer une adresse mail valide', isValid: false },
    address: { regex: /^[A-Za-z0-9\s]{5,100}$/, errorMessage: 'Veuillez entrer une adresse valide', isValid: false },
    city: { regex: /^[A-Za-z0-9\s]{5,100}$/, errorMessage: 'Veuillez entrer un nom de ville valide', isValid: false },
};

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

    submitButton.addEventListener('click', e => {
        e.preventDefault();
        //Check if all fields are valid
        let invalidElement = Object.keys(fieldsMap).findIndex(field => fieldsMap[field].isValid == false);
        
        if (invalidElement >= 0) {
            alert('Veuillez remplir correctement tous les champs');
            return;
        }

        //Submit the form here

    });

    for (inputElement of inputsElement) {
        inputElement.addEventListener('keyup', e => {
            const value = e.target.value;
            const name = e.target.name;
            const inputData = fieldsMap[name];

            if (inputData.regex.test(value)) {
                document.querySelector(`#${name}ErrorMsg`).innerText = '';
                inputData.isValid = true;
            }
            else {
                document.querySelector(`#${name}ErrorMsg`).innerText = inputData.errorMessage;
                inputData.isValid = false;
            }
        });
    }

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

