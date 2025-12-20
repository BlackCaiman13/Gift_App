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
          <div class="flex justify-between h-20 items-center">
            <div class="flex items-center gap-4">
              <img src="assets/inphb.png" alt="INPHB" class="h-14 object-contain" />
              <div class="border-l-2 border-gray-300 h-12"></div>
              <div>
                <img src="assets/mutuel.png" alt="Mutuel" class="h-14 object-contain" />
              </div>
            </div>
            <div class="flex items-center gap-4">
              
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
                  <p class="text-gray-500 text-sm font-medium">Hommes</p>
                  <p class="text-4xl font-bold text-blue-600 mt-2">{{ status()?.status?.participants?.total || 0 }}</p>
                </div>
                <div class="bg-blue-100 rounded-full p-4">
                  <span class="text-4xl">🧑🏾‍🏫</span>
                </div>
              </div>
              <div class="mt-4 flex justify-between text-sm">
                <span class="text-green-600">✓ En binôme: {{ getParticipantsAssociated() }}</span>
                
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition" @scaleIn>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm font-medium">Femmes</p>
                  <p class="text-4xl font-bold text-pink-600 mt-2">{{ status()?.status?.gifts?.total || 0 }}</p>
                </div>
                <div class="bg-pink-100 rounded-full p-4">
                  <span class="text-4xl">👩🏾‍🏫</span>
                </div>
              </div>
              <div class="mt-4 flex justify-between text-sm">
                <span class="text-green-600">✓ En binôme: {{ getGiftsAssociated() }}</span>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition" @scaleIn>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm font-medium">Binômes formés</p>
                  <p class="text-4xl font-bold text-indigo-600 mt-2">{{ status()?.status?.associations?.total || 0 }}</p>
                </div>
                <div class="bg-indigo-100 rounded-full p-4">
                  <span class="text-4xl">🫱🏾‍🫲🏾</span>
                </div>
              </div>
             
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              routerLink="/participants"
              class="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-6 hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 shadow-lg"
            >
              <div class="text-4xl mb-3">🧑🏾‍🏫</div>
              <h3 class="text-xl font-bold">Hommes</h3>
              <p class="text-sm opacity-90 mt-1">Gérer les hommes</p>
            </a>

            <a
              routerLink="/gifts"
              class="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl p-6 hover:from-pink-600 hover:to-pink-700 transition transform hover:scale-105 shadow-lg"
            >
              <div class="text-4xl mb-3">👩🏾‍🏫</div>
              <h3 class="text-xl font-bold">Femmes</h3>
              <p class="text-sm opacity-90 mt-1">Gérer les femmes</p>
            </a>

            <a
              routerLink="/draw"
              class="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-xl p-6 hover:from-indigo-700 hover:to-indigo-800 transition transform hover:scale-105 shadow-lg"
            >
              <div class="text-4xl mb-3">🎲</div>
              <h3 class="text-xl font-bold">Jeu de l'Invisible</h3>
              <p class="text-sm opacity-90 mt-1">Lancer le jeu</p>
            </a>

            <a
              routerLink="/results"
              class="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-xl p-6 hover:from-green-700 hover:to-green-800 transition transform hover:scale-105 shadow-lg"
            >
              <div class="text-4xl mb-3">📊</div>
              <h3 class="text-xl font-bold">Binômes</h3>
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

  // Calculer le nombre de participants associés
  getParticipantsAssociated(): number {
    const associations = this.status()?.status?.associations?.details || [];
    const uniqueParticipants = new Set<string>();
    associations.forEach(assoc => {
      uniqueParticipants.add(assoc.personne1);
    });
    return uniqueParticipants.size;
  }


  // Calculer le nombre de cadeaux (femmes) associés
  getGiftsAssociated(): number {
    const associations = this.status()?.status?.associations?.details || [];
    const uniqueGifts = new Set<string>();
    associations.forEach(assoc => {
      uniqueGifts.add(assoc.personne2);
    });
    return uniqueGifts.size;
  }



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
      title: 'Réinitialiser les couples',
      message: 'Voulez-vous vraiment réinitialiser tous les couples ?\n\nCette action :\n• Supprimera tous les couples formés\n• Conservera les hommes et les femmes\n• Permettra de refaire un nouveau jeu\n\nCette action est irréversible.',
      confirmText: 'Oui, réinitialiser',
      cancelText: 'Annuler',
      type: 'warning'
    });

    if (!confirmed) return;

    this.resettingAssociations.set(true);
    this.associationService.resetAssociations().subscribe({
      next: async (response) => {
        await this.dialogService.alert(
          'Couples réinitialisés',
          `Tous les couples ont été supprimés.\n\n${response.associations_deleted} couple(s) supprimé(s).\n\nVous pouvez maintenant effectuer un nouveau jeu.`,
          'success'
        );
        this.resettingAssociations.set(false);
        this.loadStatus();
      },
      error: async (error) => {
        await this.dialogService.alert(
          'Erreur',
          'Erreur lors de la réinitialisation des couples: ' + (error.error?.message || 'Une erreur est survenue'),
          'error'
        );
        this.resettingAssociations.set(false);
      }
    });
  }

  async resetAll() {
    const confirmed = await this.dialogService.confirm({
      title: 'Confirmer la réinitialisation totale',
      message: 'Êtes-vous sûr de vouloir réinitialiser toutes les données ?\n\nCette action supprimera :\n• Tous les hommes\n• Toutes les femmes\n• Tous les couples\n\nCette action est irréversible.',
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
          `Toutes les données ont été réinitialisées.\n\nDonnées précédentes :\n• Hommes : ${response.previous_data.names}\n• Femmes : ${response.previous_data.numbers}\n• Couples : ${response.previous_data.associations}`,
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
