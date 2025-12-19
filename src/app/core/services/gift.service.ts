import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GiftService {
  private readonly API_URL = 'https://greatest.pythonanywhere.com';

  constructor(private http: HttpClient) {}

  getGifts(): Observable<{ success: boolean; total: number; gifts: number[] }> {
    return this.http.get<{ success: boolean; total: number; gifts: number[] }>(`${this.API_URL}/gifts`);
  }

  addGift(gift: number): Observable<{ success: boolean; message: string; gift: number }> {
    return this.http.post<{ success: boolean; message: string; gift: number }>(`${this.API_URL}/gifts`, { gift });
  }

  addGiftsBulk(gifts: number[]): Observable<{ success: boolean; message: string; added: number[]; ignored: number[] }> {
    return this.http.post<{ success: boolean; message: string; added: number[]; ignored: number[] }>(`${this.API_URL}/gifts/bulk`, { gifts });
  }

  deleteGift(gift: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/gifts/${gift}`);
  }
}
