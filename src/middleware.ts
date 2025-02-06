import { NextResponse } from "next/server";
import axios from "axios";
import { NextRequest } from "next/server";
import { API_URL } from "./utils";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  console.log("Middleware executed for:", pathname);

  // Define the routes that can be accessed by non-logged-in users
  const publicRoutes = ["/login", "/signup", "/reset-password"];

  // If the user is accessing a public route, no login check is required
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    const testUrl = `${API_URL}/users/test`;
    console.log(`Checking login status from ${testUrl}`);

    const response = await axios.get(testUrl);

    // Log the full response to see its structure
    console.log("API response:", response);

    if (response.status === 200 && response.data.loggedIn) {
      console.log("User is logged in, allowing navigation.");
      return NextResponse.next();
    } else {
      console.log("User is not logged in, redirecting to /login.");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle Axios error specifically
      console.error(
        "Error checking login status:",
        error.response?.data || error.message,
      );
    } else {
      // Handle unexpected error
      console.error("An unexpected error occurred:", error);
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/"], // Add routes here that need protection
};
