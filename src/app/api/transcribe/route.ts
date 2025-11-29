import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import prisma from '@/lib/prisma';
import { TranscriptionMode as PrismaMode } from '@prisma/client';
import { getCurrentUserId } from '@/lib/auth-utils';
import {
  uploadFile,
  generateStorageKey,
  isStorageConfigured,
} from '@/lib/storage';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Transcription models mapping
const TRANSCRIPTION_MODELS = {
  cheetah: 'gpt-4o-mini-transcribe',  // Fastest
  dolphin: 'gpt-4o-transcribe',        // Balanced
  whale: 'gpt-4o-transcribe',          // Most accurate (with diarization)
} as const;

type TranscriptionMode = keyof typeof TRANSCRIPTION_MODELS;

// Map frontend mode to Prisma enum
const MODE_TO_PRISMA: Record<TranscriptionMode, PrismaMode> = {
  cheetah: 'CHEETAH',
  dolphin: 'DOLPHIN',
  whale: 'WHALE',
};

// Max file size (25MB for OpenAI API)
const MAX_FILE_SIZE = 25 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Get authenticated user
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in to transcribe.' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const mode = (formData.get('mode') as TranscriptionMode) || 'dolphin';
    const language = formData.get('language') as string | null;
    const translate = formData.get('translate') === 'true';
    const folderId = formData.get('folderId') as string | null;
    const duration = parseInt(formData.get('duration') as string) || undefined;
    const saveAudio = formData.get('saveAudio') === 'true';

    // Validate file presence
    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds limit of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Get file info
    const fileType = file.type || 'audio/mpeg';
    console.log(`Processing file: ${file.name}, type: ${fileType}, size: ${file.size}`);

    // Get the model based on mode
    const model = TRANSCRIPTION_MODELS[mode] || TRANSCRIPTION_MODELS.dolphin;

    let result;

    if (translate) {
      // Use translation endpoint - always outputs English
      const translation = await openai.audio.translations.create({
        file: file,
        model: model,
        response_format: 'text',
      });

      result = {
        text: translation as unknown as string,
        language: 'en',
      };
    } else {
      // Standard transcription
      const transcription = await openai.audio.transcriptions.create({
        file: file,
        model: model,
        language: language || undefined,
        response_format: 'text',
      });

      const text = transcription as unknown as string;

      result = {
        text: text,
        language: language || 'auto',
      };
    }

    // Optionally save audio file to R2
    let audioUrl: string | null = null;
    
    if (saveAudio && isStorageConfigured()) {
      try {
        const storageKey = generateStorageKey(userId, file.name);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        await uploadFile(buffer, storageKey, fileType);
        audioUrl = storageKey; // Store the key, we'll generate signed URLs on demand
        
        console.log(`Audio saved to R2: ${storageKey}`);
      } catch (uploadError) {
        console.error('Failed to save audio file:', uploadError);
        // Don't fail the transcription if audio save fails
      }
    }

    // Save transcription to database
    const transcript = await prisma.transcript.create({
      data: {
        name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension for display name
        originalName: file.name,
        text: result.text,
        language: result.language,
        duration: duration,
        mode: MODE_TO_PRISMA[mode],
        fileSize: file.size,
        fileType: fileType,
        audioUrl: audioUrl,
        status: 'COMPLETED',
        completedAt: new Date(),
        userId: userId,
        folderId: folderId || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        id: transcript.id,
        name: transcript.name,
        createdAt: transcript.createdAt,
        hasAudio: !!audioUrl,
      },
    });
  } catch (error) {
    console.error('Transcription error:', error);
    
    // Handle OpenAI specific errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code,
          type: error.type,
        },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}

// Disable body parsing - we handle form data manually
export const config = {
  api: {
    bodyParser: false,
  },
};
