import { router } from "../trpc";
import { UserRouter, userRouter } from "./user";

export const appRouter = router<{
  /** 用户 */
  user: UserRouter
}>({
  user: userRouter
})

export type AppRouter = typeof appRouter;