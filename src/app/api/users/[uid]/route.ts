import { NextRequest, NextResponse } from 'next/server';
import { UserApiService } from '@/lib/api-services';

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    const { uid } = params;
    
    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const result = await UserApiService.getUserById(uid);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in user by ID API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
