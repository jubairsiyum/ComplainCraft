import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const image = formData.get('image') as string;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

    if (!IMGBB_API_KEY) {
      return NextResponse.json(
        { error: 'ImgBB API key not configured' },
        { status: 500 }
      );
    }

    // Upload to ImgBB
    const imgbbFormData = new FormData();
    imgbbFormData.append('image', image.split(',')[1]); // Remove data:image/...;base64, prefix

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: 'POST',
        body: imgbbFormData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image to ImgBB');
    }

    const data = await response.json();

    return NextResponse.json(
      {
        message: 'Image uploaded successfully',
        url: data.data.url,
        deleteUrl: data.data.delete_url,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload image error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
