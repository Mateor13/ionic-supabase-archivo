import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from 'src/app/services/supabase.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem } from '@ionic/angular/standalone';

@Component({
  selector: 'app-subir',
  templateUrl: './subir.page.html',
  styleUrls: ['./subir.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem]
})
export class SubirPage implements OnInit {
  file: File | null = null;
  nombreArchivo: string = '';
  respuesta: string = '';
  urlArchivo: string = '';
  archivos: any[] = [];

  constructor(private supabaseService: SupabaseService) { }

  ngOnInit() {
    this.listarArchivos();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.file = file;
      this.nombreArchivo = file.name;
      console.log('Archivo seleccionado:', file.name);
    }
  }

  async visualizarArchivo(fileName: string) {
    if (fileName) {
      try {
        const url = await this.supabaseService.getFileSignedUrl(fileName);
        window.open(url, '_blank');
      } catch (error) {
        this.respuesta = `Error al obtener la URL del archivo: ${typeof error === 'object' && error && 'message' in error ? (error as any).message : error}`;
      }
    } else {
      this.respuesta = 'Por favor, seleccione un archivo antes de visualizar.';
    }
  }

  async subirArchivo() {
    if (this.file) {
      try {
        const response = await this.supabaseService.uploadFile(this.file);
        this.respuesta = `Archivo subido exitosamente: ${response.path}`;
        this.urlArchivo = await this.supabaseService.getFileSignedUrl(response.path);
        this.file = null;
        this.nombreArchivo = '';
        await this.listarArchivos(); // Actualiza la tabla después de subir
      } catch (error) {
        this.respuesta = `Error al subir el archivo: ${typeof error === 'object' && error && 'message' in error ? (error as any).message : error}`;
      }
    } else {
      this.respuesta = 'Por favor, seleccione un archivo antes de subir.';
    }
  }

  async listarArchivos() {
    try {
      const archivos = await this.supabaseService.getFileList();
      this.archivos = archivos;
    } catch (error) {
      this.archivos = [];
      this.respuesta = `Error al obtener la lista de archivos: ${typeof error === 'object' && error && 'message' in error ? (error as any).message : error}`;
    }
  }
}