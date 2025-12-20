import { Component, ViewChild, signal, OnInit } from '@angular/core';
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

    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" @fadeIn>
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-20 items-center">
            <div class="flex items-center gap-4">
              <img src="assets/inphb.png" alt="INPHB" class="h-14 object-contain" />
              <div class="border-l-2 border-gray-300 h-12"></div>
              <div>
                <img src="assets/mutuel.png" alt="Mutuel" class="h-14 object-contain" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              <a routerLink="/dashboard" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                ← Retour
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @if (!drawStarted()) {
          <div class="text-center py-12" @fadeIn>
            <div class="text-8xl mb-6">🎁</div>
            <h2 class="text-4xl font-bold text-gray-800 mb-4">Prêt pour le Jeu de l'Invisible ?</h2>
            <p class="text-xl text-gray-600 mb-8">Cliquez sur le bouton pour former les binômes d'échange de cadeaux</p>

            <button
              (click)="startDraw()"
              [disabled]="loading()"
              class="px-12 py-4 bg-gradient-to-r from-green-600 to-red-600 text-white text-xl font-bold rounded-xl hover:from-green-700 hover:to-red-700 transition transform hover:scale-105 disabled:opacity-50 shadow-2xl"
            >
              @if (loading()) {
                <span class="animate-spin mr-2">⏳</span> Formation des binômes...
              } @else {
                🎄 Lancer le tirage
              }
            </button>
          </div>
        } @else {
          <div class="space-y-6">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-gray-800">
                🎅 Binôme {{ currentIndex() + 1 }} / {{ totalAssociations() }} 🎄
              </h2>
            </div>

            @if (currentAssociation() && !isTransitioning()) {
              <div class="max-w-2xl mx-auto" @cardReveal>
                <div class="bg-gradient-to-br from-green-600 to-red-600 rounded-2xl shadow-2xl p-8 text-white transform">
                  <div class="text-center">
                    <div class="text-5xl mb-4">🎅</div>
                    <h3 class="text-3xl font-bold mb-2">{{ currentAssociation()!.personne1 }}</h3>
                    <div class="text-xl mb-4 opacity-90 flex items-center justify-center gap-2">
                      <span>offre un cadeau à</span>
                    </div>
                    <div class="bg-white/20 rounded-xl p-6 backdrop-blur-sm">
                      <div class="text-5xl mb-2">🎁</div>
                      <p class="text-2xl font-bold">{{ currentAssociation()!.personne2 }}</p>
                    </div>
                  </div>
                </div>
              </div>
            }
            
            @if (isTransitioning()) {
              <div class="max-w-2xl mx-auto" @fadeIn>
                <div class="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-2xl p-12 text-white transform">
                  <div class="text-center">
                    <div class="text-8xl mb-4 animate-bounce">🎁</div>
                    <p class="text-2xl font-bold animate-pulse">Prochain binôme...</p>
                  </div>
                </div>
              </div>
            }

            <div class="flex gap-4 justify-center mt-8">
              <button
                (click)="previousCouple()"
                [disabled]="currentIndex() === 0 || isTransitioning()"
                class="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                ← Précédent
              </button>
              <button
                (click)="nextCouple()"
                [disabled]="currentIndex() >= totalAssociations() - 1 || isTransitioning()"
                class="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                Suivant →
              </button>
            </div>

            @if (currentIndex() >= totalAssociations() - 1) {
              <div class="text-center mt-8" @fadeIn>
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-3xl font-bold text-gray-800 mb-4">Tous les binômes ont été formés !</h3>
                <p class="text-xl text-gray-600 mb-8">Chacun sait à qui offrir son cadeau 🎁</p>

                <div class="flex gap-4 justify-center">
                  <button
                    (click)="resetDraw()"
                    class="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition transform hover:scale-105"
                  >
                    🔄 Nouveau tirage
                  </button>
                  <a
                    routerLink="/results"
                    class="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition transform hover:scale-105"
                  >
                    📊 Voir les binômes
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
export class DrawComponent implements OnInit {
  @ViewChild(ConfettiComponent) confetti!: ConfettiComponent;

  loading = signal(false);
  drawStarted = signal(false);
  currentIndex = signal(0);
  totalAssociations = signal(0);
  currentAssociation = signal<Association | null>(null);
  allAssociations: Association[] = [];
  isTransitioning = signal(false);

  constructor(
    private associationService: AssociationService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    // Vérifier s'il y a déjà des couples formés
    this.checkExistingAssociations();
  }

  checkExistingAssociations() {
    this.associationService.getStatus().subscribe({
      next: (response) => {
        const existingAssociations = response.status.associations.details;
        if (existingAssociations && existingAssociations.length > 0) {
          // Des couples existent déjà, les afficher
          this.allAssociations = existingAssociations;
          this.totalAssociations.set(this.allAssociations.length);
          this.drawStarted.set(true);
          this.showCurrentCouple();
        }
      },
      error: (error) => {
        console.error('Erreur lors de la vérification du statut:', error);
      }
    });
  }

  startDraw() {
    this.loading.set(true);

    this.associationService.performDraw().subscribe({
      next: (data) => {
        // Utiliser les nouvelles associations ou recharger depuis le status
        if (data.new_associations && data.new_associations.length > 0) {
          this.allAssociations = data.new_associations;
          this.totalAssociations.set(this.allAssociations.length);
          this.loading.set(false);
          this.drawStarted.set(true);
          this.showCurrentCouple();
        } else {
          // Recharger depuis le status pour obtenir toutes les associations
          this.checkExistingAssociations();
          this.loading.set(false);
        }
      },
      error: async (error) => {
        this.loading.set(false);
        await this.dialogService.alert(
          'Erreur lors du jeu',
          error.error?.message || 'Assurez-vous d\'avoir ajouté des hommes et des femmes.',
          'error'
        );
      }
    });
  }

  showCurrentCouple() {
    if (this.currentIndex() < this.allAssociations.length) {
      this.currentAssociation.set(this.allAssociations[this.currentIndex()]);

      setTimeout(() => {
        if (this.confetti) {
          this.confetti.launch();
        }
      }, 400);
    }
  }

  nextCouple() {
    if (this.currentIndex() < this.totalAssociations() - 1 && !this.isTransitioning()) {
      this.isTransitioning.set(true);
      this.currentAssociation.set(null);
      
      setTimeout(() => {
        this.currentIndex.set(this.currentIndex() + 1);
        setTimeout(() => {
          this.isTransitioning.set(false);
          this.showCurrentCouple();
        }, 300);
      }, 800);
    }
  }

  previousCouple() {
    if (this.currentIndex() > 0 && !this.isTransitioning()) {
      this.isTransitioning.set(true);
      this.currentAssociation.set(null);
      
      setTimeout(() => {
        this.currentIndex.set(this.currentIndex() - 1);
        setTimeout(() => {
          this.isTransitioning.set(false);
          this.showCurrentCouple();
        }, 300);
      }, 800);
    }
  }

  resetDraw() {
    this.drawStarted.set(false);
    this.currentIndex.set(0);
    this.currentAssociation.set(null);
    this.allAssociations = [];
  }
}
