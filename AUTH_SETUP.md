# Authentication System Setup Guide

This project now includes a complete authentication system with NextAuth, MongoDB, and profile management with image upload.

## Prerequisites

1. **MongoDB Database**
   - Create a MongoDB database (MongoDB Atlas recommended)
   - Get your connection string

2. **ImgBB API Key**
   - Sign up at https://imgbb.com/
   - Go to https://api.imgbb.com/ to get your API key

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string_here

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# ImgBB API
IMGBB_API_KEY=your_imgbb_api_key_here
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32

### 3. MongoDB Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

Replace:
- `username` - Your MongoDB username
- `password` - Your MongoDB password
- `cluster` - Your cluster name
- `database_name` - Your database name

### 4. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Features Implemented

### Authentication
- ✅ User registration (signup)
- ✅ User login (signin)
- ✅ JWT-based sessions
- ✅ Protected routes
- ✅ Sign out functionality

### User Profile
- ✅ First Name & Last Name
- ✅ Email (read-only after registration)
- ✅ Phone Number
- ✅ NID Number
- ✅ Date of Birth
- ✅ Present Address (Street, City, District, Postal Code)
- ✅ Permanent Address (Street, City, District, Postal Code)
- ✅ Profile Picture Upload

### Profile Picture Upload
- ✅ Image selection from device
- ✅ Crop image in square frame (1:1 aspect ratio)
- ✅ Resize to 500x500 pixels
- ✅ Compress to under 500KB
- ✅ Upload to ImgBB
- ✅ Save URL to MongoDB

### UI Components
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Loading states
- ✅ Error handling
- ✅ Success messages
- ✅ User avatar in header
- ✅ Dropdown menu with profile/logout

## API Routes

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Sign in user (handled by NextAuth)
- `GET /api/auth/[...nextauth]` - NextAuth handler

### User Profile
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile` - Update user profile (protected)

### Image Upload
- `POST /api/upload` - Upload profile picture to ImgBB (protected)

## Pages

### Public Pages
- `/` - Home page with complaint form
- `/about` - About page
- `/guide` - Guide page
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page

### Protected Pages
- `/profile` - User profile management (requires authentication)

## Database Schema

### User Model
```typescript
{
  email: string (required, unique)
  password: string (required, hashed)
  firstName: string (required)
  lastName: string (required)
  nidNo?: string
  phoneNumber?: string
  dateOfBirth?: Date
  presentAddress?: {
    street?: string
    city?: string
    district?: string
    postalCode?: string
  }
  permanentAddress?: {
    street?: string
    city?: string
    district?: string
    postalCode?: string
  }
  profilePicture?: string (ImgBB URL)
  createdAt: Date
  updatedAt: Date
}
```

## Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens for session management
- ✅ Protected API routes with session validation
- ✅ Secure HTTP-only cookies
- ✅ CSRF protection (NextAuth built-in)

## Image Processing

The profile picture upload process:
1. User selects image file
2. Image displayed in crop modal with square crop area
3. User adjusts crop area
4. Image cropped to selected area
5. Resized to 500x500 pixels
6. Compressed to under 500KB using browser-image-compression
7. Converted to base64
8. Uploaded to ImgBB via API
9. ImgBB URL saved to user profile in MongoDB

## Troubleshooting

### MongoDB Connection Issues
- Ensure your IP address is whitelisted in MongoDB Atlas
- Check username and password are correct
- Verify database name exists

### NextAuth Issues
- Make sure NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Clear browser cookies if having session issues

### Image Upload Issues
- Verify ImgBB API key is correct
- Check image size is under 5MB before cropping
- Ensure browser supports FileReader API

## Dependencies Added

```json
{
  "dependencies": {
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "bcryptjs": "^2.4.3",
    "browser-image-compression": "^2.0.2",
    "mongoose": "^8.8.3",
    "next-auth": "^4.24.10",
    "react-image-crop": "^11.0.7",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6"
  }
}
```

## Next Steps

1. Add `.env` to your `.gitignore` (already done)
2. Never commit your `.env` file to version control
3. Set up environment variables in your production deployment
4. Consider adding email verification for new users
5. Consider adding password reset functionality
6. Consider adding two-factor authentication

## Production Deployment

When deploying to production:

1. Set all environment variables in your hosting platform
2. Update `NEXTAUTH_URL` to your production domain
3. Ensure MongoDB allows connections from your production server
4. Use strong NEXTAUTH_SECRET in production
5. Enable MongoDB connection string encryption

## Support

For issues or questions, refer to the official documentation:
- NextAuth.js: https://next-auth.js.org/
- MongoDB: https://www.mongodb.com/docs/
- ImgBB API: https://api.imgbb.com/
