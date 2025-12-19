import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private readonly API_URL = 'https://greatest.pythonanywhere.com';

  constructor(private http: HttpClient) {}

  getParticipants(): Observable<{ success: boolean; total: number; participants: string[] }> {
    return this.http.get<{ success: boolean; total: number; participants: string[] }>(`${this.API_URL}/participants`);
  }

  addParticipant(participant: string): Observable<{ success: boolean; message: string; participant: string }> {
    return this.http.post<{ success: boolean; message: string; participant: string }>(`${this.API_URL}/participants`, { participant });
  }

  addParticipantsBulk(participants: string[]): Observable<{ success: boolean; message: string; added: string[]; ignored: string[] }> {
    return this.http.post<{ success: boolean; message: string; added: string[]; ignored: string[] }>(`${this.API_URL}/participants/bulk`, { participants });
  }

  deleteParticipant(participant: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/participants/${participant}`);
  }
}
