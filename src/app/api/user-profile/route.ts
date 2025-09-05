import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export async function PUT(request: NextRequest) {
    try {
        const { uid, profileData } = await request.json();

        if (!uid || !profileData) {
            return NextResponse.json(
                { error: 'User ID and profile data are required' },
                { status: 400 }
            );
        }

        // Update the user profile in Firestore
        const userRef = adminDb.collection('users').doc(uid);
        await userRef.update({
            ...profileData,
            updatedAt: new Date().toISOString(),
        });

        // Also update Firebase Auth profile if displayName or photoURL changed
        if (profileData.fullName || profileData.photoURL) {
            await adminAuth.updateUser(uid, {
                displayName: profileData.fullName,
                photoURL: profileData.photoURL,
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const uid = searchParams.get('uid');

        if (!uid) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Get user profile from Firestore
        const userDoc = await adminDb.collection('users').doc(uid).get();
        
        if (!userDoc.exists) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const userData = userDoc.data();
        return NextResponse.json({
            success: true,
            profile: {
                uid: userDoc.id,
                ...userData,
                createdAt: userData?.createdAt?.toDate?.() || new Date(userData?.createdAt),
                updatedAt: userData?.updatedAt?.toDate?.() || new Date(userData?.updatedAt),
            }
        });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}
