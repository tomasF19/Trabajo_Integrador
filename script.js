const apiUrl = "https://fakestoreapi.com/products";

const contadorCarrito = document.getElementById('contadorCarrito');
const listaProductos = document.querySelector('.productos');
const carritoModal = new bootstrap.Modal(document.getElementById('carritoModal'));
const mensajeCarritoVacio = document.getElementById('mensajeCarritoVacio');

let carrito = [];
let total = 0;

// Cargar carrito al iniciar
function cargarCarrito() {
  try {
    const carritoStorage = localStorage.getItem('carrito');
    if (carritoStorage) {
      carrito = JSON.parse(carritoStorage);
      carrito.forEach(producto => {
        total += producto.precio;
      });
      actualizarCarrito();
    }
  } catch (error) {
    console.error('Error al cargar el carrito: ', error);
  }
}

// Guardar carrito
function guardarCarrito() {
  try {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  } catch (error) {
    console.error('Error al guardar el carrito: ', error);
  }
}

// obtener productos de la API y mostrarlos
async function cargarProductos() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    listaProductos.innerHTML = ''; // Limpia el contenedor
    data.slice(0, 20).forEach(producto => {
      const productoCard = document.createElement('div');
      productoCard.classList.add('col-md-20', 'col-lg-3', 'mb-7', 'custom-card'); 
      productoCard.innerHTML = `
        <article class="producto-card d-flex flex-column h-100">
          <img src="${producto.image}" alt="${producto.title}" class="imagen-producto img-fluid">
          <div class="info flex-grow-1 p-2">
            <h3 class="h5">${producto.title}</h3>
            <p class="small">${producto.description.slice(0, 100)}...</p>
            <p class="precio fw-bold">$${producto.price.toFixed(2)}</p>
          </div>
          <button class="comprar-btn mt-auto btn btn-primary" onclick="agregarAlCarrito(${producto.id}, '${producto.title}', ${producto.price})">Comprar</button>
        </article>
      `;
      listaProductos.appendChild(productoCard);
    });
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

// Actualizar el contador del carrito
function actualizarContadorCarrito() {
  contadorCarrito.textContent = carrito.length;
}

// agregar productos al carrito
function agregarAlCarrito(id, nombre, precio) {
  carrito.push({ id, nombre, precio });
  total += precio;
  guardarCarrito();
  actualizarCarrito();
  actualizarContadorCarrito();
  Swal.fire({
    title: "Producto agregado al carrito",
    text: "¡El producto ha sido añadido exitosamente!",
    icon: "success",
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#3085d6", 
    background: "#f9f9f9", 
    customClass: {
      popup: 'custom-popup-class', 
      title: 'custom-title-class', 
      content: 'custom-content-class', 
      confirmButton: 'custom-confirm-button-class' 
    }
  });
}

//  para actualizar la vista del carrito
function actualizarCarrito() {
  const listaCarrito = document.getElementById('listaCarrito');
  const totalCarrito = document.getElementById('totalCarrito');

  if (listaCarrito && totalCarrito) {
    listaCarrito.innerHTML = '';
    carrito.forEach((producto, index) => {
      listaCarrito.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          ${producto.nombre} - $${producto.precio.toFixed(2)}
          <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar</button>
        </li>
      `;
    });

    totalCarrito.textContent = `$${total.toFixed(2)}`;

    // Mostrar/ocultar el mensaje de carrito vacío
    if (carrito.length === 0) {
      mensajeCarritoVacio.style.display = 'block';
    } else {
      mensajeCarritoVacio.style.display = 'none';
    }
  }
}

//  eliminar productos del carrito
function eliminarDelCarrito(index) {
  total -= carrito[index].precio;
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarCarrito();
  actualizarContadorCarrito();
}

// vaciar el carrito
function vaciarCarrito() {
  carrito = [];
  total = 0;
  guardarCarrito();
  actualizarCarrito();
  actualizarContadorCarrito();
}

// para manejar la compra del carrito
function comprarCarrito() {
  console.log('Carrito actual:', carrito); // Verificar el contenido del carrito
  if (carrito.length === 0) {
    Swal.fire({
      title: "Carrito vacío",
      text: "No puedes realizar una compra sin productos en el carrito.",
      icon: "error",
      confirmButtonText: "Aceptar"
    });
    return;
  }

  Swal.fire({
    title: '¡Gracias por tu compra!',
    html: '<p>Tu pedido ha sido procesado con éxito.</p><p>¡Esperamos que disfrutes de tus productos!</p>',
    icon: 'success',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#3085d6',
    background: '#f9f9f9',
    customClass: {
      popup: 'custom-popup-class',
      title: 'custom-title-class',
      content: 'custom-content-class',
      confirmButton: 'custom-confirm-button-class'
    }
  }).then(() => {
    carrito = [];
    total = 0;
    guardarCarrito();
    actualizarCarrito();
    actualizarContadorCarrito();
  });
}

// btn compra en el modal del carrito
const btnCompraModal = document.querySelector('.btn-finalizar-compra');
if (btnCompraModal) {
  btnCompraModal.addEventListener('click', comprarCarrito);
}

// Cargar productos y carrito al inicio
document.addEventListener('DOMContentLoaded', () => {
  cargarProductos();
  cargarCarrito();
  actualizarContadorCarrito();
});

// Abrir el modal del carrito al hacer click en el enlace del carrito
document.querySelector('.nav-link[href="carrito.html"]').addEventListener('click', (event) => {
  event.preventDefault();
  carritoModal.show();
  actualizarCarrito();
});