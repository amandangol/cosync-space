import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/cosyncspace-dashboard(.*)',
  '/workspace(.*)',
]);

export default clerkMiddleware((auth, req) => {
  const url = new URL(req.url);

  // Check if there's an invitation token in the URL
  if (url.searchParams.has("invitation_token")) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/cosyncspace-dashboard', // or wherever  the user to be redirected
      },
    });
  }

  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
