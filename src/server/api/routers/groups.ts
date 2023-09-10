import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const groupsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.taskGroup.findMany({
      where: {
        authorId: ctx.session.user.id,
      },
    });
  }),

  getOne: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.taskGroup.findUnique({
      where: {
        id: input,
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.taskGroup.create({
        data: {
          title: input.title,
          description: input.description,
          authorId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.taskGroup.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
        },
      });
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.taskGroup.delete({
      where: {
        id: input,
      },
    });
  }),
});
