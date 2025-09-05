'use client';

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase-client';

export interface PhotoUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class PhotoUploadService {
  static async uploadProfilePhoto(
    file: File, 
    userId: string, 
    onProgress?: (progress: number) => void
  ): Promise<PhotoUploadResult> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'Please select an image file'
        };
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: 'File size must be less than 5MB'
        };
      }

      // Create storage reference
      const storageRef = ref(storage, `profile-photos/${userId}/${Date.now()}-${file.name}`);
      
      // Upload file
      const uploadTask = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      // Call progress callback if provided
      if (onProgress) {
        onProgress(100);
      }

      return {
        success: true,
        url: downloadURL
      };

    } catch (error) {
      console.error('Error uploading photo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  static async deleteProfilePhoto(photoURL: string): Promise<boolean> {
    try {
      // Extract the path from the URL
      const url = new URL(photoURL);
      const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
      
      if (!pathMatch) {
        throw new Error('Invalid photo URL');
      }

      const photoPath = decodeURIComponent(pathMatch[1]);
      const photoRef = ref(storage, photoPath);
      
      await deleteObject(photoRef);
      return true;

    } catch (error) {
      console.error('Error deleting photo:', error);
      return false;
    }
  }

  static validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return {
        valid: false,
        error: 'Please select an image file (JPG, PNG, GIF, etc.)'
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size must be less than 5MB'
      };
    }

    // Check dimensions (optional - can be added later)
    return { valid: true };
  }
}
