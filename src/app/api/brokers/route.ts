import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Get all brokers from the users collection where role is 'broker'
    const brokersSnapshot = await adminDb
      .collection('users')
      .where('role', '==', 'broker')
      .get();

    const brokers = brokersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // For each broker, calculate their active loans and total volume
    const brokersWithStats = await Promise.all(
      brokers.map(async (broker) => {
        try {
          // Get active loan applications for this broker
          const loansSnapshot = await adminDb
            .collection('enhancedLoanApplications')
            .where('brokerId', '==', broker.id)
            .get();

          const activeLoans = loansSnapshot.docs.filter(doc => {
            const data = doc.data();
            return data.status !== 'Cancelled' && data.status !== 'Completed';
          }).length;

          const totalVolume = loansSnapshot.docs
            .filter(doc => {
              const data = doc.data();
              return data.status === 'Funded' || data.status === 'Approved';
            })
            .reduce((sum, doc) => {
              const data = doc.data();
              return sum + (data.loanAmount || 0);
            }, 0);

          return {
            ...broker,
            activeLoans,
            totalVolume,
            status: 'Active'
          };
        } catch (error) {
          console.error(`Error calculating stats for broker ${broker.id}:`, error);
          return {
            ...broker,
            activeLoans: 0,
            totalVolume: 0,
            status: 'Active'
          };
        }
      })
    );

    return NextResponse.json({ 
      success: true, 
      brokers: brokersWithStats 
    });
  } catch (error) {
    console.error('Error fetching brokers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brokers' },
      { status: 500 }
    );
  }
}
