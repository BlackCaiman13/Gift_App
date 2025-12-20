import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AssociationService } from '../../core/services/association.service';
import { Association } from '../../core/models/types';
import { fadeIn, scaleIn } from '../../shared/animations/animations';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [fadeIn, scaleIn],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50" @fadeIn>
      <nav class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-20 items-center">
            <div class="flex items-center gap-4">
              <img src="assets/inphb.png" alt="INPHB" class="h-14 object-contain" />
              <div class="border-l-2 border-gray-300 h-12"></div>
              <div>
                
              <img src="assets/mutuel.png" alt="Mutuel" class="h-14 object-contain" />
                <p class="text-xs text-gray-600">Résultats des associations</p>
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

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-xl shadow-lg p-6" @scaleIn>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">
              Binômes formés ({{ associations().length }})
            </h2>
            <div class="flex gap-3">
              <button
                (click)="exportCSV()"
                [disabled]="exportingCSV()"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                @if (exportingCSV()) {
                  <span class="animate-spin">⏳</span>
                } @else {
                  📄
                }
                Exporter CSV
              </button>
              <button
                (click)="exportPDF()"
                [disabled]="exportingPDF()"
                class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                @if (exportingPDF()) {
                  <span class="animate-spin">⏳</span>
                } @else {
                  📑
                }
                Exporter PDF
              </button>
            </div>
          </div>

          @if (loading()) {
            <div class="text-center py-12">
              <div class="inline-block animate-spin text-4xl">⏳</div>
              <p class="mt-4 text-gray-600">Chargement des résultats...</p>
            </div>
          } @else if (associations().length === 0) {
            <div class="text-center py-12">
              <div class="text-6xl mb-4">📭</div>
              <p class="text-xl text-gray-600 mb-4">Aucun couple formé pour le moment</p>
              <p class="text-gray-500">Lancez le jeu de l'invisible pour former des couples</p>
              <a
                routerLink="/draw"
                class="inline-block mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                🎲Lancer le jeu
              </a>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b-2 border-gray-200">
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">#</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Homme</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-700">Femme</th>
                  </tr>
                </thead>
                <tbody>
                  @for (association of associations(); track $index) {
                    <tr class="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td class="px-6 py-4 text-gray-600">{{ $index + 1 }}</td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <span class="text-2xl">🧑🏾‍🏫</span>
                          <span class="font-medium text-gray-800">{{ association.personne1 }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <span class="text-2xl">👩🏾‍🏫</span>
                          <span class="font-medium text-gray-800">{{ association.personne2 }}</span>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class ResultsComponent implements OnInit {
  associations = signal<Association[]>([]);
  loading = signal(true);
  exportingCSV = signal(false);
  exportingPDF = signal(false);

  constructor(private associationService: AssociationService) {}

  ngOnInit() {
    this.loadAssociations();
  }

  loadAssociations() {
    this.loading.set(true);
    this.associationService.getAssociations().subscribe({
      next: (data) => {
        this.associations.set(data.associations || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  exportCSV() {
    this.exportingCSV.set(true);
    this.associationService.exportCSV().subscribe({
      next: (blob) => {
        this.downloadFile(blob, `couples_${this.getTimestamp()}.csv`);
        this.exportingCSV.set(false);
      },
      error: () => {
        alert('Erreur lors de l\'export CSV');
        this.exportingCSV.set(false);
      }
    });
  }

  exportPDF() {
    this.exportingPDF.set(true);
    this.associationService.exportPDF().subscribe({
      next: (blob) => {
        this.downloadFile(blob, `couples_${this.getTimestamp()}.pdf`);
        this.exportingPDF.set(false);
      },
      error: () => {
        alert('Erreur lors de l\'export PDF');
        this.exportingPDF.set(false);
      }
    });
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').split('T')[0];
  }
}
