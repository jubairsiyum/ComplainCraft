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
    
    const newComplaint = {
      issueTypes: complaintData.issueTypes || [],
      shopName: complaintData.shopName,
      dateOfOccurrence: complaintData.dateOfOccurrence,
      productName: complaintData.productName || '',
      amountPaid: complaintData.amountPaid || '',
      advertisedPrice: complaintData.advertisedPrice || '',
      expectedPrice: complaintData.expectedPrice || '',
      actualPrice: complaintData.actualPrice || '',
      billAmount: complaintData.billAmount || '',
      serviceType: complaintData.serviceType || '',
      warrantyPeriod: complaintData.warrantyPeriod || '',
      purchaseDate: complaintData.purchaseDate || '',
      refundAmount: complaintData.refundAmount || '',
      damageDescription: complaintData.damageDescription || '',
      delayDuration: complaintData.delayDuration || '',
      unauthorizedCharge: complaintData.unauthorizedCharge || '',
      details: complaintData.details,
      draftText: complaintData.draftText,
      images: Array.isArray(complaintData.images) ? complaintData.images : [],
      submittedAt: new Date(),
    };
    
    user.complaints.push(newComplaint);
    user.markModified('complaints');

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

    // Ensure all complaints have the images field
    const complaintsWithImages = (user.complaints || []).map((complaint: any) => ({
      ...complaint.toObject(),
      images: complaint.images || []
    }));

    return NextResponse.json({
      complaints: complaintsWithImages,
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaints' },
      { status: 500 }
    );
  }
}
