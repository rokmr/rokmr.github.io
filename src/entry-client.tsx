import { hydrateRoot } from 'react-dom/client';
import { App, toRoute } from './App';
import './styles/index.css';

const root = document.getElementById('root');
const buildYear = Number(root?.dataset.buildYear) || new Date().getFullYear();

if (root) {
  hydrateRoot(root, <App route={toRoute(window.location.pathname)} buildYear={buildYear} />);
}
