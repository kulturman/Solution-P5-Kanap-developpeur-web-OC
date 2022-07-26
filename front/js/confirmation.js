const orderId = new URLSearchParams(window.location.search).get('id');

document.querySelector('#orderId').innerText = orderId;