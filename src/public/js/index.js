 
 // Cliente
 const socketClient = io();
 function deleteProduct(id) {
  const productId = id;
  const userEmailInput = document.getElementById('userEmail');
  const userRoleInput = document.getElementById('userRole');


  const userEmail = userEmailInput.value.trim();
  const userRole = userRoleInput.value.trim();

  if (!userEmail || !userRole) {
    console.error('User email and role are required.');
    return;
  }
 console.log('User email:', userEmail);
  console.log('User role:', userRole);

 socketClient.emit('deleteProduct', { productId, userEmail, userRole });
}
/*
// Borrar producto
/*  function deleteProduct(id) {
  const productId = id;

   const userRole = document.getElementById('userRole').value;
  const userEmail = document.getElementById('userEmail').value;

  if ((userRole === 'Admin') || (userRole === 'Premium' && userEmail === product.ownerEmail)) {
    socketClient.emit('deleteProduct', productId);
  } else {
    alert('No tienes permisos para eliminar este producto.');
  } }
   */
  document.addEventListener('DOMContentLoaded', () => {

  // Campos del form
const formularioAgregarProducto = document.getElementById('formularioAgregarProducto');
  const titleInput = document.getElementById('title');
  const descriptionInput = document.getElementById('description');
  const priceInput = document.getElementById('price');
  const categoryInput = document.getElementById('category');
  const codeInput = document.getElementById('code');
  const stockInput = document.getElementById('stock');
  const thumbnailsInput = document.getElementById('thumbnails');
  const userRoleInput =  document.getElementById('userRole');
  const userEmailInput =  document.getElementById('userEmail');

  formularioAgregarProducto.addEventListener('submit', (e) => {
    e.preventDefault();

    const product = {
      title: titleInput.value,
      description: descriptionInput.value,
      price: parseFloat(priceInput.value),
      category: categoryInput.value,
      code: codeInput.value,
      stock: parseInt(stockInput.value),
      thumbnails: thumbnailsInput.value, 
      owner: userRoleInput.value,
      ownerEmail:userEmailInput.value,
      
    };

    // Agregar producto
    socketClient.emit('addProduct', product);

    // Limpiar formulario
    titleInput.value = '';
    descriptionInput.value = '';
    priceInput.value = '';
    categoryInput.value = '';
    codeInput.value = '';
    stockInput.value = '';
    thumbnailsInput.value = '';
  });
   
    socketClient.on('actualizarProductos', (productos) => {
    actualizarInterfaz(productos);
  });

  function actualizarInterfaz(productList) {
    const container = document.querySelector('.container');
    container.innerHTML = '';
  
    productList.forEach((product) => {
      const card = document.createElement('div');
      card.classList.add('cards');
  
      card.innerHTML = `
        <img src="${product.thumbnails}" alt="Imagen del producto" class="productImage">
        <h3 class="cardTitle">${product.title}</h3>
        <h4 class="cardPrice">$${product.price}</h4>
        <h4 class="cardStock">Stock: ${product.stock}</h4>
        <p class="cardOwnerr">Correo electrónico: ${product.ownerEmail}</p>
        <button data-product-id="${product._id}" onclick="deleteProduct('${product._id}')">Eliminar✖️</button>
      `;
  
      container.appendChild(card);
    });
  }
  
});



