// const inicializarCarrito = async () => {
//     let cartId = localStorage.getItem('cartId');
    
//     if (!cartId || cartId === "null" || cartId === "undefined") {
//         console.log("No hay carrito, creando uno nuevo...");
        
//         try {
//             const response = await fetch('/carrito', { method: 'POST' });
//             const data = await response.json();
//             if (data.payload && data.payload._id) {
//                 cartId = data.payload._id;
//                 localStorage.setItem('cartId', cartId);
//                 console.log("✅ Carrito guardado con éxito:", cartId);
//             } else {
//                 console.error("❌ El servidor no envió el ID en el payload:", data);
//             }
//         } catch (error) {
//             console.error("❌ Error en la petición POST:", error);
//         }
//     } else {
//         console.log("✔ Carrito ya existente en LocalStorage:", cartId);
//     }
// };

// inicializarCarrito();