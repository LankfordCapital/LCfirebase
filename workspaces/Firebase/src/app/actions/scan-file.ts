
'use server';

import { z } from 'zod';

const FileScanResultSchema = z.object({
  verdict: z.string(),
  score: z.number(),
  summary: z.string(),
});

export type FileScanResult = z.infer<typeof FileScanResultSchema>;

export async function scanFile(formData: FormData): Promise<FileScanResult> {
  const token = process.env.PANGEA_API_TOKEN;

  if (!token) {
    throw new Error('Pangea API token is not configured.');
  }

  try {
    const response = await fetch('https://file-scan.pangea.cloud/v1/scan', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Pangea API Error: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    const parsedResult = FileScanResultSchema.safeParse(result.result);

    if(!parsedResult.success) {
        throw new Error(`Failed to parse Pangea API response: ${parsedResult.error.message}`)
    }

    return parsedResult.data;
  } catch (error) {
    console.error('Error scanning file with Pangea:', error);
    throw new Error('File scanning failed.');
  }
}
