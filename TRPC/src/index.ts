import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './routes';

const port = 3001;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(port);

console.log(`➜  Local:   http://localhost:${port}/`)

export type { AppRouter } from './routes';
