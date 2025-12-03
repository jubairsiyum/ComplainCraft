import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 }
      )
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")

    // Upload to ImgBB
    const imgbbApiKey = process.env.IMGBB_API_KEY
    if (!imgbbApiKey) {
      return NextResponse.json(
        { success: false, error: "ImgBB API key not configured" },
        { status: 500 }
      )
    }

    const imgbbFormData = new FormData()
    imgbbFormData.append("image", base64Image)

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      {
        method: "POST",
        body: imgbbFormData,
      }
    )

    const data = await response.json()

    if (data.success) {
      return NextResponse.json({
        success: true,
        url: data.data.url,
        deleteUrl: data.data.delete_url,
      })
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to upload to ImgBB" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
