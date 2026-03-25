import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/destinations/:path*",
    "/ingestion/:path*",
    "/review-classification/:path*",
    "/review-content/:path*",
    "/products/:path*",
    "/attributes/:path*",
    "/booking-sources/:path*",
    "/tags/:path*",
    "/packages/:path*",
    "/staging/:path*",
    "/push-history/:path*",
    "/monitoring/:path*",
    "/users/:path*",
    "/settings/:path*",
  ],
};
