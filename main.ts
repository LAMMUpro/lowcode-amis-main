import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './src/routes';

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);

console.log('➜  Local:   http://localhost:3000/')
