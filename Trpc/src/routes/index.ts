import { router } from "../trpc";
import { appEnvRouter } from "./appEnv";
import { applicationRouter } from './application';
import { userRouter } from "./user";

export const appRouter = router({
  /** 测试 */
  user: userRouter,
  /** 应用 */
  application: applicationRouter,
  /** 应用环境 */
  appEnv: appEnvRouter,
})

export type AppRouter = typeof appRouter;