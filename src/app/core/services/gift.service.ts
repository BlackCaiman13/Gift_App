import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GiftService {
  private readonly API_URL = 'https://greatest.pythonanywhere.com';

  constructor(private http: HttpClient) {}

  getGifts(): Observable<{ success: boolean; total: number; gifts: string[] }> {
    return this.http.get<{ success: boolean; total: number; gifts: string[] }>(`${this.API_URL}/gifts`);
  }

  addGift(gift: string): Observable<{ success: boolean; message: string; gift: string }> {
    return this.http.post<{ success: boolean; message: string; gift: string }>(`${this.API_URL}/gifts`, { gift });
  }

  addGiftsBulk(gifts: string[]): Observable<{ success: boolean; message: string; added: string[]; ignored: string[] }> {
    return this.http.post<{ success: boolean; message: string; added: string[]; ignored: string[] }>(`${this.API_URL}/gifts/bulk`, { gifts });
  }

  deleteGift(gift: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/gifts/${gift}`);
  }
}
