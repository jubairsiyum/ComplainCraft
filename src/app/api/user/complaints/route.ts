import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// POST - Save a new complaint
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const complaintData = await req.json();

    await connectDB();
    
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Add complaint to user's complaints array
    if (!user.complaints) {
      user.complaints = [];
    }
    
    user.complaints.push({
      ...complaintData,
      submittedAt: new Date(),
    });

    await user.save();

    return NextResponse.json({
      message: 'Complaint saved successfully',
      complaint: user.complaints[user.complaints.length - 1],
    });
  } catch (error) {
    console.error('Error saving complaint:', error);
    return NextResponse.json(
      { error: 'Failed to save complaint' },
      { status: 500 }
    );
  }
}

// GET - Retrieve all complaints for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const user = await User.findById(session.user.id).select('complaints');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      complaints: user.complaints || [],
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}
