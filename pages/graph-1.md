`graph-1.js` construye, calcula y renderiza dinámicamente las conexiones o "aristas" de un grafo interactivo llamado *Grafo de divisibilidad del 7*.

En lugar de dibujar líneas y flechas manualmente en HTML, el script calcula la posición de cada nodo, traza curvas entre ellos y coloca puntos animados y flechas para dar sensación de movimiento.

---

### Funciones principales

* **`getNodeCenter(node, container)`**
  - Calcula el centro de un nodo respecto al contenedor principal.
  - Asegura que las líneas salgan y lleguen al punto correcto de cada nodo.

* **`createEdgeElement(edgeContainer, pathString, targetPoint, options)`**
  - Crea el elemento SVG y el trazo (`<path>`) con una ruta Bezier.
  - Añade un punto animado (`.edge-dot`) que recorre la línea.
  - Calcula y posiciona la flecha usando `Math.atan2` para que apunte en la dirección correcta.

* **`createCurvedEdge(edgeContainer, def)`**
  - Toma la definición de la conexión (origen y destino).
  - Calcula los puntos de control para dibujar una curva de Bézier cúbica.
  - Permite que las conexiones sean curvas en lugar de rectas.

* **`createLoopEdge(edgeContainer, node, options)`**
  - Dibuja un bucle cerrado alrededor de un nodo.
  - Se usa para el nodo `0`, que tiene una trayectoria circular propia.

* **`buildGraphEdges()`**
  - Define la estructura del grafo con una lista de conexiones.
  - Incluye origen, destino, curva, retardo de animación y parámetros visuales.
  - Llama a las funciones anteriores para construir todas las aristas.

* **Evento `DOMContentLoaded`**
  - Espera a que el documento HTML esté cargado.
  - Ejecuta `buildGraphEdges()` cuando los nodos ya existen en el DOM.

---

### Resumen

El script automatiza la geometría y el diseño visual de las líneas curvas y flechas que conectan los números del 0 al 6, aportando dinamismo al grafo de divisibilidad.