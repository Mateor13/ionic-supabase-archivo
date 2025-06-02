import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient;

  constructor(private router: Router) {
    this.supabase = createClient(environment.supabase_url, environment.supabase_key);
  }

  async uploadFile(file: File): Promise<any> {
    const { data, error } = await this.supabase.storage.from('almacenamientoimage').upload(file.name, file);
    if (error) {
      throw error;
    }
    return data;
  }

  async getFileSignedUrl(fileName: string, expiresInSeconds = 60 * 60 * 24 * 30): Promise<string> {
    const { data, error } = await this.supabase
      .storage
      .from('almacenamientoimage')
      .createSignedUrl(fileName, expiresInSeconds);
    if (error) {
      throw error;
    }
    return data.signedUrl;
  }

  async getFileList(): Promise<any[]> {
    const { data, error } = await this.supabase.storage
      .from('almacenamientoimage')
      .list('', { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } });
    if (error) {
      throw error;
    }
    return (data || []).filter(item => item.name !== '.emptyFolderPlaceholder');
  }
}
