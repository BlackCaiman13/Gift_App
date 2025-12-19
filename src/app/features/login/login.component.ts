import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { fadeIn, slideIn } from '../../shared/animations/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  animations: [fadeIn, slideIn],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 flex items-center justify-center p-4" @fadeIn>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8" @slideIn>
        <div class="text-center mb-8">
          <div class="flex justify-center items-center gap-4 mb-4">
            <img src="assets/mutuel.png" alt="Mutuel" class="h-16 object-contain" />
          </div>
          <h1 class="text-4xl font-bold text-blue-900 mb-2">Jeu de l'Invisible</h1>
          <p class="text-gray-600">Connectez-vous pour accéder à l'application</p>
          <p class="text-xs text-gray-500 mt-1">INPHB - Institut National Polytechnique Houphouët-Boigny</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              formControlName="username"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="Entrez votre nom d'utilisateur"
            />
            @if (loginForm.get('username')?.invalid && loginForm.get('username')?.touched) {
              <p class="mt-1 text-sm text-red-600">Le nom d'utilisateur est requis</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              formControlName="password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              placeholder="Entrez votre mot de passe"
            />
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <p class="mt-1 text-sm text-red-600">Le mot de passe est requis</p>
            }
          </div>

          @if (errorMessage()) {
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {{ errorMessage() }}
            </div>
          }

          <button
            type="submit"
            [disabled]="loading() || loginForm.invalid"
            class="w-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-3 rounded-lg font-semibold hover:from-blue-800 hover:to-indigo-800 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            @if (loading()) {
              <span class="inline-block animate-spin mr-2">⏳</span>
              Connexion en cours...
            } @else {
              Se connecter
            }
          </button>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.errorMessage.set('');

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.loading.set(false);
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 100);
        },
        error: (error) => {
          this.loading.set(false);
          this.errorMessage.set(error.error?.message || error.error?.error || 'Erreur de connexion. Veuillez réessayer.');
        }
      });
    }
  }
}
