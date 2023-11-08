document.getElementById('addProductToCart').addEventListener('click', function() {
    const productId = this.getAttribute('data-product');

    addProductToCart(productId);
  });
  
  function addProductToCart(productId) {
    fetch(`http://localhost:8080/api/carts/653c4d21231e12313aca2b9c/products/${productId}`, {
      method: 'POST',
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