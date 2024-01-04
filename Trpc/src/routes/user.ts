import { z } from 'zod';
import { db } from '../db';
import { procedure, router } from '../trpc';

export const userRouter = router({
  /** http://localhost:3000/userList */
  userList: procedure
    .meta({
      description: "获取用户列表"
    })
    .query(async () => {
      const users = await db.user.findMany();
      return users;
    }),
  userById: procedure
    .meta({
      description: "通过id查找用户"
    })
    .input(z.string()).query(async (opts) => {
      const { input } = opts;
      const user = await db.user.findById(input);
      return user;
    }),
  /** 创建用户 */
  userCreate: procedure
    .meta({
      description: "创建用户"
    })
    .input(z.object({ 
      /** 姓名 */
      name: z.string().describe("姓名属性")
    }))
    .mutation(async (opts) => {
      const { input } = opts;
      const user = await db.user.create(input);
      return user;
    }),
});
