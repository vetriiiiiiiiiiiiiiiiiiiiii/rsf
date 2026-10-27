import { NextResponse, type NextRequest } from "next/server";

/** Where the administration pages live. */
const ADMIN = "/asdfghjkl";
/** The address staff type in. It leads straight into the administration area. */
const ENTRY = "/asdfghjkl;'";

function safeDecode(p: string) {
  try {
    return decodeURIComponent(p);
  } catch {
    return p;
  }
}

/**
 * Optimistic gate for the administration area: requests without a session
 * cookie are sent to the login page before any rendering happens. This is
 * NOT the authorisation check — every admin page and server action verifies
 * the session against the database via requireAdmin().
 */
export function proxy(request: NextRequest) {
  // Browsers may send the apostrophe percent-encoded.
  const pathname = safeDecode(request.nextUrl.pathname);
  if (pathname.startsWith(ENTRY)) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN + pathname.slice(ENTRY.length);
    return NextResponse.redirect(url);
  }
  if (pathname === `${ADMIN}/login`) return NextResponse.next();
  if (!request.cookies.has("rsf_session")) {
    return NextResponse.redirect(new URL(`${ADMIN}/login`, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/asdfghjkl(.*)"],
};
