const socket = io();

const lista = document.getElementById("lista-productos");
socket.on("productosActualizados", (products) => {
  if(lista) {
  lista.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
        li.innerHTML = `
            <strong>${p.title}</strong> - $${p.price}
            <br>
            <small style="color: red;">ID: ${p._id}</small> 
        `;
    lista.appendChild(li);
  });
}
});


const formProducto = document.getElementById("formProducto");
if (formProducto) {
  formProducto.addEventListener("submit", (e) => {
  e.preventDefault();
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: Number(document.getElementById("price").value),
    category: document.getElementById("category").value,
    stock: Number(document.getElementById("stock").value)
  };
  socket.emit("nuevoProducto", product);
  e.target.reset();
});
};


const formEliminar = document.getElementById("formEliminar");
if (formEliminar) {
  formEliminar.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("id").value;
  socket.emit("eliminarProducto", id);
  e.target.reset();
});
};



// Función para inicializar el carrito
const inicializarCarrito = async () => {
    let cid = localStorage.getItem('cartId');
    if (!cid || cid === "null" || cid === "undefined") {
        try {
            const response = await fetch('/carrito', { method: 'POST' });
            const data = await response.json();
            const actualId = data.id || (data.payload && data.payload.id);

            if (actualId) {
                localStorage.setItem('cartId', actualId);
                console.log("✅ Carrito guardado con ID:", actualId);
            } else {
                console.error("❌ No se encontró la propiedad 'id' en la respuesta:", data);
            }
        } catch (error) {
            console.error("❌ Error al crear carrito:", error);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrito();

    const btnCarrito = document.getElementById('btn-ver-carrito');
    if (btnCarrito) {
        btnCarrito.addEventListener('click', () => {
            const currentCid = localStorage.getItem('cartId');
            if (currentCid && currentCid !== "null") {
                window.location.href = `/carrito/${currentCid}`;
            } else {
                alert("No se pudo recuperar el ID del carrito. Intenta recargar la página.");
            }
        });
    }
});


const irAlCarrito = () => {
    const cid = localStorage.getItem('cartId');
    if (cid && cid !== "null") {
        window.location.href = `/carrito/${cid}`; 
    } else {
        alert("Aún no tienes un carrito activo.");
    }
};

document.getElementById('btn-ver-carrito')?.addEventListener('click', irAlCarrito);


const agregarAlCarrito = async (productId) => {
    const cartId = localStorage.getItem('cartId');

    if (!cartId) return alert("No hay carrito");

    try {
        const response = await fetch(`/carrito/${cartId}/products/${productId}`, {
            method: 'POST'
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ Producto agregado");
        } else {
            alert("❌ Error: " + (data.message || "No se pudo agregar"));
        }
    } catch (error) {
        console.error("Error al agregar:", error);
    }
};