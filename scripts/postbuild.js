import { copyFileSync } from 'fs';
import { resolve } from 'path';

const dist = resolve('dist');
copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'));
console.log('Created dist/404.html for SPA routing on GitHub Pages.');
