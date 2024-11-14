import { type RaffleV0 } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const raffleV0Router = createTRPCRouter({
  getLatest: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session) {
      return null;
    }

    const raffleV0 = await ctx.db.raffleV0.findUnique({
      where: { createdById: ctx.session.user.id },
    });
    return raffleV0 ?? null;
  }),

  getPaginatedRaffleV0: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.raffleV0.findMany({
        where: {
          ...(ctx.session?.user?.id
            ? {
                NOT: {
                  createdById: ctx.session.user.id, // セッションがある場合のみ自分のポストを除外
                },
              }
            : {}), // セッションがない場合は条件なし
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          id: "asc",
        },
      });

      let nextCursor: typeof input.cursor = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getFilteredRaffleV0: protectedProcedure
    .input(
      z.object({
        give: z.array(z.string()),
        want: z.array(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { give, want } = input;
      return ctx.db.raffleV0.findMany({
        take: 10,
        where: {
          ...(ctx.session?.user?.id
            ? {
                NOT: {
                  createdById: ctx.session.user.id, // セッションがある場合のみ自分のポストを除外
                },
              }
            : {}), // セッションがない場合は条件なし
          OR: [
            {
              AND: [
                {
                  want: {
                    hasSome: give,
                  },
                },
                {
                  give: {
                    hasSome: want,
                  },
                },
              ],
            },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        xid: z.string(),
        give: z.array(z.string()),
        want: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<RaffleV0> => {
      if (!ctx.session) {
        throw new Error("Session not found");
      }

      const { give, want } = input;

      return ctx.db.raffleV0.upsert({
        where: { createdById: ctx.session.user.id },
        update: {
          xid: input.xid,
          give,
          want,
          updatedAt: new Date(),
        },
        create: {
          xid: input.xid,
          give,
          want,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
});
