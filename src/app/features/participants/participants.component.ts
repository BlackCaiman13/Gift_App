import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ParticipantService } from '../../core/services/participant.service';
import { fadeIn, scaleIn } from '../../shared/animations/animations';
import { DialogService } from '../../shared/services/dialog.service';
import { DialogComponent } from '../../shared/components/dialog.component';

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DialogComponent],
  animations: [fadeIn, scaleIn],
  template: `
    <app-dialog></app-dialog>

    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" @fadeIn>
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <h1 class="text-2xl font-bold text-purple-600">👥 Participants</h1>
            <a routerLink="/dashboard" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
              ← Retour
            </a>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-xl shadow-lg p-6" @scaleIn>
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Ajouter un participant</h2>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom du participant</label>
                <div class="flex gap-2">
                  <input
                    [(ngModel)]="newParticipant"
                    (keyup.enter)="addParticipant()"
                    type="text"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Jean Dupont"
                  />
                  <button
                    (click)="addParticipant()"
                    [disabled]="!newParticipant.trim() || addingOne()"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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
                  [(ngModel)]="bulkParticipants"
                  rows="5"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jean Dupont&#10;Marie Martin&#10;Pierre Durand"
                ></textarea>
                <button
                  (click)="addParticipantsBulk()"
                  [disabled]="!bulkParticipants.trim() || addingBulk()"
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
              Liste des participants ({{ participants().length }})
            </h2>

            @if (loading()) {
              <div class="text-center py-8">
                <div class="inline-block animate-spin text-4xl">⏳</div>
                <p class="mt-2 text-gray-600">Chargement...</p>
              </div>
            } @else if (participants().length === 0) {
              <div class="text-center py-8 text-gray-500">
                <p class="text-4xl mb-2">📭</p>
                <p>Aucun participant pour le moment</p>
              </div>
            } @else {
              <div class="space-y-2 max-h-96 overflow-y-auto">
                @for (participant of participants(); track participant) {
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span class="font-medium text-gray-800">{{ participant }}</span>
                    <button
                      (click)="deleteParticipant(participant)"
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
export class ParticipantsComponent implements OnInit {
  participants = signal<string[]>([]);
  loading = signal(true);
  addingOne = signal(false);
  addingBulk = signal(false);
  newParticipant = '';
  bulkParticipants = '';

  constructor(
    private participantService: ParticipantService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.loadParticipants();
  }

  loadParticipants() {
    this.loading.set(true);
    this.participantService.getParticipants().subscribe({
      next: (data) => {
        this.participants.set(data.participants || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  addParticipant() {
    if (!this.newParticipant.trim()) return;

    this.addingOne.set(true);
    this.participantService.addParticipant(this.newParticipant.trim()).subscribe({
      next: () => {
        this.newParticipant = '';
        this.loadParticipants();
        this.addingOne.set(false);
      },
      error: () => this.addingOne.set(false)
    });
  }

  addParticipantsBulk() {
    const names = this.bulkParticipants
      .split('\n')
      .map(n => n.trim())
      .filter(n => n.length > 0);

    if (names.length === 0) return;

    this.addingBulk.set(true);
    this.participantService.addParticipantsBulk(names).subscribe({
      next: () => {
        this.bulkParticipants = '';
        this.loadParticipants();
        this.addingBulk.set(false);
      },
      error: () => this.addingBulk.set(false)
    });
  }

  async deleteParticipant(nom: string) {
    const confirmed = await this.dialogService.confirm({
      title: 'Confirmer la suppression',
      message: `Voulez-vous vraiment supprimer le participant "${nom}" ?`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'warning'
    });

    if (!confirmed) return;

    this.participantService.deleteParticipant(nom).subscribe({
      next: () => this.loadParticipants()
    });
  }
}
