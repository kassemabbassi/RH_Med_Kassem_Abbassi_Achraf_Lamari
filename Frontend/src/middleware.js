import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const tk = request.cookies.get('token');
  const rl = request.cookies.get('role');
  const token = tk ? tk.value : null;
  const role = rl ? rl.value : null;


  if (path.startsWith("/login") )
  {
    if(!token && !role)
      return NextResponse.next();
    else if ( token && role==="admin")
      return NextResponse.redirect(new URL('/HomeRH', request.url));
    else if ( token && role!=="admin")
      return NextResponse.redirect(new URL('/', request.url));
  }





  if (!token ) {
    return NextResponse.redirect(new URL('/', request.url));
  }


  if ((role !== "admin" && path.startsWith("/Admin")) || (role === "admin" && path.startsWith("/User"))) {
    return new NextResponse(null, { status: 403 });
  }
  return NextResponse.next();
}


export const config = {
  matcher: ['/login','/User/:path*','/Admin/:path*'],
};
