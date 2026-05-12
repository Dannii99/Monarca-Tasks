import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const isDemo =
          credentials.email === process.env.DEMO_EMAIL &&
          credentials.password === process.env.DEMO_PASSWORD

        const isAdmin =
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD

        if (!isDemo && !isAdmin) return null

        return {
          id: isDemo ? 'demo' : 'admin',
          email: credentials.email as string,
          role: isDemo ? 'demo' : 'admin',
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session: ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
