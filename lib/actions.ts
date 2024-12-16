//import { supabase } from './supabase';

// export async function uploadFile(file: File) {
//   try {
//     const fileExt = file.name.split('.').pop();
//     const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
//     const filePath = `contracts/${fileName}`;

//     const { data, error } = await supabase.storage
//       .from('pdfAttachments')
//       .upload(filePath, file);

//     if (error) throw error;

//     const { data: urlData } = await supabase.storage
//       .from('pdfAttachments')
//       .createSignedUrl(filePath, 36000); 

//     if (!urlData?.signedUrl) throw new Error('Failed to get signed URL');

//     return urlData.signedUrl;
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     throw error;
//   }
// }

export async function uploadFile(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Send the file to the API route
    const res = await fetch('/api/upload-file', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || 'Failed to upload file');
    }

    const { signedUrl }: { signedUrl: string } = await res.json();
    return signedUrl;
  } catch (error: any) {
    console.error('Error uploading file:', error.message);
    throw error;
  }
}

export async function extractText(fileUrl: string) {
  try {
    const response = await fetch('/api/extract-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to extract text');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error extracting text:', error);
    throw error;
  }
}

export async function uploadTextAsPDF(text: string) {
    try {
      const response = await fetch('/api/upload-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
    
      return data.url;
    } catch (error) {
      console.error('Error extracting text:', error);
      throw error;
    }
  }
  
  export async function analyzeContract(fileUrl: string) {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileUrl }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
    
      return data.result;
    } catch (error) {
      console.error('Error extracting text:', error);
      throw error;
    }
  }
  


