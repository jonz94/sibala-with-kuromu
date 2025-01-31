import { relations, sql } from 'drizzle-orm'
import { index, int, primaryKey, sqliteTableCreator, text } from 'drizzle-orm/sqlite-core'
import { type AdapterAccount } from 'next-auth/adapters'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `sibala-with-kuromu_${name}`)

export const games = createTable('game', (t) => ({
  id: t.integer('id').primaryKey(),
  code: t
    .text('code', { length: 255 })
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  createdAt: t.text('created_at').default(sql`CURRENT_TIMESTAMP`),
  allowPlay: t.integer('allow_play', { mode: 'boolean' }).notNull().default(true),
}))

export type SelectGame = typeof games.$inferSelect

export const attempts = createTable('attempt', (t) => ({
  id: t.integer('id').primaryKey(),
  gameId: t
    .integer('game_id')
    .references(() => games.id)
    .notNull(),
  round: t.integer('round').notNull(),
  dice1: t.integer('dice1').notNull(),
  dice2: t.integer('dice2').notNull(),
  dice3: t.integer('dice3').notNull(),
  dice4: t.integer('dice4').notNull(),
  score: t.integer('score').notNull(),
  createdAt: t.text('created_at').default(sql`CURRENT_TIMESTAMP`),
}))

export type SelectAttempt = typeof attempts.$inferSelect

export const admins = createTable('admin', {
  id: text('id', { length: 255 }).notNull().primaryKey(),
})

export const users = createTable('user', {
  id: text('id', { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name', { length: 255 }),
  email: text('email', { length: 255 }).notNull(),
  emailVerified: int('email_verified', {
    mode: 'timestamp',
  }).default(sql`(unixepoch())`),
  image: text('image', { length: 255 }),
})

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}))

export const accounts = createTable(
  'account',
  {
    userId: text('user_id', { length: 255 })
      .notNull()
      .references(() => users.id),
    type: text('type', { length: 255 }).$type<AdapterAccount['type']>().notNull(),
    provider: text('provider', { length: 255 }).notNull(),
    providerAccountId: text('provider_account_id', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: int('expires_at'),
    token_type: text('token_type', { length: 255 }),
    scope: text('scope', { length: 255 }),
    id_token: text('id_token'),
    session_state: text('session_state', { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index('account_user_id_idx').on(account.userId),
  }),
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessions = createTable(
  'session',
  {
    sessionToken: text('session_token', { length: 255 }).notNull().primaryKey(),
    userId: text('userId', { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: int('expires', { mode: 'timestamp' }).notNull(),
  },
  (session) => ({
    userIdIdx: index('session_userId_idx').on(session.userId),
  }),
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

export const verificationTokens = createTable(
  'verification_token',
  {
    identifier: text('identifier', { length: 255 }).notNull(),
    token: text('token', { length: 255 }).notNull(),
    expires: int('expires', { mode: 'timestamp' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
)
