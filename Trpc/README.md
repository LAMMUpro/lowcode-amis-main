# trpc模板工程

> trpc工程下的代码不能使用`src/*`、`@/*`这样的绝对路径，统一使用相对路径

Requires node 18
pnpm

## Playing

```
pnpm i
pnpm run dev
```


## Building

```
pnpm run build
```

## 客户端使用
`@trpc/client@10.45.0`
```TSX
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../trpc-template/src/routes';

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
    }),
  ],
});

await trpc.userList.query();
```