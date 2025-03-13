import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that don't require authentication
const publicPaths = ['/signin', '/signup', '/about', '/', '/auth'];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  const path = request.nextUrl.pathname;
  
  // Allow public paths without authentication
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    return response;
  }
  
  // Redirect to signin if accessing a protected path without authentication
  if (!session) {
    const redirectUrl = new URL('/signin', request.url);
    redirectUrl.searchParams.set('redirectTo', path);
    return NextResponse.redirect(redirectUrl);
  }
  
  return response;
}

// Run middleware on all routes except public assets
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 