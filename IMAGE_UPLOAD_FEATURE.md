# Image Upload Feature Documentation

## Overview
Users can now upload evidence images (one or more) when filing complaints. Images are uploaded to ImgBB, stored as URLs in the database, and displayed in previews and PDF documents.

## Features

### 1. **Multiple Image Upload**
- Upload one or more images as evidence
- Supports drag-and-drop functionality
- Manual file selection via browse button
- Real-time upload progress indicators

### 2. **Drag and Drop**
- Visual feedback when dragging files over the upload area
- Highlighted border and background color change
- Supports dropping multiple files at once

### 3. **File Validation**
- **File Type**: Only image files (JPG, PNG, GIF, etc.)
- **File Size**: Maximum 5MB per image
- **Error Handling**: User-friendly error messages for invalid files

### 4. **Image Management**
- **Preview Grid**: Uploaded images displayed in a responsive grid (2-4 columns)
- **Remove Option**: Delete button appears on hover over each image
- **Upload Count**: Shows total number of uploaded images

### 5. **ImgBB Integration**
- Images uploaded to ImgBB cloud storage
- Permanent URLs returned and stored in database
- No local storage required
- CORS-enabled for PDF embedding

## Implementation Details

### Components Created

#### **ImageUpload Component** (`src/components/ImageUpload.tsx`)
```typescript
Props:
- images: string[]           // Array of image URLs
- onImagesChange: (images: string[]) => void  // Callback when images change
- disabled?: boolean         // Disable upload during form submission
```

**Features:**
- Drag-and-drop zone with visual feedback
- File input with multiple file support
- Upload progress spinner
- Image preview grid with delete buttons
- File validation (type and size)
- Responsive design (2-4 column grid)

### API Endpoint

#### **POST /api/upload-image**
Uploads image to ImgBB and returns URL.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with "image" file

**Response:**
```json
{
  "success": true,
  "url": "https://i.ibb.co/abc123/image.jpg",
  "deleteUrl": "https://ibb.co/abc123/delete-token"
}
```

**Error Responses:**
- 400: No image provided
- 500: ImgBB API key not configured or upload failed

### Database Schema Updates

#### **ComplaintData Interface**
```typescript
interface ComplaintData {
  // ... existing fields
  images: string[]  // Array of ImgBB URLs
}
```

#### **IComplaint Interface** (MongoDB)
```typescript
interface IComplaint {
  // ... existing fields
  images?: string[]  // Optional array of image URLs
}
```

#### **User Model Schema**
```typescript
complaints: [{
  // ... existing fields
  images: [String]  // Array of image URL strings
}]
```

### PDF Generation

Images are automatically included in generated PDFs:

**Features:**
- Images displayed in 2-column grid
- Maximum height: 200px per image
- Border and rounded corners
- Caption showing "প্রমাণ 1", "প্রমাণ 2", etc.
- CORS-enabled for cross-origin image loading
- Attachment count updated to show number of images

**HTML Structure in PDF:**
```html
<div class="section">
  <p><strong>প্রমাণ চিত্র:</strong></p>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr);">
    <!-- Images rendered here -->
  </div>
</div>
```

### Preview Display

Complaints preview shows images in an organized grid:

**Features:**
- Clickable thumbnails open full image in new tab
- Hover effect with ring border
- Responsive 2-3 column grid
- Shows image count
- Images section only appears if images exist

## User Experience

### Upload Flow

1. **Select Files**
   - Drag files onto upload area OR
   - Click to browse and select files

2. **Validation**
   - System checks file type (must be image)
   - System checks file size (max 5MB)
   - Invalid files show error alert

3. **Upload**
   - Loading spinner appears
   - Files uploaded to ImgBB one by one
   - Progress indicator shows "Uploading images..."

4. **Preview**
   - Successfully uploaded images appear in grid
   - Delete button (X) appears on hover
   - Upload count updates

5. **Submit**
   - Image URLs saved with complaint in database
   - Images appear in complaint preview
   - Images embedded in PDF document

### Preview Flow

1. **My Complaints Page**
   - Click "Preview" button on any complaint
   - Modal opens showing complaint text
   - Below text, "Evidence Images" section shows thumbnails
   - Click any thumbnail to view full image in new tab

2. **PDF Download**
   - Click "Download PDF" button
   - PDF generates with images embedded
   - Images appear in 2-column grid
   - Each image labeled as "প্রমাণ 1", "প্রমাণ 2", etc.

## Configuration

### Environment Variables

Add to `.env.local`:
```env
IMGBB_API_KEY=your_imgbb_api_key_here
```

### Getting ImgBB API Key

1. Go to [ImgBB API](https://api.imgbb.com/)
2. Sign up or log in
3. Navigate to "Get API Key"
4. Copy your API key
5. Add to `.env.local`

## Technical Considerations

### Image Hosting
- **ImgBB**: Free tier allows 32MB storage per image
- Permanent URLs (no expiration)
- Fast CDN delivery
- Automatic CORS headers for PDF embedding

### Performance
- **Async Upload**: Images uploaded sequentially to avoid overwhelming server
- **Client-side Validation**: Reduces unnecessary API calls
- **Base64 Conversion**: Done server-side for security
- **Lazy Loading**: Images load as needed in preview

### Security
- **File Type Validation**: Both client and server-side
- **Size Limits**: Prevents abuse (5MB per image)
- **API Key**: Server-side only, never exposed to client
- **Sanitization**: File names and data sanitized before upload

### Accessibility
- **Alt Text**: All images have descriptive alt attributes
- **Keyboard Navigation**: Upload area focusable and activatable
- **Screen Reader**: Labels and descriptions provided
- **Visual Feedback**: Clear indicators for drag state

## Limitations

1. **Max File Size**: 5MB per image (configurable)
2. **File Types**: Images only (no PDFs or documents)
3. **ImgBB Limits**: Free tier restrictions apply
4. **PDF Size**: Many large images may increase PDF generation time
5. **No Editing**: Uploaded images cannot be edited, only removed

## Future Enhancements

- [ ] Image compression before upload
- [ ] Crop/rotate functionality
- [ ] Drag to reorder images
- [ ] Bulk delete option
- [ ] Image captions/descriptions
- [ ] Alternative cloud storage options (S3, Cloudinary)
- [ ] Image optimization for PDFs
- [ ] OCR text extraction from images
- [ ] Thumbnail generation
- [ ] Progress bar for multiple uploads

## Troubleshooting

### Images Not Uploading
- **Check API Key**: Ensure `IMGBB_API_KEY` is set in `.env.local`
- **File Size**: Ensure images are under 5MB
- **File Type**: Ensure files are valid image formats
- **Network**: Check internet connection

### Images Not Showing in PDF
- **CORS**: ImgBB handles CORS automatically
- **URL Valid**: Ensure URLs are accessible
- **Wait for Load**: PDF generation waits for images to load
- **Check Console**: Look for error messages

### Preview Not Working
- **Clear Cache**: Try hard refresh (Ctrl+Shift+R)
- **Check URLs**: Ensure image URLs in database are valid
- **Browser Console**: Check for JavaScript errors

## Code Examples

### Using ImageUpload Component
```tsx
import { ImageUpload } from "@/components/ImageUpload"

function MyForm() {
  const [images, setImages] = useState<string[]>([])
  
  return (
    <ImageUpload
      images={images}
      onImagesChange={setImages}
      disabled={loading}
    />
  )
}
```

### Accessing Images in API
```typescript
// In API route
const { images } = await request.json()
// images is string[] of ImgBB URLs

// Save to database
user.complaints.push({
  // ... other fields
  images: images
})
```

### Displaying Images
```tsx
{complaint.images && complaint.images.length > 0 && (
  <div className="grid grid-cols-2 gap-3">
    {complaint.images.map((url, idx) => (
      <img key={idx} src={url} alt={`Evidence ${idx + 1}`} />
    ))}
  </div>
)}
```
