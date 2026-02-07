import type { DefaultSession, NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db';
import bcrypt from 'bcryptjs';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            name: string;
            email: string;
            image: string;
        } & DefaultSession['user'];
    }
}

export const authConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email as string,
                    },
                });

                if (!user || !user.password) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.image = user.image;
            }
            if (!token.sub) return token;
            const existingUser = await prisma.user.findUnique({
                where: {
                    id: token.sub,
                },
            });
            if (existingUser) {
                token.image = existingUser.image;
            }
            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.image = token.image as string;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    trustHost: true,
    events: {
        createUser: async ({ user }) => {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date(),
                },
            });
        },
    },
} satisfies NextAuthConfig;