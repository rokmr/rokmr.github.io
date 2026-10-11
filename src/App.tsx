import { Home } from './pages/Home';
import { Tacle } from './pages/Tacle';

export const routes = ['/', '/tacle/'] as const;
export type Route = (typeof routes)[number];

/** Normalises a URL path to one of the known routes. */
export function toRoute(pathname: string): Route {
  const trimmed = pathname.replace(/index\.html$/, '');
  if (/^\/tacle\/?$/.test(trimmed)) return '/tacle/';
  return '/';
}

export function App({ route, buildYear }: { route: Route; buildYear: number }) {
  if (route === '/tacle/') return <Tacle />;
  return <Home buildYear={buildYear} />;
}
