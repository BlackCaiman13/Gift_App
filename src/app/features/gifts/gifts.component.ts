import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GiftService } from '../../core/services/gift.service';
import { fadeIn, scaleIn } from '../../shared/animations/animations';
import { DialogService } from '../../shared/services/dialog.service';
import { DialogComponent } from '../../shared/components/dialog.component';

@Component({
  selector: 'app-gifts',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DialogComponent],
  animations: [fadeIn, scaleIn],
  template: `
    <app-dialog></app-dialog>

    <div class="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50" @fadeIn>
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <h1 class="text-2xl font-bold text-purple-600">🎁 Cadeaux</h1>
            <a routerLink="/dashboard" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
              ← Retour
            </a>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-xl shadow-lg p-6" @scaleIn>
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Ajouter un cadeau</h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom du cadeau</label>
                <div class="flex gap-2">
                  <input
                    [(ngModel)]="newGift"
                    (keyup.enter)="addGift()"
                    type="text"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Ex: PlayStation 5"
                  />
                  <button
                    (click)="addGift()"
                    [disabled]="!newGift.trim() || addingOne()"
                    class="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
                  >
                    @if (addingOne()) {
                      <span class="animate-spin">⏳</span>
                    } @else {
                      Ajouter
                    }
                  </button>
                </div>
              </div>

              <div class="border-t pt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Ajout en masse (un nom par ligne)</label>
                <textarea
                  [(ngModel)]="bulkGifts"
                  rows="5"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="PlayStation 5&#10;Nintendo Switch&#10;Airpods Pro"
                ></textarea>
                <button
                  (click)="addGiftsBulk()"
                  [disabled]="!bulkGifts.trim() || addingBulk()"
                  class="mt-2 w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  @if (addingBulk()) {
                    <span class="animate-spin mr-2">⏳</span> Ajout en cours...
                  } @else {
                    Ajouter en masse
                  }
                </button>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6" @scaleIn>
            <h2 class="text-2xl font-bold text-gray-800 mb-6">
              Liste des cadeaux ({{ gifts().length }})
            </h2>

            @if (loading()) {
              <div class="text-center py-8">
                <div class="inline-block animate-spin text-4xl">⏳</div>
                <p class="mt-2 text-gray-600">Chargement...</p>
              </div>
            } @else if (gifts().length === 0) {
              <div class="text-center py-8 text-gray-500">
                <p class="text-4xl mb-2">📭</p>
                <p>Aucun cadeau pour le moment</p>
              </div>
            } @else {
              <div class="space-y-2 max-h-96 overflow-y-auto">
                @for (gift of gifts(); track gift) {
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span class="font-medium text-gray-800">{{ gift }}</span>
                    <button
                      (click)="deleteGift(gift)"
                      class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class GiftsComponent implements OnInit {
  gifts = signal<number[]>([]);
  loading = signal(true);
  addingOne = signal(false);
  addingBulk = signal(false);
  newGift = '';
  bulkGifts = '';

  constructor(
    private giftService: GiftService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.loadGifts();
  }

  loadGifts() {
    this.loading.set(true);
    this.giftService.getGifts().subscribe({
      next: (data) => {
        this.gifts.set(data.gifts || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  async addGift() {
    if (!this.newGift.trim()) return;

    const giftNumber = parseInt(this.newGift.trim(), 10);
    if (isNaN(giftNumber)) {
      await this.dialogService.alert(
        'Nombre invalide',
        'Veuillez entrer un nombre valide pour le cadeau.',
        'warning'
      );
      return;
    }

    this.addingOne.set(true);
    this.giftService.addGift(giftNumber).subscribe({
      next: () => {
        this.newGift = '';
        this.loadGifts();
        this.addingOne.set(false);
      },
      error: () => this.addingOne.set(false)
    });
  }

  addGiftsBulk() {
    const numbers = this.bulkGifts
      .split('\n')
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n));

    if (numbers.length === 0) return;

    this.addingBulk.set(true);
    this.giftService.addGiftsBulk(numbers).subscribe({
      next: () => {
        this.bulkGifts = '';
        this.loadGifts();
        this.addingBulk.set(false);
      },
      error: () => this.addingBulk.set(false)
    });
  }

  async deleteGift(gift: number) {
    const confirmed = await this.dialogService.confirm({
      title: 'Confirmer la suppression',
      message: `Voulez-vous vraiment supprimer le cadeau n°${gift} ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'warning'
    });

    if (!confirmed) return;

    this.giftService.deleteGift(gift).subscribe({
      next: () => this.loadGifts()
    });
  }
}
