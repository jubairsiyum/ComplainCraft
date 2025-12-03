import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"
import { authOptions } from "@/lib/auth"

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const { id: complaintId } = await params

    // Find user and remove the complaint
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Remove the complaint from the array
    if (!user.complaints) {
      return NextResponse.json(
        { success: false, error: "No complaints found" },
        { status: 404 }
      )
    }

    const initialLength = user.complaints.length
    user.complaints = user.complaints.filter(
      (complaint: any) => complaint._id.toString() !== complaintId
    )

    if (user.complaints.length === initialLength) {
      return NextResponse.json(
        { success: false, error: "Complaint not found" },
        { status: 404 }
      )
    }

    await user.save()

    return NextResponse.json({
      success: true,
      message: "Complaint deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting complaint:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete complaint" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    await connectDB()

    const { id: complaintId } = await params
    const updatedData = await request.json()

    // Find user and update the complaint
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    if (!user.complaints) {
      return NextResponse.json(
        { success: false, error: "No complaints found" },
        { status: 404 }
      )
    }

    // Find the complaint in the array
    const complaintIndex = user.complaints.findIndex(
      (complaint: any) => complaint._id.toString() === complaintId
    )

    if (complaintIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Complaint not found" },
        { status: 404 }
      )
    }

    // Update the complaint with the new data
    if (user.complaints) {
      const existingComplaint = user.complaints[complaintIndex] as any
      user.complaints[complaintIndex] = {
        ...existingComplaint,
        ...updatedData,
        images: updatedData.images || existingComplaint.images || [],
        _id: existingComplaint._id, // Preserve the original _id
      }
      
      // Mark the complaints array as modified so Mongoose knows to save it
      user.markModified('complaints');
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Complaint updated successfully",
      complaint: user.complaints[complaintIndex]
    })
  } catch (error) {
    console.error("Error updating complaint:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update complaint" },
      { status: 500 }
    )
  }
}
