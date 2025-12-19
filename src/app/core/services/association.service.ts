import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Association, StatusResponse } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class AssociationService {
  private readonly API_URL = 'https://greatest.pythonanywhere.com';

  constructor(private http: HttpClient) {}

  getStatus(): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.API_URL}/status`);
  }

  performDraw(): Observable<{
    success: boolean;
    message: string;
    new_associations: Association[];
    total_associations: { [key: string]: number };
  }> {
    return this.http.post<{
      success: boolean;
      message: string;
      new_associations: Association[];
      total_associations: { [key: string]: number };
    }>(`${this.API_URL}/associate`, {});
  }

  getAssociations(): Observable<{
    success: boolean;
    total: number;
    associations: { [key: string]: number };
    associations_list: Association[];
  }> {
    return this.http.get<{
      success: boolean;
      total: number;
      associations: { [key: string]: number };
      associations_list: Association[];
    }>(`${this.API_URL}/associations`);
  }

  deleteAssociation(participant: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/associations/${participant}`);
  }

  exportCSV(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/export/csv`, {
      responseType: 'blob'
    });
  }

  exportPDF(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/export/pdf`, {
      responseType: 'blob'
    });
  }

  resetAll(): Observable<{
    success: boolean;
    message: string;
    previous_data: {
      names: number;
      numbers: number;
      associations: number;
    };
    timestamp: string;
  }> {
    return this.http.delete<{
      success: boolean;
      message: string;
      previous_data: {
        names: number;
        numbers: number;
        associations: number;
      };
      timestamp: string;
    }>(`${this.API_URL}/reset`);
  }

  resetAssociations(): Observable<{
    success: boolean;
    message: string;
    associations_deleted: number;
    timestamp: string;
  }> {
    return this.http.delete<{
      success: boolean;
      message: string;
      associations_deleted: number;
      timestamp: string;
    }>(`${this.API_URL}/reset/associations`);
  }
}
