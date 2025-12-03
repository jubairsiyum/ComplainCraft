import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/models/User"

export async function GET() {
  try {
    await connectDB()

    // Aggregate to get unique shop names from all complaints across all users
    const shopNames = await User.aggregate([
      // Unwind the complaints array
      { $unwind: "$complaints" },
      // Group by shopName and get the first occurrence details
      {
        $group: {
          _id: "$complaints.shopName",
          count: { $sum: 1 },
          lastComplaint: { $max: "$complaints.submittedAt" }
        }
      },
      // Sort by count (most complained) and then by last complaint date
      { $sort: { count: -1, lastComplaint: -1 } },
      // Project only the shop name and count
      {
        $project: {
          _id: 0,
          shopName: "$_id",
          complaintCount: "$count"
        }
      },
      // Limit to top 100 shops to avoid overwhelming the dropdown
      { $limit: 100 }
    ])

    return NextResponse.json({
      success: true,
      data: shopNames
    })
  } catch (error) {
    console.error("Error fetching shop names:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch shop names" },
      { status: 500 }
    )
  }
}
