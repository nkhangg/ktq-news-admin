import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import './index.css';

import { createRoot } from 'react-dom/client';
import { App } from './pages/index.ts';

createRoot(document.getElementById('root')!).render(<App />);
