class Personaje {
    constructor(nombre, altura, masa) {
        this.nombre = nombre;
        this.altura = altura;
        this.masa = masa;
    }

    crearCard() {
        const card = document.createElement('div');
        card.classList.add('col-md-6');

        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${this.nombre}</h5>
                    <p class="card-text"><strong>Estatura:</strong> ${this.altura} cm</p>
                    <p class="card-text"><strong>Peso:</strong> ${this.masa} kg</p>
                </div>
            </div>
        `;
        return card;
    }
}

async function obtenerPersonaje(id) {
    try {
        const response = await fetch(`https://swapi.dev/api/people/${id}/`);
        const data = await response.json();
        return new Personaje(data.name, data.height, data.mass);
    } catch (error) {
        console.error('Error al obtener el personaje:', error);
    }
}

async function* generarPersonajes(inicio, fin) {
    for (let id = inicio; id <= fin; id++) {
        const personaje = await obtenerPersonaje(id);
        yield personaje;
    }
}

async function mostrarPersonajes(rango) {
    const container = document.getElementById('personajes-container');
    container.innerHTML = '';  // Limpia el contenedor

    let inicio, fin;
    switch (rango) {
        case '1-5':
            inicio = 1;
            fin = 5;
            break;
        case '6-11':
            inicio = 6;
            fin = 11;
            break;
        case '12-17':
            inicio = 12;
            fin = 17;
            break;
        default:
            inicio = 1;
            fin = 5;
    }

    const generador = generarPersonajes(inicio, fin);
    for await (let personaje of generador) {
        if (personaje) {
            const card = personaje.crearCard();
            container.appendChild(card);

            // Efecto de desvanecimiento al añadir la tarjeta
            card.style.opacity = 0;
            setTimeout(() => {
                card.style.opacity = 1;
                card.style.transition = 'opacity 0.5s';
            }, 100);
        }
    }
}

document.querySelectorAll('#rango-list .list-group-item').forEach(item => {
    item.addEventListener('mouseenter', (e) => {
        const rango = e.target.getAttribute('data-range');
        mostrarPersonajes(rango);
    });
});
