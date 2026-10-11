import { renderToString } from 'react-dom/server';
import { App, routes, type Route } from './App';
import { bodyClassFor, renderHead } from './seo/head';

export type RenderResult = {
  route: Route;
  /** Path of the emitted file, relative to dist/. */
  file: string;
  html: string;
  head: string;
  bodyClass: string;
  buildYear: number;
};

export function renderAll(): RenderResult[] {
  const buildYear = new Date().getFullYear();

  return routes.map((route) => ({
    route,
    file: route === '/' ? 'index.html' : `${route.replace(/^\/|\/$/g, '')}/index.html`,
    html: renderToString(<App route={route} buildYear={buildYear} />),
    head: renderHead(route),
    bodyClass: bodyClassFor(route),
    buildYear,
  }));
}

export { routes };
