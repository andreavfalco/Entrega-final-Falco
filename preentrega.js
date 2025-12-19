let carrito = [];
let PRODUCTOS_CACHE = [];


function formatearPrecio(precio) {
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

function cargarCarrito() {
  try {
    const guardado = localStorage.getItem("carrito");
    carrito = guardado ? JSON.parse(guardado) : [];
  } catch {
    carrito = [];
  }
  actualizarCarrito();
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}


function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}

function mostrarMensaje(texto) {
  const toast = document.createElement("div");
  toast.className = "toast-mensaje visible";
  toast.textContent = texto;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1400);
}

function actualizarIconoCarrito() {
  const burbuja = document.getElementById("burbuja-carrito");
  if (burbuja) burbuja.textContent = carrito.reduce((s, i) => s + (i.cantidad || 1), 0);
}

function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalTexto = document.getElementById("total-carrito");

  if (!lista || !totalTexto) return;

  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const cantidad = item.cantidad || 1;
    const itemTotal = item.precio * cantidad;
    total += itemTotal;
    const cantidadHtml = cantidad > 1 ? `<span class="cantidad-pequena">x${cantidad}</span>` : "";

    const imgSrc = item.imagen || item.img || "./img/placeholder.png";

    const line = document.createElement("div");
    line.className = "item-carrito";
    line.innerHTML = `
      <img src="${imgSrc}" alt="${item.nombre}">
      <div class="item-info">
        <strong>${item.nombre} ${cantidadHtml}</strong>
        <div class="precio">
          ${cantidad === 1 
          ? `${formatearPrecio(item.precio)}` 
          : `${formatearPrecio(item.precio)} x ${cantidad} = <strong>${formatearPrecio(itemTotal)}</strong>`
          }
</div>
      </div>
      <button class="btn-eliminar" data-index="${index}" aria-label="Eliminar ${item.nombre}">X</button>
    `;
    lista.appendChild(line);
  });

  totalTexto.textContent = formatearPrecio(total);
  actualizarIconoCarrito();

  lista.querySelectorAll(".btn-eliminar").forEach(b => {
    b.addEventListener("click", (e) => {
      const idx = Number(e.target.dataset.index);
      eliminarDelCarrito(idx);
    });
  });
}

function configurarModalCarrito() {
  const modal = document.getElementById("modal-carrito");
  const abrir = document.getElementById("icono-carrito");
  const cerrar = document.getElementById("cerrar-modal-carrito");
  const vaciarBtn = document.getElementById("vaciarCarrito");

  abrir?.addEventListener("click", () => modal.classList.add("visible"));
  cerrar?.addEventListener("click", () => modal.classList.remove("visible"));

  vaciarBtn?.addEventListener("click", () => {
    vaciarCarrito();
    mostrarMensaje("Carrito vaciado");
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("visible");
  });
}

function agregarAlCarritoPorId(id) {
  const producto = PRODUCTOS_CACHE.find(p => String(p.id) === String(id));
  if (!producto) return;

  const item = carrito.find(i => String(i.id) === String(id));

  if (item) {
    item.cantidad++;
  } else {
    carrito.push({ 
      id: producto.id, 
      nombre: producto.titulo, 
      precio: producto.precio, 
      cantidad: 1,
      imagen: producto.imagen,
      });
    }

  guardarCarrito();
  actualizarCarrito();
  mostrarMensaje("Producto agregado ✔");
  }

async function cargarProductosLocal() {
  try {
    const res = await fetch('./productos.json', { cache: "no-store" });
    const data = await res.json();
    console.log(data)
    PRODUCTOS_CACHE = data;
    return data;
  } catch {
    return [];
  }
}

function crearCardProductoDOM(p) {
  const card = document.createElement('div');
  card.className = 'card-producto card';
  card.innerHTML = `
    <div class="card-img-wrap">
      <img src="${p.imagen}" alt="${p.titulo}">
    </div>
    <div class="card-body">
      <h3>${p.titulo}</h3>
      <p class="precio">${formatearPrecio(p.precio)}</p>
      <button class="btn-agregar" data-id="${p.id}">Agregar</button>
    </div>
  `;
  return card;
}

async function renderProductosEnPagina() {
  const productos = await cargarProductosLocal();
  const categoria = document.body.dataset.categoria;
  const grid = document.getElementById("productos-grid");

  grid.innerHTML = "";

  const lista = categoria ? productos.filter(p => p.categoria === categoria) : productos;

  lista.forEach(p => {
    const card = crearCardProductoDOM(p);
    grid.appendChild(card);
  });

  if (!grid.__listener) {
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-agregar");
      if (!btn) return;
      agregarAlCarritoPorId(btn.dataset.id);
    });
    grid.__listener = true;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  cargarCarrito();
  configurarModalCarrito();
  renderProductosEnPagina();
});

const form = document.querySelector("#contactoFORM");

form.addEventListener("submit", () => {
  setTimeout(() => {
    form.reset();
  }, 500);
});
