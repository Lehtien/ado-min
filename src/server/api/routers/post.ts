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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});