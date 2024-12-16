import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `contracts/${fileName}`;

    // Upload the file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('pdfAttachments')
      .upload(filePath, file, {
        contentType: file.type,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Generate a signed URL for the uploaded file
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('pdfAttachments')
      .createSignedUrl(filePath, 36000); // URL valid for 10 hours

    if (signedUrlError || !signedUrlData?.signedUrl) {
      throw new Error(`Failed to generate signed URL: ${signedUrlError?.message}`);
    }

    return NextResponse.json({ signedUrl: signedUrlData.signedUrl });
  } catch (error: any) {
    console.error('Error in upload-file API route:', error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
