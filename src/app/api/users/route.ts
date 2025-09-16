import { NextRequest, NextResponse } from 'next/server';
import { UserApiService } from '@/lib/api-services';
import { requireAuth, requireRole, getAuthenticatedUser } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    // Require admin role
    const roleError = await requireRole(request, ['admin']);
    if (roleError) return roleError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '1000'); // Get all users for admin purposes
    const role = searchParams.get('role') as any;
    const status = searchParams.get('status') as any;
    const search = searchParams.get('search') || undefined;

    const result = await UserApiService.getAllUsers(page, limit, search, role, status);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in users API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    // Require admin role
    const roleError = await requireRole(request, ['admin']);
    if (roleError) return roleError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'updateRole':
        if (!data.uid || !data.newRole) {
          return NextResponse.json(
            { error: 'Missing required fields: uid and newRole' },
            { status: 400 }
          );
        }
        
        const roleResult = await UserApiService.updateUserRole(data.uid, data.newRole);
        if (!roleResult.success) {
          return NextResponse.json(
            { error: roleResult.error },
            { status: 400 }
          );
        }
        
        return NextResponse.json(roleResult);

      case 'updateStatus':
        if (!data.uid || !data.newStatus) {
          return NextResponse.json(
            { error: 'Missing required fields: uid and newStatus' },
            { status: 400 }
          );
        }
        
        const statusResult = await UserApiService.updateUserStatus(data.uid, data.newStatus);
        if (!statusResult.success) {
          return NextResponse.json(
            { error: statusResult.error },
            { status: 400 }
          );
        }
        
        return NextResponse.json(statusResult);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in users POST API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
