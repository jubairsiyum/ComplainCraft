import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.profilePicture,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
      }
      
      // Fetch latest user data on token update
      if (trigger === "update" || !token.picture) {
        await connectDB();
        const dbUser = await User.findById(token.id).select('profilePicture firstName lastName');
        if (dbUser) {
          token.picture = dbUser.profilePicture;
          token.name = `${dbUser.firstName} ${dbUser.lastName}`;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        
        // Fetch latest profile picture from database
        await connectDB();
        const dbUser = await User.findById(token.id).select('profilePicture firstName lastName');
        if (dbUser) {
          session.user.image = dbUser.profilePicture;
          session.user.name = `${dbUser.firstName} ${dbUser.lastName}`;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
