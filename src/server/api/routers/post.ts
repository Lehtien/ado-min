import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";


export const postSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  account: z.string().min(1 , "アカウント名を入力してください"),
  gender: z.string() || z.null(),
  age: z.string() || z.null(),
  area: z.string() || z.null(),
  likeMusic1: z.string().min(1, "好きな曲第1位を入力してください"),
  likeMusic2: z.string().min(1, "好きな曲第2位を入力してください"),
  likeMusic3: z.string().min(1, "好きな曲第3位を入力してください"),
  likeAdo: z.string().min(1, "Adoの好きなところを入力してください"),
  live: z.string() || z.null(),
  freeSpace: z.string() || z.null(),
});

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(postSchema)
    .mutation(async ({ ctx, input }) => {
        return ctx.db.post.upsert({
          where: { createdById: ctx.session.user.id },
          update: {
            ...input,
            updatedAt: new Date(),
          },
          create: {
            ...input,
            createdBy: { connect: { id: ctx.session.user.id } },
          },
        });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findUnique({
      where: { createdById: ctx.session.user.id },
    });
    return post ?? null;
  }),

  // ページネーション付き全件取得
  getPaginatedPosts: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.post.findMany({
        where: {
          NOT: {
            createdById: ctx.session.user.id  // 自分のポストを除外
          }
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

  // フィルター付き全件取得
  getFilteredPosts: protectedProcedure
  .input(
    z.object({
      likeMusic1: z.string().optional(),
      likeMusic2: z.string().optional(),
      likeMusic3: z.string().optional(),
      area: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { likeMusic1, likeMusic2, likeMusic3, area } = input;
    return ctx.db.post.findMany({
      take: 10,
      where: {
        // 自分以外の条件を追加
        NOT: {
          createdById: ctx.session.user.id
        },
        OR: [
          // likeMusic1の検索条件
          ...(likeMusic1
            ? [
                { likeMusic1: { contains: likeMusic1 } },
                { likeMusic2: { contains: likeMusic1 } },
                { likeMusic3: { contains: likeMusic1 } },
              ]
            : []),
          // likeMusic2の検索条件
          ...(likeMusic2
            ? [
                { likeMusic1: { contains: likeMusic2 } },
                { likeMusic2: { contains: likeMusic2 } },
                { likeMusic3: { contains: likeMusic2 } },
              ]
            : []),
          // likeMusic3の検索条件
          ...(likeMusic3
            ? [
                { likeMusic1: { contains: likeMusic3 } },
                { likeMusic2: { contains: likeMusic3 } },
                { likeMusic3: { contains: likeMusic3 } },
              ]
            : []),
          // 居住地
          ...(area ? [{ area: { equals: area } }] : [])
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});