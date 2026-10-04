import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * In production the prerenderer fills <!--app-head-->. Without this, `vite dev`
 * would serve a page with no title, meta or structured data, so dev would not
 * represent the real site. Dev only — the build path is untouched.
 */
function devHead(): Plugin {
  return {
    name: 'dev-head',
    apply: 'serve',
    transformIndexHtml: {
      order: 'pre',
      async handler(html, ctx) {
        const server = ctx.server;
        if (!server) return html;
        const { renderHead, bodyClassFor } = await server.ssrLoadModule('/src/seo/head.ts');
        const { toRoute } = await server.ssrLoadModule('/src/App.tsx');
        const route = toRoute(ctx.path);
        const bodyClass = bodyClassFor(route);
        return html
          .replace('<!--app-head-->', renderHead(route))
          .replace('<body>', bodyClass ? `<body class="${bodyClass}">` : '<body>');
      },
    },
  };
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), devHead()],
  server: {
    // /tacle/ must serve the same SPA shell in dev as it does when prerendered.
    port: 8000,
  },
  build: {
    // The SSR pass emits a Node bundle that scripts/prerender.mjs imports.
    // The client pass emits the hydrating bundle plus index.html as the shell.
    outDir: isSsrBuild ? 'dist-ssr' : 'dist',
    emptyOutDir: true,
    ...(isSsrBuild
      ? { ssr: 'src/entry-server.tsx' }
      : { rollupOptions: { input: 'index.html' } }),
  },
}));
