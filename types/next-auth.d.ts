import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        customer: {
            id: string;
            profilePicture: string;
            contactNumber: string;
            name: string;
            email: string;
        };
    }
}
