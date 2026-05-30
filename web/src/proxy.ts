import { NextRequest, NextResponse } from 'next/server';

const PATIENT_HOME = '/patient/dashboard';
const DOCTOR_HOME = '/doctor/dashboard';
const LOGIN_PATH = '/login';

function redirect(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('auth_role')?.value?.toUpperCase();

  const isPatientRoute = pathname.startsWith('/patient');
  const isDoctorRoute = pathname.startsWith('/doctor');
  const isAuthRoute =
    pathname === LOGIN_PATH ||
    pathname === '/register' ||
    pathname.startsWith('/register/') ||
    pathname === '/forgot-password';

  if ((isPatientRoute || isDoctorRoute) && !token) {
    return redirect(request, LOGIN_PATH);
  }

  if (isPatientRoute && role !== 'PATIENT') {
    return redirect(request, role === 'DOCTOR' ? DOCTOR_HOME : LOGIN_PATH);
  }

  if (isDoctorRoute && role !== 'DOCTOR') {
    return redirect(request, role === 'PATIENT' ? PATIENT_HOME : LOGIN_PATH);
  }

  if (isAuthRoute && token) {
    if (role === 'PATIENT') {
      return redirect(request, PATIENT_HOME);
    }
    if (role === 'DOCTOR') {
      return redirect(request, DOCTOR_HOME);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/patient/:path*',
    '/doctor/:path*',
    '/login',
    '/register/:path*',
    '/forgot-password',
  ],
};
