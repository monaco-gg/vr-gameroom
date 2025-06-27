import { NextResponse, userAgent } from "next/server";
import { getToken } from "next-auth/jwt";
import { isMobileUserAgent } from "./utils";
import requestCustom from "@utils/apiCustom";

/**
 * Checks if the user's profile is complete.
 * @param {string} email - The user's email.
 * @param {Array} allCookies - Array of cookies to include in the request.
 * @returns {Promise<boolean>} - True if the profile is complete, otherwise false.
 * @throws {Error} - Throws an error if the profile status cannot be verified.
 */
async function isUserProfileComplete(email, allCookies) {
  try {
    const response = await requestCustom(
      "/users",
      "GET",
      null,
      { email },
      allCookies
    );
    return response.isProfileCompleted;
  } catch (error) {
    throw new Error("Failed to verify profile completeness.");
  }
}

/**
 * Middleware to handle authentication and redirection based on user profile and device type.
 * @param {import('next/server').NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - The response after processing the middleware logic.
 */
export async function middleware(request) {
  const token = await getToken({ req: request });
  const allCookies = request.cookies.getAll();
  const { ua } = userAgent(request);
  const isMobile = isMobileUserAgent(ua);
  const url = request.nextUrl.clone();
  const referralCode = url.searchParams.get("referralCode");
  const callbackUrl = `${process.env.NEXT_PUBLIC_API_URL}${url.pathname}`;

  // Handle case where token is missing or invalid
  if (!token || !token.id) {
    // signOut(); // Ensure the user is signed out if token is invalid or missing

    url.pathname = isMobile ? "/auth/sign-in" : "/auth/sign-in/qrcode";
    if (referralCode?.trim()) {
      url.searchParams.set("referralCode", referralCode);
    }

    url.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(url);
  }

  // Check if the user's profile is complete
  const isProfileComplete = await isUserProfileComplete(
    token.email,
    allCookies
  );
  if (!isProfileComplete) {
    url.pathname = "/room/personal-information";
    url.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.rewrite(url);
  }

  // Redirect non-mobile users to QR code sign-in page
  if (!isMobile) {
    url.pathname = "/auth/sign-in/qrcode";
    if (referralCode?.trim()) {
      url.searchParams.set("referralCode", referralCode);
    }
    url.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

/**
 * Configuration for the middleware matcher.
 * @type {Object}
 * @property {Array<string>} matcher - Array of paths to match for the middleware.
 */
export const config = { matcher: ["/room/:path*"] };
