import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  // publicProcedure,
} from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        authorId: ctx.session.user.id,
      },
    });
  }),

  getGroupTasks: protectedProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findMany({
        where: {
          groupId: input,
        },
      });
    }),

  getOne: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.task.findUnique({
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
        dueDate: z.date().optional(),
        groupId: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          authorId: ctx.session.user.id,
          groupId: input.groupId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        dueDate: z.date().optional(),
        groupId: z.string().optional(),
        done: z.boolean().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          dueDate: input.dueDate,
          groupId: input.groupId,
          done: input.done,
        },
      });
    }),

  updateDone: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          done: input.done,
        },
      });
    }),

  updateStarred: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        starred: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: {
          id: input.id,
        },
        data: {
          starred: input.starred,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
