import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// POST - Migrate existing complaints to add images field
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    // Find the user
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user.complaints || user.complaints.length === 0) {
      return NextResponse.json({
        message: 'No complaints to migrate',
        updated: 0,
      });
    }

    // Update each complaint to ensure it has the images field
    let updated = 0;
    user.complaints.forEach((complaint: any) => {
      if (!complaint.images) {
        complaint.images = [];
        updated++;
      }
    });

    if (updated > 0) {
      user.markModified('complaints');
      await user.save();
    }

    return NextResponse.json({
      message: `Migration completed successfully`,
      updated,
      total: user.complaints.length,
    });
  } catch (error) {
    console.error('Error migrating complaints:', error);
    return NextResponse.json(
      { error: 'Failed to migrate complaints' },
      { status: 500 }
    );
  }
}
