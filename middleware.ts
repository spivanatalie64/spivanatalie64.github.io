import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host')

  // Check if the request is coming from the darren subdomain
  if (hostname === 'darren.acreetionos.org') {
    // Rewrite the internal path to the specific subfolder
    // This keeps the URL as darren.acreetionos.org in the browser
    return NextResponse.rewrite(new URL('/darren/index.html', request.url))
  }
}
