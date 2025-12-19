import { Component, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssociationService } from '../../core/services/association.service';
import { Association } from '../../core/models/types';
import { cardReveal, fadeIn } from '../../shared/animations/animations';
import { ConfettiComponent } from '../../shared/components/confetti.component';
import { DialogService } from '../../shared/services/dialog.service';
import { DialogComponent } from '../../shared/components/dialog.component';

@Component({
  selector: 'app-draw',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ConfettiComponent, DialogComponent],
  animations: [cardReveal, fadeIn],
  template: `
    <app-dialog></app-dialog>
    <app-confetti></app-confetti>

    <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50" @fadeIn>
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <h1 class="text-2xl font-bold text-purple-600">🎲 Tirage au Sort</h1>
            <a routerLink="/dashboard" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
              ← Retour
            </a>
          </div>
        </div>
      </nav>

      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @if (!drawStarted()) {
          <div class="text-center py-12" @fadeIn>
            <div class="text-8xl mb-6">🎁</div>
            <h2 class="text-4xl font-bold text-gray-800 mb-4">Prêt pour le tirage au sort ?</h2>
            <p class="text-xl text-gray-600 mb-8">Cliquez sur le bouton pour associer les participants aux cadeaux</p>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Délai entre chaque révélation (ms)
              </label>
              <input
                [(ngModel)]="revealDelay"
                type="number"
                min="500"
                max="5000"
                step="100"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              (click)="startDraw()"
              [disabled]="loading()"
              class="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 disabled:opacity-50 shadow-2xl"
            >
              @if (loading()) {
                <span class="animate-spin mr-2">⏳</span> Tirage en cours...
              } @else {
                🎲 Lancer le tirage
              }
            </button>
          </div>
        } @else {
          <div class="space-y-6">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-800">
                Résultat du tirage ({{ currentIndex() + 1 }} / {{ totalAssociations() }})
              </h2>
            </div>

            @if (currentAssociation()) {
              <div class="max-w-2xl mx-auto" @cardReveal>
                <div class="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-2xl p-8 text-white transform">
                  <div class="text-center">
                    <div class="text-6xl mb-4">🎉</div>
                    <h3 class="text-3xl font-bold mb-2">{{ currentAssociation()!.participant }}</h3>
                    <div class="text-xl mb-4 opacity-90">reçoit</div>
                    <div class="bg-white/20 rounded-xl p-6 backdrop-blur-sm">
                      <div class="text-5xl mb-2">🎁</div>
                      <p class="text-2xl font-bold">{{ currentAssociation()!.gift }}</p>
                    </div>
                  </div>
                </div>
              </div>
            }

            @if (drawComplete()) {
              <div class="text-center mt-12" @fadeIn>
                <div class="text-6xl mb-4">✨</div>
                <h3 class="text-3xl font-bold text-gray-800 mb-4">Tirage terminé !</h3>
                <p class="text-xl text-gray-600 mb-8">Toutes les associations ont été révélées</p>

                <div class="flex gap-4 justify-center">
                  <button
                    (click)="resetDraw()"
                    class="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition transform hover:scale-105"
                  >
                    🔄 Nouveau tirage
                  </button>
                  <a
                    routerLink="/results"
                    class="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition transform hover:scale-105"
                  >
                    📊 Voir les résultats
                  </a>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class DrawComponent {
  @ViewChild(ConfettiComponent) confetti!: ConfettiComponent;

  loading = signal(false);
  drawStarted = signal(false);
  drawComplete = signal(false);
  currentIndex = signal(0);
  totalAssociations = signal(0);
  currentAssociation = signal<Association | null>(null);
  allAssociations: Association[] = [];
  revealDelay = 2000;

  constructor(
    private associationService: AssociationService,
    private dialogService: DialogService
  ) {}

  startDraw() {
    this.loading.set(true);

    this.associationService.performDraw().subscribe({
      next: (data) => {
        this.allAssociations = data.new_associations || [];
        this.totalAssociations.set(this.allAssociations.length);
        this.loading.set(false);
        this.drawStarted.set(true);
        this.revealNext();
      },
      error: async (error) => {
        this.loading.set(false);
        await this.dialogService.alert(
          'Erreur lors du tirage',
          error.error?.message || 'Assurez-vous d\'avoir ajouté des participants et des cadeaux.',
          'error'
        );
      }
    });
  }

  revealNext() {
    if (this.currentIndex() < this.allAssociations.length) {
      this.currentAssociation.set(this.allAssociations[this.currentIndex()]);

      setTimeout(() => {
        if (this.confetti) {
          this.confetti.launch();
        }
      }, 400);

      setTimeout(() => {
        this.currentIndex.set(this.currentIndex() + 1);

        if (this.currentIndex() < this.allAssociations.length) {
          this.revealNext();
        } else {
          this.drawComplete.set(true);
        }
      }, this.revealDelay);
    }
  }

  resetDraw() {
    this.drawStarted.set(false);
    this.drawComplete.set(false);
    this.currentIndex.set(0);
    this.currentAssociation.set(null);
    this.allAssociations = [];
  }
}
