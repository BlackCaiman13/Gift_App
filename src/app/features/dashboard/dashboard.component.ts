import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AssociationService } from '../../core/services/association.service';
import { AuthService } from '../../core/services/auth.service';
import { StatusResponse } from '../../core/models/types';
import { fadeIn, scaleIn } from '../../shared/animations/animations';
import { DialogService } from '../../shared/services/dialog.service';
import { DialogComponent } from '../../shared/components/dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DialogComponent],
  animations: [fadeIn, scaleIn],
  template: `
    <app-dialog></app-dialog>

    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" @fadeIn>
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <h1 class="text-2xl font-bold text-purple-600">🎁 Tirage au Sort</h1>
            <div class="flex gap-3">
              
              <button
                (click)="resetAll()"
                [disabled]="resetting()"
                class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center gap-2"
                title="Réinitialiser toutes les données"
              >
                @if (resetting()) {
                  <span class="animate-spin">⏳</span>
                } @else {
                  🔄
                }
                Reset tout
              </button>
              <button
                (click)="logout()"
                class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">Tableau de bord</h2>

        @if (loading()) {
          <div class="text-center py-12">
            <div class="inline-block animate-spin text-6xl">⏳</div>
            <p class="mt-4 text-gray-600">Chargement des données...</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition" @scaleIn>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm font-medium">Participants</p>
                  <p class="text-4xl font-bold text-blue-600 mt-2">{{ status()?.status?.participants?.total || 0 }}</p>
                </div>
                <div class="bg-blue-100 rounded-full p-4">
                  <span class="text-4xl">👥</span>
                </div>
              </div>
              <div class="mt-4 flex justify-between text-sm">
                <span class="text-green-600">✓ Associés: {{ status()?.status?.participants?.associated || 0 }}</span>
                <span class="text-orange-600">⊗ Restants: {{ status()?.status?.participants?.unassociated || 0 }}</span>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition" @scaleIn>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm font-medium">Cadeaux</p>
                  <p class="text-4xl font-bold text-pink-600 mt-2">{{ status()?.status?.gifts?.total || 0 }}</p>
                </div>
                <div class="bg-pink-100 rounded-full p-4">
                  <span class="text-4xl">🎁</span>
                </div>
              </div>
              <div class="mt-4 flex justify-between text-sm">
                <span class="text-green-600">✓ Associés: {{ status()?.status?.gifts?.associated || 0 }}</span>
                <span class="text-orange-600">⊗ Restants: {{ status()?.status?.gifts?.unassociated || 0 }}</span>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition" @scaleIn>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm font-medium">Associations</p>
                  <p class="text-4xl font-bold text-purple-600 mt-2">{{ status()?.status?.associations?.total || 0 }}</p>
                </div>
                <div class="bg-purple-100 rounded-full p-4">
                  <span class="text-4xl">🎉</span>
                </div>
              </div>
              <div class="mt-4 text-sm text-gray-600">
                Paires créées avec succès
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              routerLink="/participants"
              class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:from-blue-600 hover:to-blue-700 transition transform hover:scale-105 shadow-lg"
            >
              <div class="text-4xl mb-3">👥</div>
              <h3 class="text-xl font-bold">Participants</h3>
              <p class="text-sm opacity-90 mt-1">Gérer les participants</p>
            </a>

            <a
              routerLink="/gifts"
              class="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl p-6 hover:from-pink-600 hover:to-pink-700 transition transform hover:scale-105 shadow-lg"
            >
              <div class="text-4xl mb-3">🎁</div>
              <h3 class="text-xl font-bold">Cadeaux</h3>
              <p class="text-sm opacity-90 mt-1">Gérer les cadeaux</p>
            </a>

            <a
              routerLink="/draw"
              class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:from-purple-600 hover:to-purple-700 transition transform hover:scale-105 shadow-lg"
            >
              <div class="text-4xl mb-3">🎲</div>
              <h3 class="text-xl font-bold">Tirage au Sort</h3>
              <p class="text-sm opacity-90 mt-1">Lancer le tirage</p>
            </a>

            <a
              routerLink="/results"
              class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 hover:from-green-600 hover:to-green-700 transition transform hover:scale-105 shadow-lg"
            >
              <div class="text-4xl mb-3">📊</div>
              <h3 class="text-xl font-bold">Résultats</h3>
              <p class="text-sm opacity-90 mt-1">Voir et exporter</p>
            </a>
          </div>
        }
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  status = signal<StatusResponse | null>(null);
  loading = signal(true);
  resetting = signal(false);
  resettingAssociations = signal(false);

  constructor(
    private associationService: AssociationService,
    private authService: AuthService,
    private router: Router,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.loadStatus();
  }

  loadStatus() {
    this.loading.set(true);
    this.associationService.getStatus().subscribe({
      next: (data) => {
        this.status.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  async resetAssociations() {
    const confirmed = await this.dialogService.confirm({
      title: 'Réinitialiser les associations',
      message: 'Voulez-vous vraiment réinitialiser toutes les associations ?\n\nCette action :\n• Supprimera toutes les associations participant-cadeau\n• Conservera les participants et les cadeaux\n• Permettra de refaire un nouveau tirage\n\nCette action est irréversible.',
      confirmText: 'Oui, réinitialiser',
      cancelText: 'Annuler',
      type: 'warning'
    });

    if (!confirmed) return;

    this.resettingAssociations.set(true);
    this.associationService.resetAssociations().subscribe({
      next: async (response) => {
        await this.dialogService.alert(
          'Associations réinitialisées',
          `Toutes les associations ont été supprimées.\n\n${response.associations_deleted} association(s) supprimée(s).\n\nVous pouvez maintenant effectuer un nouveau tirage.`,
          'success'
        );
        this.resettingAssociations.set(false);
        this.loadStatus();
      },
      error: async (error) => {
        await this.dialogService.alert(
          'Erreur',
          'Erreur lors de la réinitialisation des associations: ' + (error.error?.message || 'Une erreur est survenue'),
          'error'
        );
        this.resettingAssociations.set(false);
      }
    });
  }

  async resetAll() {
    const confirmed = await this.dialogService.confirm({
      title: 'Confirmer la réinitialisation totale',
      message: 'Êtes-vous sûr de vouloir réinitialiser toutes les données ?\n\nCette action supprimera :\n• Tous les participants\n• Tous les cadeaux\n• Toutes les associations\n\nCette action est irréversible.',
      confirmText: 'Oui, réinitialiser tout',
      cancelText: 'Annuler',
      type: 'warning'
    });

    if (!confirmed) return;

    this.resetting.set(true);
    this.associationService.resetAll().subscribe({
      next: async (response) => {
        await this.dialogService.alert(
          'Réinitialisation totale réussie',
          `Toutes les données ont été réinitialisées.\n\nDonnées précédentes :\n• Participants : ${response.previous_data.names}\n• Cadeaux : ${response.previous_data.numbers}\n• Associations : ${response.previous_data.associations}`,
          'success'
        );
        this.resetting.set(false);
        this.loadStatus();
      },
      error: async (error) => {
        await this.dialogService.alert(
          'Erreur',
          'Erreur lors de la réinitialisation totale: ' + (error.error?.message || 'Une erreur est survenue'),
          'error'
        );
        this.resetting.set(false);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
