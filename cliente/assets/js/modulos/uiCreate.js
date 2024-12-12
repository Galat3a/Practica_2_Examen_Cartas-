//Crear cartas en el DOM
export const uiCreate = {
    // Método para crear cartas, recibe el selector del contenedor, la cantidad de elementos, el color y el palo
    createElement: (contenedorSelector, cantidadElementos, color, palo) => {
        // Obtener el contenedor
        const contenedor = document.querySelector(contenedorSelector);
        // Verificar si el contenedor existe, si es asi crearemos las cartas
        if (contenedor) {
            // Crear las cartas a traves de un bucle for
            for (let i = 1; i <= cantidadElementos; i++) {
                // Crear la carta
                const carta = document.createElement("div")
                //Asignar clase carta
                carta.classList.add("carta");
                //Asignar color de fondo de la carta
                carta.style.backgroundColor = color; 
                //Haccemos que los elementos sean arrastrables
                carta.setAttribute("draggable", true); 

                // Asignar propiedades, en este caso el palo y el color, a traves de un dataset
                carta.id = `${palo}-${i}`;
                carta.dataset.palo = palo;
                carta.dataset.color = color;

                // Crear los textos dentro de la carta, uno para el número y otro para el palo
                const div1 = document.createElement("div");
                const div2 = document.createElement("div");
                const div3 = document.createElement("div");
                
                div1.textContent = i; // Número de la carta
                div2.textContent = palo; // Palo de la carta
                div3.textContent = i; // Número de la carta
                
                /*Añadiendo el elemento div1, div2, div3 que contiene el
                 número de la carta, el palo y el número, como un hijo del elemento carta.*/
                carta.appendChild(div1);//Añadir el número de la carta
                carta.appendChild(div2);//Añadir el palo de la carta
                carta.appendChild(div3);//Añadir el número de la carta

                // Añadir la carta al contenedor
                contenedor.appendChild(carta);

                // Log para verificar creación
                console.log(`Carta creada: ${carta.id}`);
            }
        }
    }
};
