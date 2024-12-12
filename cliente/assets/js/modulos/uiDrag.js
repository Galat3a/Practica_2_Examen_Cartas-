import { CardApp } from './cardApp.js';

//Permitir arrastrar y soltar elementos en contenedores
export const uiDrag = {
    // Método para inicializar la funcionalidad de arrastrar y soltar
    init: (selectorContenedor, selectorElemento) => {
        // Obtener todos los contenedores y asignarles un palo y un color
        document.querySelectorAll(selectorContenedor).forEach((contenedor) => {
            // Asignar un palo y un color a cada contenedor
            switch (contenedor.id) {
                case "contenedorO":
                    contenedor.dataset.palo = "Oros";
                    contenedor.dataset.color = "#FFFFB3";
                    break;
                case "contenedorBastos":
                    contenedor.dataset.palo = "Bastos";
                    contenedor.dataset.color = "#B3FFB3";
                    break;
                case "contenedorE":
                    contenedor.dataset.palo = "Espadas";
                    contenedor.dataset.color = "#B3D9FF";
                    break;
                case "contenedorC":
                    contenedor.dataset.palo = "Copas";
                    contenedor.dataset.color = "#FFB3B3";
                    break;
            }
            // Permite el evento "drop" para soltar elementos
            contenedor.addEventListener("drop", async (event) => {
                // Evita el comportamiento predeterminado
                event.preventDefault(); 
                /*Obtiene los datos del elemento arrastrado, usando el ID a traves de 
                un JSON. Para ello uso el evento "dataTransfer"*/
                const data = JSON.parse(event.dataTransfer.getData("text"));
                // Obtiene el elemento arrastrado
                const draggedElement = document.getElementById(data.id);
                // Obtiee el palo del contenedor y del elemento arrastrado
                const paloContenedor = contenedor.dataset.palo; 
                const paloElemento = draggedElement.dataset.palo; 

              // Verificar si el palo del contenedor y del elemento arrastrado coinciden
                if (paloContenedor === paloElemento) {
                    // Asigna el color del contenedor al elemento arrastrado
                    draggedElement.style.backgroundColor = contenedor.dataset.color; 
                    // Asigna el palo del contenedor al elemento arrastrado
                    draggedElement.dataset.palo = paloContenedor; 

                    // Log para verificar si el elemento ha sido soltado en el contenedor
                    console.log(`El elemento ha sido soltado en el contenedor con palo: ${contenedor.dataset.palo}`);
                    console.log(`Elemento con ID: ${draggedElement.id} tiene el palo: ${draggedElement.dataset.palo}`);
                    // Añade el elemento al contenedor
                    contenedor.appendChild(draggedElement);
                    // Animación que se dara al soltar la carta en su contenedor. Usando la librería "anime.js"
                    draggedElement.style.zIndex = 10;
                    anime({
                        targets: draggedElement,
                        rotateY: [0, 360], 
                        opacity: [0, 1],    
                        easing: 'easeInOutCubic',
                        duration: 800,      
                        complete: function() {
                         
                            draggedElement.style.zIndex = ''; 
                        }
                    });

                    /**
                     * Guardar el estado en el servidor al soltar una 
                     * carta:Se añadió una llamada fetch dentro del evento drop 
                     * para enviar la información de la carta al servidor. Esta llamada fetch 
                    utiliza el método PUT para actualizar la posición de una carta específica en el servido */
                    await fetch(`http://localhost:3000/api/cards/${draggedElement.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            containerId: contenedor.dataset.palo || 'baraja',
                            position: {
                                left: draggedElement.style.left,
                                top: draggedElement.style.top
                            }
                        })
                    });
                    
                } else {
                    // Si el palo no coincide, devolver el elemento al contenedor original
                    const contenedorGeneral = document.getElementById("contenedorGeneral");
                    // Añade el elemento al contenedor general
                    contenedorGeneral.appendChild(draggedElement);
                    // Log para verificar si el elemento no ha sido soltado en el contenedor
                    console.log(`El elemento no puede ser soltado en el contenedor con palo: ${contenedor.dataset.palo}`);
                }
            });

            // Permite el evento "dragover" para arrastrar elementos
            contenedor.addEventListener("dragover", (event) => {
                event.preventDefault(); //Evitar el comportamiento predeterminado.
                //Necesario para permitir el "drop"
            });
        });

        // Hacer los elementos arrastrables
        document.querySelectorAll(selectorElemento).forEach((item) => {
             // Hace que los elementos sean arrastrables
            item.setAttribute("draggable", true);
            // Permite el evento "dragstart" para arrastrar elementos
            item.addEventListener("dragstart", (event) => {
            // Guardar información del elemento arrastrado en un JSON
                const sendData = {
                    // Envia el ID del elemento arrastrado
                    id: event.target.id,  
                    // Guarda el color del elemento arrastrado
                    color: event.target.style.backgroundColor,  
                    // Guarda el palo del elemento arrastrado
                    palo: event.target.dataset.palo 
                };
                // Pasar los datos de la carta al evento
                event.dataTransfer.setData("text", JSON.stringify(sendData)); 
            });
            // Permite el evento "dragend" para guardar el estado
            item.addEventListener("dragend", (event) => {
                event.target.classList.remove('dragging');
            });
        });
    },

    // Carga el estado del juego desde el servidor
    loadState: async () => {
        try {
            const response = await fetch('http://localhost:3000/api/state', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'omit'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const state = await response.json();
            
            // Solo procesar si hay cartas en el estado
            if (state && state.cards) {
                Object.entries(state.cards).forEach(([cardId, cardState]) => {
                    const card = document.getElementById(cardId);
                    const container = document.querySelector(
                        cardState.containerId === 'baraja' 
                            ? '.contenedorBaraja' 
                            : `[data-palo="${cardState.containerId}"]`
                    );
                    
                    if (card && container) {
                        card.style.position = "absolute";
                        card.style.left = cardState.position.left;
                        card.style.top = cardState.position.top;
                        container.appendChild(card);
                    }
                });
            }
        } catch (error) {
            console.error('Error loading state:', error);
        }
    },

    resetState: async function() {
        // Eliminar el estado guardado en el servidor
        await fetch('http://localhost:3000/api/state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cards: {} })
        });

        // Recargar la página para volver al estado original
        location.reload();
    }
};
