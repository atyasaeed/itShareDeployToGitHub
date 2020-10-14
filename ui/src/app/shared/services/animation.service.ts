import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class AnimationService {
  cartPosition: ElementRef;
  animationDuration: number = 700;
  constructor() {}

  getCartPosition(element: ElementRef) {
    this.cartPosition = element;
  }

  flyToCartAnimation(flyingEle: ElementRef, originalColor: string) {
    if (this.cartPosition) {
      let top = flyingEle.nativeElement.getBoundingClientRect().top;
      let left = flyingEle.nativeElement.getBoundingClientRect().left;
      flyingEle.nativeElement.style.color = '#007bff';
      flyingEle.nativeElement.animate(
        [
          {
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
            opacity: 1,
            transform: 'scale(1) rotate(0)',
            zIndex: '1500',
          },
          {
            position: 'fixed',
            top: `${this.cartPosition.nativeElement.getBoundingClientRect().top}px`,
            left: `${this.cartPosition.nativeElement.getBoundingClientRect().left}px`,
            opacity: 0.4,
            transform: 'scale(3) rotate(720deg)',
            zIndex: '1500',
          },
        ],
        {
          duration: this.animationDuration,
          delay: 0,
          easing: 'ease-in-out',
        }
      );

      setTimeout(() => {
        flyingEle.nativeElement.style.color = originalColor;
        this.cartPosition.nativeElement.animate(
          [
            {
              transform: 'scale(1)',
            },
            {
              transform: 'scale(2)',
            },
          ],
          {
            duration: 500,
            delay: 0,
            easing: 'ease-in-out',
          }
        );
      }, this.animationDuration);
    }
  }
}
