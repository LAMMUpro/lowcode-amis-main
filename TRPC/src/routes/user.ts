import { z } from 'zod';
import { db } from '../db';
import { procedure, router } from '../trpc';

export const userRouter = router({
  /** http://localhost:3000/userList */
  userList: procedure.query(async () => {
    const users = await db.user.findMany();
    return users;
  }),
  userById: procedure.input(z.string()).query(async (opts) => {
    const { input } = opts;
    const user = await db.user.findById(input);
    return user;
  }),
  /** 创建角色 */
  userCreate: procedure
    .input(z.object({ 
      /** 姓名 */
      name: z.string()
    }))
    .mutation(async (opts) => {
      const { input } = opts;
      const user = await db.user.create(input);
      return user;
    }),
});

export type UserRouter = typeof userRouter;