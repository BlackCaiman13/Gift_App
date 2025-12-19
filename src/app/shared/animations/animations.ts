import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-in', style({ opacity: 1 }))
  ])
]);

export const slideIn = trigger('slideIn', [
  transition(':enter', [
    style({ transform: 'translateY(-20px)', opacity: 0 }),
    animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
  ])
]);

export const scaleIn = trigger('scaleIn', [
  transition(':enter', [
    style({ transform: 'scale(0.8)', opacity: 0 }),
    animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ transform: 'scale(1)', opacity: 1 }))
  ])
]);

export const cardReveal = trigger('cardReveal', [
  transition(':enter', [
    animate('800ms ease-out', keyframes([
      style({ transform: 'scale(0.5) rotateY(90deg)', opacity: 0, offset: 0 }),
      style({ transform: 'scale(1.1) rotateY(45deg)', opacity: 0.5, offset: 0.5 }),
      style({ transform: 'scale(1) rotateY(0deg)', opacity: 1, offset: 1 })
    ]))
  ])
]);

export const pulse = trigger('pulse', [
  state('active', style({ transform: 'scale(1)' })),
  transition('* => active', [
    animate('600ms', keyframes([
      style({ transform: 'scale(1)', offset: 0 }),
      style({ transform: 'scale(1.05)', offset: 0.5 }),
      style({ transform: 'scale(1)', offset: 1 })
    ]))
  ])
]);
