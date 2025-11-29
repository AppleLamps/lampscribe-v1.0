import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth-utils';
import {
  uploadFile,
  generateStorageKey,
  getSignedDownloadUrl,
  isStorageConfigured,
  SUPPORTED_FORMATS,
  MAX_FILE_SIZE,
} from '@/lib/storage';

/**
 * POST /api/upload - Upload an audio/video file to R2 storage
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if storage is configured
    if (!isStorageConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Cloud storage is not configured' },
        { status: 503 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` 
        },
        { status: 400 }
      );
    }

    // Validate file type
    const contentType = file.type || 'application/octet-stream';
    if (!SUPPORTED_FORMATS.includes(contentType)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Unsupported file format. Supported: MP3, M4A, WAV, WEBM, OGG, FLAC, MP4, MOV, AVI' 
        },
        { status: 400 }
      );
    }

    // Generate storage key
    const storageKey = generateStorageKey(userId, file.name);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    const result = await uploadFile(buffer, storageKey, contentType);

    // Generate a signed URL for accessing the file
    const signedUrl = await getSignedDownloadUrl(storageKey);

    return NextResponse.json({
      success: true,
      data: {
        key: result.key,
        size: result.size,
        contentType,
        url: signedUrl,
        fileName: file.name,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/upload - Get a presigned upload URL for direct browser upload
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if storage is configured
    if (!isStorageConfigured()) {
      return NextResponse.json(
        { success: false, error: 'Cloud storage is not configured' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const contentType = searchParams.get('contentType');

    if (!fileName || !contentType) {
      return NextResponse.json(
        { success: false, error: 'fileName and contentType are required' },
        { status: 400 }
      );
    }

    // Validate content type
    if (!SUPPORTED_FORMATS.includes(contentType)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file format' },
        { status: 400 }
      );
    }

    // Generate storage key
    const storageKey = generateStorageKey(userId, fileName);

    // Import getSignedUploadUrl
    const { getSignedUploadUrl } = await import('@/lib/storage');
    const uploadUrl = await getSignedUploadUrl(storageKey, contentType);

    return NextResponse.json({
      success: true,
      data: {
        uploadUrl,
        key: storageKey,
      },
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}

