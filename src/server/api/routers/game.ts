import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { calculateScore, rollDice } from '~/lib/roll-dice'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '~/server/api/trpc'
import { attempts, games } from '~/server/db/schema'

export const gameRouter = createTRPCRouter({
  check: publicProcedure
    .input(
      z.object({
        id: z.number().gt(0),
        code: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.games.findFirst({
        where: and(eq(games.id, input.id), eq(games.code, input.code)),
      })
    }),

  play: publicProcedure
    .input(
      z.object({
        id: z.number().gt(0),
        code: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.db.query.games.findFirst({
        where: and(eq(games.id, input.id), eq(games.code, input.code), eq(games.allowPlay, true)),
      })

      if (!game) {
        return null
      }

      await ctx.db.update(games).set({ allowPlay: false }).where(eq(games.id, game.id))

      const attempt = [rollDice(), rollDice(), rollDice(), rollDice()] as const
      const score = calculateScore(attempt)

      const results = await ctx.db
        .insert(attempts)
        .values({
          gameId: game.id,
          dice1: attempt[0],
          dice2: attempt[1],
          dice3: attempt[2],
          dice4: attempt[3],
          round: 1,
          score,
        })
        .returning()

      return results.at(0) ?? null
    }),

  createGame: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.insert(games).values({}).returning()
  }),

  unlockGame: protectedProcedure.input(z.object({ id: z.number().gt(0) })).mutation(async ({ ctx, input }) => {
    return await ctx.db.update(games).set({ allowPlay: true }).where(eq(games.id, input.id)).returning()
  }),

  getLatestAttempt: protectedProcedure
    .input(z.object({ gameId: z.number().gt(0) }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.query.attempts.findFirst({
        where: eq(attempts.gameId, input.gameId),
        orderBy: (attempt, { desc }) => [desc(attempt.createdAt)],
      })
    }),
})
