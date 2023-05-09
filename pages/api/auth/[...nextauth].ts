import prisma from '@/libs/prisma';
import env from '@/utils/env';
import _ from 'lodash';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            authorize: async (credentials) => {
                const email = _.get(credentials, 'email');
                if (!email) {
                    throw new Error('Email not found.');
                }

                const customer = await prisma.customer.findFirst({
                    where: {
                        email,
                    },
                });
                if (!customer) {
                    throw new Error('Customer not found.');
                }

                await prisma.$disconnect();

                return {
                    ...customer,
                    id: `${customer.id}`,
                };
            },
        }),
    ],
    secret: env.auth.secret,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/',
        error: '/',
    },
    debug: process.env.NODE_ENV !== 'production',
    callbacks: {
        async jwt({ token, user, session, trigger }) {
            if (trigger === 'update' && session) {
                return {
                    ...token,
                    ...session.user,
                };
            }

            return {
                ...token,
                ...user,
            };
        },

        async session({ session, token }) {
            return {
                ...session,
                customer: {
                    id: token.id,
                    profilePicture: token.profilePicture ?? '',
                    contactNumber: token.contactNumber,
                    name: token.name,
                    email: token.email,
                },
            };
        },
    },
};

export default NextAuth(authOptions);
