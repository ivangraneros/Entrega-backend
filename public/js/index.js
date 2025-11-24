const socket = io();


socket.on("productosActualizados", (products) => {
  const lista = document.getElementById("lista-productos");
  lista.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.title} - $${p.price}`;
    lista.appendChild(li);
  });
});


document.getElementById("formProducto").addEventListener("submit", (e) => {
  e.preventDefault();
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: Number(document.getElementById("price").value),
    status: document.getElementById("status").value,
    code: document.getElementById("code").value,
    category: document.getElementById("category").value,
    stock: Number(document.getElementById("stock").value)
  };
  socket.emit("nuevoProducto", product);
  e.target.reset();
});


document.getElementById("formEliminar").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("id").value;
  socket.emit("eliminarProducto", id);
  e.target.reset();
});
