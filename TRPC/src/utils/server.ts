import { createHTTPHandler, CreateHTTPHandlerOptions } from '@trpc/server/adapters/standalone';
import { AnyRouter } from '@trpc/server';
import http from 'http';

/** 
 * 替代 @trpc默认的httpServer
 * 扩展功能：支持对某些路径进行匹配处理
 */
export function createHTTPServer<TRouter extends AnyRouter>(
  opts: CreateHTTPHandlerOptions<TRouter> & {
    preRouter?: Array<{
      path: string
      handler: (req: http.IncomingMessage, res:http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage}) => void
    }>
  },
) {
  //TODO路径匹配规则
  const prePaths = opts.preRouter?.map(item => item.path) || [];
  const handler = createHTTPHandler(opts);
  const server = http.createServer((req, res) => {
    if (req.url && prePaths.includes(req.url)) {
      opts.preRouter?.find(item => item.path == req.url)?.handler(req, res);
    } else {
      handler(req, res);
    }
  });

  return {
    server,
    listen: (port?: number, hostname?: string) => {
      server.listen(port, hostname);
      const actualPort =
        port === 0 ? ((server.address() as any).port as number) : port;

      return {
        port: actualPort,
      };
    },
  };
}