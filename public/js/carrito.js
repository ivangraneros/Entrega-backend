document.addEventListener('click', async (e) => {
    
    if (e.target && e.target.id === 'btn-purchase') {
        const btn = e.target;
        const cartId = btn.getAttribute('data-cart-id');
        

        if (!cartId) {
            return alert("Error: El botón no tiene el ID del carrito (data-cart-id).");
        }


const finalizarCompra = async (cartId) => {
    const response = await fetch(`/api/carts/${cartId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });

    const result = await response.json();

    if (result.status === "success") {
        alert("¡Compra exitosa! Ticket: " + result.ticket.code);
        window.location.href = "/products"; 
    } else {
        alert("Error al finalizar: " + result.error);
    }
}}});