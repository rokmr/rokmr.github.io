import { caseStudies } from './data/caseStudies';
import { Home } from './pages/Home';
import { WorkIndex } from './pages/WorkIndex';
import { CaseStudy } from './pages/CaseStudy';
import { Resume } from './pages/Resume';
import { Tacle } from './pages/Tacle';

export const routes = ['/', '/tacle/', '/resume/', '/work/', ...caseStudies.map(study => `/work/${study.id}/` as const)] as const;
export type Route = (typeof routes)[number];

/** Normalises a URL path to one of the known routes. */
export function toRoute(pathname: string): Route {
  const trimmed = pathname.replace(/index\.html$/, '');
  if (/^\/tacle\/?$/.test(trimmed)) return '/tacle/';
  const normalized = trimmed.endsWith('/') ? trimmed : trimmed + '/';
  return routes.find(route => route === normalized) ?? '/';
}

export function App({ route, buildYear }: { route: Route; buildYear: number }) {
  if (route === '/tacle/') return <Tacle />;
  if (route === '/resume/') return <Resume />;
  if (route === '/work/') return <WorkIndex />;
  if (route.startsWith('/work/')) return <CaseStudy id={route.split('/')[2]!} />;
  return <Home buildYear={buildYear} />;
}
