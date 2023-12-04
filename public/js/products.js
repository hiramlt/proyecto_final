const cart_id = localStorage.getItem('cart_id');

const closeBtn = document.getElementById('close-btn');
const welcomeModal = document.querySelector('.welcome-modal');

closeBtn.addEventListener('click', (event) => {
    event.preventDefault();
    welcomeModal.open = false;
});

document.getElementById('nav-profile').addEventListener('click', () => {
    window.location.href = `/profile`;
});

document.getElementById('nav-cart').addEventListener('click', () => {
    if (cart_id) {
        window.location.href = `/carts/${cart_id}`;
    } else {
       alert("Agregue un producto para ver carrito")
    }
});

const product_btns = document.querySelectorAll('.btn-cart');
product_btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const product_id = btn.parentElement.getAttribute('data-id');
        const quantity = btn.parentElement.querySelector('#quantity').value;

        handleClick(product_id, quantity);
    });
});

function handleClick(id, quantity) {
    if (cart_id){
        addProduct(id, quantity);
    } else {
        const created = createCart();
        if (created) {
            addProduct(id, quantity);
        }
    }
}

function createCart() {
    let created = false;

    fetch('http://localhost:8080/api/carts', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('cart_id', data._id);
        created = true;
    }) 
    .catch(error => console.error('Error al crear el carrito:', error));

    return created;
}

function addProduct(product_id, quantity){
    fetch(`http://localhost:8080/api/carts/${cart_id}/product/${product_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  
        },
        body: JSON.stringify({ quantity: Number(quantity) })
    })
    .then(response => {
        if (response.ok || response.status === 204){
            alert("Se añadio el producto al carrito")
        }
    })
    .catch(error => console.error('Error al añadir producto:', error));
}