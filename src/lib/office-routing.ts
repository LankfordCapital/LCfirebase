export function getOfficeContextFromUrl(): 'borrower' | 'broker' | 'workforce' {
  if (typeof window === 'undefined') return 'borrower';
  
  const pathname = window.location.pathname;
  if (pathname.startsWith('/broker-office')) {
    return 'broker';
  } else if (pathname.startsWith('/workforce-office')) {
    return 'workforce';
  } else {
    return 'borrower';
  }
}

export function getOfficeBasePath(officeContext: 'borrower' | 'broker' | 'workforce'): string {
  switch (officeContext) {
    case 'broker':
      return '/broker-office/application';
    case 'workforce':
      return '/workforce-office/application';
    default:
      return '/dashboard/application';
  }
}

export function getOfficeReturnPath(officeContext: 'borrower' | 'broker' | 'workforce'): string {
  switch (officeContext) {
    case 'broker':
      return '/broker-office';
    case 'workforce':
      return '/workforce-office';
    default:
      return '/dashboard';
  }
}
