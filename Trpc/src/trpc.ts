import { initTRPC } from '@trpc/server';
import { TRPCPanelMeta } from "trpc-panel";

const trpc = initTRPC.meta<TRPCPanelMeta>().create();
export const router = trpc.router;
export const procedure = trpc.procedure;