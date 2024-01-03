import { renderTrpcPanel } from 'trpc-panel';
import { createHTTPServer } from './utils/server';
import { appRouter } from './routes';

const port = 3000;
const baseUrl = `http://localhost:${port}`;
const docHtml = renderTrpcPanel(appRouter, { url: baseUrl });

const server = createHTTPServer({
  preRouter: [
    {
      path: '/trpc-panel',
      handler: (req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.end(docHtml);
      }
    }
  ],
  router: appRouter,
});

server.listen(port);

console.log(`➜  Local:   ${baseUrl}`);
