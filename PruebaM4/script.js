class Producto {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}

class Carrito {
    constructor() {
        this.productos = [];
    }

    agregarProducto(producto, cantidad) {
        for (let i = 0; i < cantidad; i++) {
            this.productos.push(producto);
        }
        alert(`${producto.nombre} x${cantidad} ha sido agregado al carrito.`);
    }

    calcularTotal() {
        return this.productos.reduce((total, producto) => total + producto.precio, 0);
    }

    finalizarCompra() {
        const total = this.calcularTotal();
        alert("Compra finalizada. Total a pagar: $" + total.toFixed(2));
    }

    mostrarDetalles() {
        if (this.productos.length === 0) {
            alert("El carrito está vacío.");
            return;
        }
        let detalles = "Productos en el carrito:\n";
        this.productos.forEach((producto, index) => {
            detalles += `${index + 1}. ${producto.nombre} - $${producto.precio.toFixed(2)}\n`;
        });
        detalles += "Total de la compra: $" + this.calcularTotal().toFixed(2);
        alert(detalles);
    }
}

const carrito = new Carrito();
const productosDisponibles = [
    new Producto("Leche", 1000),
    new Producto("Pan de Molde", 2000),
    new Producto("Queso", 1200),
    new Producto("Mermelada", 890),
    new Producto("Azúcar", 1300)
];

function mostrarProductos() {
    const divProductos = document.getElementById('productos');
    divProductos.innerHTML = '<h3>Productos disponibles:</h3>';
    productosDisponibles.forEach((producto, index) => {
        divProductos.innerHTML += `<p>${index + 1}. ${producto.nombre} - $${producto.precio}</p>`;
    });
}

function iniciarCompra() {
    let seguir = true;
    while (seguir) {
        let productoElegido = prompt("Ingrese el número del producto que desea agregar:");
        let producto = productosDisponibles[productoElegido - 1];

        while (!producto) {
            alert("Número de producto no válido. Intente de nuevo.");
            productoElegido = prompt("Ingrese el número del producto que desea agregar:");
            producto = productosDisponibles[productoElegido - 1];
        }

        let cantidad = parseInt(prompt("Ingrese la cantidad de unidades:"));
        while (!cantidad || cantidad < 1) {
            alert("Cantidad no válida. Intente de nuevo.");
            cantidad = parseInt(prompt("Ingrese la cantidad de unidades:"));
        }

        carrito.agregarProducto(producto, cantidad);
        seguir = confirm("¿Desea seguir agregando productos?");
    }

    carrito.mostrarDetalles();
    carrito.finalizarCompra();
}

window.onload = mostrarProductos;
