import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@lammu/amis-trpc/src/routes'; // 通过软链接等形式拿到后端的类型

/** trpc对象 */
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
});

// console.log(trpc.userList.query());