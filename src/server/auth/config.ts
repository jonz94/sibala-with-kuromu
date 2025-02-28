import { AccessDenied } from '@auth/core/errors'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { type DefaultSession, type NextAuthConfig } from 'next-auth'
import DiscordProvider, { type DiscordProfile } from 'next-auth/providers/discord'

import { db } from '~/server/db'
import { accounts, admins, sessions, users, verificationTokens } from '~/server/db/schema'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user']
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    DiscordProvider({
      authorization: {
        url: 'https://discord.com/api/oauth2/authorize',
        params: { scope: 'identify' },
      },
      profile(profile: DiscordProfile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber =
            profile.discriminator === '0'
              ? Number(BigInt(profile.id) >> BigInt(22)) % 6
              : parseInt(profile.discriminator) % 5
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
        } else {
          const format = profile.avatar.startsWith('a_') ? 'gif' : 'png'
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
        }

        return {
          id: profile.id,
          name: profile.global_name ?? profile.username,
          email: `${profile.id}@fake.discord.email`,
          image: profile.image_url,
        }
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    signIn: async ({ user }) => {
      const adminEmails = (await db.select().from(admins)).map((admin) => `${admin.id}@fake.discord.email`)

      if (adminEmails.includes(user.email ?? '')) {
        return true
      }

      throw new AccessDenied()
    },
  },
  pages: {
    error: '/error',
  },
} satisfies NextAuthConfig
