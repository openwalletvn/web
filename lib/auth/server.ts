import { betterAuth } from 'better-auth'
import { magicLink } from 'better-auth/plugins'
import { Pool } from '@neondatabase/serverless'
import { insertUserRow } from '@/lib/neon-db'

export const auth = betterAuth({
    database: new Pool({ connectionString: process.env.DATABASE_URL }),
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    plugins: [
        magicLink({
            sendMagicLink: async ({ email, url }) => {
                console.log('[magic-link]', email, url)
            },
            expiresIn: 900,
            disableSignUp: false,
        }),
    ],
    databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    await insertUserRow(user.id, user.email, user.name)
                },
            },
        },
    },
})
