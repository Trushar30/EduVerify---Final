import { supabase } from './supabaseClient';

export class FileStorageService {
  // ============================================
  // SUBMISSION FILE OPERATIONS
  // ============================================

  static async uploadSubmissionFile(
    assignmentId: string,
    studentId: string,
    file: File
  ): Promise<{ path: string; url: string } | null> {
    try {
      const timestamp = Date.now();
      const sanitizedFileName = this.sanitizeFileName(file.name);
      const filePath = `${assignmentId}/${studentId}/${timestamp}_${sanitizedFileName}`;

      const { data, error } = await supabase.storage
        .from('submissions')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading file:', error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('submissions')
        .getPublicUrl(filePath);

      return {
        path: data.path,
        url: urlData.publicUrl
      };
    } catch (error) {
      console.error('Error in uploadSubmissionFile:', error);
      return null;
    }
  }

  static async getSubmissionFileUrl(filePath: string): Promise<string | null> {
    try {
      const { data } = supabase.storage
        .from('submissions')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
  }

  static async downloadSubmissionFile(filePath: string): Promise<Blob | null> {
    try {
      const { data, error } = await supabase.storage
        .from('submissions')
        .download(filePath);

      if (error) {
        console.error('Error downloading file:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in downloadSubmissionFile:', error);
      return null;
    }
  }

  static async deleteSubmissionFile(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('submissions')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting file:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteSubmissionFile:', error);
      return false;
    }
  }

  // ============================================
  // AVATAR OPERATIONS
  // ============================================

  static async uploadAvatar(
    userId: string,
    file: File
  ): Promise<{ path: string; url: string } | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/profile.${fileExt}`;

      // Delete old avatar if exists
      await supabase.storage
        .from('avatars')
        .remove([filePath]);

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading avatar:', error);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return {
        path: data.path,
        url: urlData.publicUrl
      };
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      return null;
    }
  }

  static async getAvatarUrl(userId: string): Promise<string | null> {
    try {
      const { data: files, error } = await supabase.storage
        .from('avatars')
        .list(userId);

      if (error || !files || files.length === 0) {
        return null;
      }

      const avatarFile = files.find(f => f.name.startsWith('profile.'));
      if (!avatarFile) {
        return null;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`${userId}/${avatarFile.name}`);

      return data.publicUrl;
    } catch (error) {
      console.error('Error getting avatar URL:', error);
      return null;
    }
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  private static sanitizeFileName(fileName: string): string {
    return fileName
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 100);
  }

  static validateFile(file: File, type: 'submission' | 'avatar'): {
    valid: boolean;
    error?: string;
  } {
    const allowedTypes = {
      submission: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown'
      ],
      avatar: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    };

    const maxSizes = {
      submission: 10 * 1024 * 1024, // 10 MB
      avatar: 2 * 1024 * 1024 // 2 MB
    };

    if (!allowedTypes[type].includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes[type].join(', ')}`
      };
    }

    if (file.size > maxSizes[type]) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${maxSizes[type] / (1024 * 1024)}MB`
      };
    }

    return { valid: true };
  }

  // ============================================
  // LOCAL STORAGE (Temporary Processing)
  // ============================================

  static async saveToLocalTemp(file: File, category: 'submissions' | 'avatars'): Promise<string | null> {
    try {
      // For client-side apps, we'll use IndexedDB or just process directly
      // This is mainly for server-side processing if needed
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          const arrayBuffer = reader.result as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: file.type });
          const url = URL.createObjectURL(blob);
          resolve(url);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error('Error saving to local temp:', error);
      return null;
    }
  }

  static revokeLocalUrl(url: string): void {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error revoking URL:', error);
    }
  }
}

export default FileStorageService;
