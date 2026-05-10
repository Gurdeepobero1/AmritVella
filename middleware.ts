export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/daily/:path*",
    "/simran/:path*",
    "/emotional/:path*",
    "/career/:path*",
    "/fitness/:path*",
    "/library/:path*",
    "/analytics/:path*",
    "/reviews/:path*",
    "/data/:path*"
  ]
};
