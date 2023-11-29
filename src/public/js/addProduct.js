document.querySelector('.botonDetail').addEventListener('click', function() {
    const productId = this.getAttribute('data-product');
    const cartId = this.getAttribute('data-cart');
    const quantity = parseInt(document.getElementById(`productQuantity_${productId}`).value, 10);

    addProductToCart(cartId, productId, quantity);
  });
  
  function addProductToCart(cartId, productId, quantity)  {
    fetch(`http://localhost:8080/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: quantity })
    })
    .then(response => {

        if (response.status === 200) {
            alert('Producto agregado al carrito exitosamente.');
        } else if (response.status === 400) {
            alert('Error: La cantidad excede el stock disponible.');
        } else {
        alert('Error al agregar producto: ' + response.status);
        }
    })
    .catch(error => {
            alert('Error en la solicitud: ' + error.message);
    });
  }
  