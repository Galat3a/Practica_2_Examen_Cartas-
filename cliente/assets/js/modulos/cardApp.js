import { uiCreate } from './uiCreate.js';
import { uiDrag } from './uiDrag.js';

export class CardApp {
    static async fetchInitialState() {
        try {
            const response = await fetch('http://localhost:3000/api/cartas');
            const cartas = await response.json();
            cartas.forEach(carta => {
                const element = document.createElement('div');
                element.id = carta.id;
                element.className = 'carta';
                element.dataset.palo = carta.palo;
                const contenedor = document.getElementById(`contenedor${carta.palo}`);
                element.style.backgroundColor = contenedor.dataset.color;
                contenedor.appendChild(element);
            });
        } catch (error) {
            console.error('Error fetching initial state:', error);
        }
    }

    static async saveState() {
        const cartas = Array.from(document.querySelectorAll('.carta')).map(carta => ({
            id: carta.id,
            palo: carta.dataset.palo
        }));

        try {
            await fetch('http://localhost:3000/api/cartas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cartas)
            });
        } catch (error) {
            console.error('Error saving state:', error);
        }
    }
}
