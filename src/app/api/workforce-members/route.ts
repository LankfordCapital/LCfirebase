import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Get all workforce members and admins from the users collection
    const workforceSnapshot = await adminDb
      .collection('users')
      .where('role', 'in', ['workforce', 'admin'])
      .where('status', '==', 'approved')
      .get();

    const workforceMembers = workforceSnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Get profile photo from various possible locations
      let profilePhoto = null;
      if (data.personalInfo?.profilePhotoUrl) {
        profilePhoto = data.personalInfo.profilePhotoUrl;
      } else if (data.photoURL) {
        profilePhoto = data.photoURL;
      }
      
      return {
        uid: doc.id,
        name: data.fullName || 'Unknown',
        title: data.position || 'Team Member',
        email: data.email || '',
        phone: data.phone || '',
        role: data.role,
        company: data.company || '',
        avatar: profilePhoto || `https://i.pravatar.cc/40?u=${doc.id}`,
      };
    });

    return NextResponse.json({ 
      success: true, 
      workforceMembers 
    });
  } catch (error) {
    console.error('Error fetching workforce members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workforce members' },
      { status: 500 }
    );
  }
}
