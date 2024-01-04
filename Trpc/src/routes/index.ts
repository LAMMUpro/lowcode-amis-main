import { router } from "../trpc";
import { applicationRouter } from './application';
import { userRouter } from "./user";

export const appRouter = router({
  /** 测试 */
  user: userRouter,
  /** 应用 */
  application: applicationRouter,
})

export type AppRouter = typeof appRouter;