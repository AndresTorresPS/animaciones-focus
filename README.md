# Animaciones Focus - Grafos Interactivos

Sistema de diseño para animaciones del canal de YouTube Focus LATAM.

Una página web moderna para visualizar grafos interactivos con animaciones fascinantes.

## 📁 Estructura del Proyecto

```
animaciones-focus/
├── index.html                 # Página de inicio con botón de navegación
├── pages/
│   └── graph-1.html          # Primera visualización de grafo
├── assets/
│   ├── css/
│   │   └── styles.css        # Estilos compartidos (responsive, animaciones)
│   └── js/
│       └── graph.js          # Clases ParticleGraph y Particle
├── README.md                 # Este archivo
└── LICENSE
```

## 🎨 Características

- **Página de Inicio Elegante**: Landing page con animación de fondo de partículas
- **Botón Interactivo**: Botón "Ver primer grafo" con efecto hover suave
- **Múltiples Páginas**: Sistema de rutas organizadas (`/pages/`)
- **Grafos Interactivos**: Visualización de nodos conectados que responden al movimiento del mouse
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **JavaScript Modularizado**: Clases reutilizables para crear nuevos grafos

## 🚀 Cómo Usar

### Ver la página localmente
Abre `index.html` en tu navegador o usa un servidor local:

```bash
# Si tienes Python 3
python -m http.server 8000

# Si tienes Node.js
npx http-server

# Luego visita http://localhost:8000
```

## 📝 Agregar Nuevas Páginas de Grafos

### 1. Crear un nuevo archivo HTML
Copia este template en `pages/grafo-2.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Segundo Grafo - Visualización</title>
    <link rel="stylesheet" href="../assets/css/styles.css">
</head>
<body>
    <div class="grafo-container">
        <a href="../index.html" class="nav-btn">← Volver</a>
        
        <canvas id="grafo-canvas"></canvas>

        <div class="overlay">
            <h1>
                Tu título aquí con <span class="highlight">destacado</span>
            </h1>
        </div>
    </div>

    <script src="../assets/js/graph.js"></script>
    <script>
        const graph = new ParticleGraph('grafo-canvas', 120);
    </script>
</body>
</html>
```

### 2. Agregar enlace en index.html
Edita `index.html` y agrega más botones en `.home-content`:

```html
<a href="pages/graph-1.html" class="btn">
    <span>Ver primer grafo</span>
</a>
<a href="pages/grafo-2.html" class="btn">
    <span>Ver segundo grafo</span>
</a>
```

## 🎯 Personalizar

### Cambiar colores
Edita las variables CSS en `assets/css/styles.css`:

```css
:root {
    --accent-color: #00d9ff;      /* Color principal */
    --node-color: #64ffda;        /* Color de nodos */
    --text-color: #ffffff;        /* Color de texto */
}
```

### Ajustar la animación
En cada página HTML, modifica el parámetro de `ParticleGraph`:

```javascript
// Menos partículas = más fluidez
new ParticleGraph('grafo-canvas', 60);

// Más partículas = más denso
new ParticleGraph('grafo-canvas', 150);
```

## 🔧 Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsivo, animaciones, gradientes
- **Canvas API**: Renderizado de gráficos 2D
- **JavaScript ES6+**: Clases, arrow functions, destructuring
