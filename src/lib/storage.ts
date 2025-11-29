import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2 Configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'lampscribe-audio';

// R2 endpoint URL
const R2_ENDPOINT = R2_ACCOUNT_ID
  ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  : undefined;

// Check if R2 is configured
export const isStorageConfigured = () => {
  return !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);
};

// Initialize S3 client for R2
const getS3Client = () => {
  if (!isStorageConfigured()) {
    throw new Error('R2 storage is not configured. Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY environment variables.');
  }

  return new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
  });
};

// Supported audio/video formats
export const SUPPORTED_FORMATS = [
  'audio/mpeg',      // .mp3
  'audio/mp4',       // .m4a
  'audio/wav',       // .wav
  'audio/webm',      // .webm
  'audio/ogg',       // .ogg
  'audio/flac',      // .flac
  'video/mp4',       // .mp4
  'video/webm',      // .webm
  'video/quicktime', // .mov
  'video/x-msvideo', // .avi
];

// Max file size (500MB)
export const MAX_FILE_SIZE = 500 * 1024 * 1024;

/**
 * Generate a unique key for storing files
 */
export function generateStorageKey(userId: string, fileName: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = fileName.split('.').pop() || 'mp3';
  const safeFileName = fileName
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .substring(0, 50);
  
  return `${userId}/${timestamp}_${randomStr}_${safeFileName}.${extension}`;
}

/**
 * Upload a file to R2
 */
export async function uploadFile(
  file: Buffer | Uint8Array,
  key: string,
  contentType: string
): Promise<{ success: boolean; key: string; size: number }> {
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await client.send(command);

  return {
    success: true,
    key,
    size: file.length,
  };
}

/**
 * Get a signed URL for downloading/streaming a file
 * URLs are valid for 1 hour by default
 */
export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(client, command, { expiresIn });
}

/**
 * Get a signed URL for uploading a file directly from the browser
 * URLs are valid for 15 minutes
 */
export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 900
): Promise<string> {
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(client, command, { expiresIn });
}

/**
 * Delete a file from R2
 */
export async function deleteFile(key: string): Promise<boolean> {
  const client = getS3Client();

  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Check if a file exists in R2
 */
export async function fileExists(key: string): Promise<boolean> {
  const client = getS3Client();

  try {
    const command = new HeadObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    await client.send(command);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get file metadata
 */
export async function getFileMetadata(key: string): Promise<{
  size: number;
  contentType: string;
  lastModified: Date;
} | null> {
  const client = getS3Client();

  try {
    const command = new HeadObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const response = await client.send(command);
    
    return {
      size: response.ContentLength || 0,
      contentType: response.ContentType || 'application/octet-stream',
      lastModified: response.LastModified || new Date(),
    };
  } catch {
    return null;
  }
}

