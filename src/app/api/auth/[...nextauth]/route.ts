import NextAuth, { AuthOptions, DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import request from '@utils/api';

const nextAuthUrl = process.env.NEXTAUTH_URL;
if (!nextAuthUrl) {
  throw new Error("NEXTAUTH_URL is not defined");
}

const useSecureCookies = nextAuthUrl.startsWith("https://");
const hostName = new URL(nextAuthUrl).hostname;
const rootDomain = process.env.ROOT_DOMAIN || hostName;

type UserResponse = {
  data: {
    _id: string;
  };
};

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
    accessToken?: string;
  }

  interface JWT {
    id?: string;
    accessToken?: string;
  }
}

// Registers a new user by sending a POST request to the user API.
async function registerUser(profile: any): Promise<Object> {
  try {
    const data = {
      email: profile.email,
      name: profile.name,
      photo: profile.picture,
    };

    const headers = {
      "X-API-KEY": process.env.API_KEY as string,
    };

    return await request("/users", "POST", data, undefined, true, undefined, headers);
  } catch (error) {
    console.error("Failed to register user:", error);
    throw new Error("User registration failed");
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  session: {
    maxAge: 2 * 60 * 60, // 2 hours
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: hostName === "localhost" ? undefined : "." + rootDomain,
      },
    },
  },
  callbacks: {
    // Callback triggered when a JWT is created or updated.
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const user = await registerUser(profile) as UserResponse;
        if (user?.data) {
          token.id = user.data._id;
        }
      }

      if (account && account.access_token) {
        token.accessToken = account.access_token as string;
      }

      return token;
    },

    // Callback triggered when a session is created or updated.
    async session({ session, token }) {
      if (typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
      }

      if (typeof token.id === 'string' && session.user) {
        session.user.id = token.id;
      }

      return session;
    },

    // Callback to handle custom redirects after sign-in.
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

