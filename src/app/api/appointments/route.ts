import { NextRequest, NextResponse } from 'next/server';
import { AppointmentApiService } from '@/lib/api-services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') as any;
    const type = searchParams.get('type') as any;
    const userId = searchParams.get('userId') || undefined;
    const workforceMemberId = searchParams.get('workforceMemberId') || undefined;
    const date = searchParams.get('date') ? new Date(searchParams.get('date')!) : undefined;

    const result = await AppointmentApiService.getAllAppointments(page, limit, {
      status,
      type,
      userId,
      workforceMemberId,
      date
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in appointments API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create':
        if (!data.userId || !data.workforceMemberId || !data.date || !data.duration || !data.type) {
          return NextResponse.json(
            { error: 'Missing required fields: userId, workforceMemberId, date, duration, and type' },
            { status: 400 }
          );
        }
        
        // Convert date string to Date object
        const appointmentData = {
          ...data,
          date: new Date(data.date)
        };
        
        const createResult = await AppointmentApiService.createAppointment(appointmentData);
        if (!createResult.success) {
          return NextResponse.json(
            { error: createResult.error },
            { status: 400 }
          );
        }
        
        return NextResponse.json(createResult);

      case 'getAvailableSlots':
        if (!data.workforceMemberId || !data.date) {
          return NextResponse.json(
            { error: 'Missing required fields: workforceMemberId and date' },
            { status: 400 }
          );
        }
        
        const slotsResult = await AppointmentApiService.getAvailableSlots(
          data.workforceMemberId, 
          new Date(data.date)
        );
        if (!slotsResult.success) {
          return NextResponse.json(
            { error: slotsResult.error },
            { status: 400 }
          );
        }
        
        return NextResponse.json(slotsResult);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in appointments POST API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
