const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DIST_DIR = path.join(ROOT, 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

// Asegurar que exista la carpeta dist (por si acaso)
if (!fs.existsSync(INDEX_HTML)) {
  console.error("No se encontró dist/index.html. Debes compilar con Vite primero.");
  process.exit(1);
}

const template = fs.readFileSync(INDEX_HTML, 'utf8');

// Rutas estáticas principales y su metadata
const staticRoutes = [
  {
    path: '/',
    title: 'FlowSights | Software de Inteligencia Operativa y Datos para PyMEs',
    description: 'En FlowSights transformamos tus datos de Excel, POS y WhatsApp en decisiones que generan dinero. Especialistas en automatización y optimización.'
  },
  {
    path: '/blog',
    title: 'Blog | FlowSights - Aprende a operar con datos confiables',
    description: 'Artículos prácticos sobre calidad de datos, dashboards, KPIs y automatización para PyMEs. Ideas para vender más y gastar menos.'
  },
  {
    path: '/diagnostico',
    title: 'Diagnóstico Gratuito | FlowSights',
    description: 'Realiza nuestro diagnóstico gratuito y descubre en 48 horas dónde está perdiendo dinero tu operación y cómo solucionarlo.'
  },
  {
    path: '/privacidad',
    title: 'Política de Privacidad | FlowSights',
    description: 'Política de privacidad y manejo de datos de FlowSights.'
  }
];

// Función para extraer los posts del blog leyendo el archivo .ts
function getBlogPosts() {
  try {
    const blogDataPath = path.join(ROOT, 'src/data/blog.ts');
    const content = fs.readFileSync(blogDataPath, 'utf8');
    
    const posts = [];
    // Un regex que extraiga slug, title y excerpt. 
    // Usamos regex con cuidado asumiendo el formato actual de src/data/blog.ts
    const blockRegex = /slug:\s*["']([^"']+)["'][\s\S]*?title:\s*["']([^"']+)["'][\s\S]*?excerpt:\s*["']([^"']+)["']/g;
    let match;
    
    while ((match = blockRegex.exec(content)) !== null) {
      posts.push({
        path: `/blog/${match[1]}`,
        title: `${match[2]} | FlowSights`,
        description: match[3]
      });
    }
    return posts;
  } catch (error) {
    console.error("Error leyendo blog posts:", error);
    return [];
  }
}

const allRoutes = [...staticRoutes, ...getBlogPosts()];

// Generador
allRoutes.forEach(route => {
  if (route.path === '/') return; // El index ya tiene el meta correcto de la raíz

  // Crear la ruta de directorio (ej: dist/blog/mi-post)
  const routeDir = path.join(DIST_DIR, route.path);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  // Reemplazar <title> y <meta name="description">
  let html = template;
  
  // Reemplazar título
  html = html.replace(
    /<title>.*?<\/title>/i,
    `<title>${route.title}</title>`
  );

  // Reemplazar descripción
  html = html.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${route.description}" />`
  );

  // Reemplazar og:title y og:description para redes sociales
  html = html.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta property="og:description" content="${route.description}" />`
  );

  // Guardar el archivo index.html en el subdirectorio correspondiente
  const outputFile = path.join(routeDir, 'index.html');
  fs.writeFileSync(outputFile, html);
  console.log(`Pre-renderizado exitoso: ${route.path} -> ${outputFile}`);
});

console.log('✅ SSG Pre-render completado correctamente.');
