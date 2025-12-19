import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 overflow-y-auto fade-in">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            (click)="cancel()"
          ></div>

          <!-- Center modal -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <!-- Icon -->
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10"
                     [ngClass]="{
                       'bg-red-100': config()?.type === 'error' || config()?.type === 'warning',
                       'bg-blue-100': config()?.type === 'info',
                       'bg-green-100': config()?.type === 'success'
                     }">
                  <span class="text-2xl">
                    @if (config()?.type === 'error' || config()?.type === 'warning') {
                      ⚠️
                    } @else if (config()?.type === 'success') {
                      ✅
                    } @else {
                      ℹ️
                    }
                  </span>
                </div>

                <!-- Content -->
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {{ config()?.title }}
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 whitespace-pre-line">
                      {{ config()?.message }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
              <button
                type="button"
                (click)="confirm()"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition"
                [ngClass]="{
                  'bg-red-600 hover:bg-red-700 focus:ring-red-500': config()?.type === 'error' || config()?.type === 'warning',
                  'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500': config()?.type === 'info',
                  'bg-green-600 hover:bg-green-700 focus:ring-green-500': config()?.type === 'success'
                }"
              >
                {{ config()?.confirmText || 'OK' }}
              </button>
              @if (config()?.cancelText) {
                <button
                  type="button"
                  (click)="cancel()"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition"
                >
                  {{ config()?.cancelText }}
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .fade-in {
      animation: fadeIn 0.2s ease-in-out;
    }
  `]
})
export class DialogComponent {
  isOpen = signal(false);
  config = signal<DialogConfig | null>(null);
  private resolvePromise?: (value: boolean) => void;

  open(config: DialogConfig): Promise<boolean> {
    this.config.set(config);
    this.isOpen.set(true);

    return new Promise<boolean>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  confirm() {
    this.isOpen.set(false);
    this.resolvePromise?.(true);
  }

  cancel() {
    this.isOpen.set(false);
    this.resolvePromise?.(false);
  }
}
