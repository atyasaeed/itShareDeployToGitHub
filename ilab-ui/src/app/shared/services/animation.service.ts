import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnimationService {
  cartPosition: ElementRef;
  constructor() {}

  getCartPosition(element: ElementRef) {
    this.cartPosition = element;
    //console.log(this.cartPosition);
  }

  flyToCartAnimation(flyingEle: ElementRef) {
    if (this.cartPosition) {
      let targetTop = this.cartPosition.nativeElement.getBoundingClientRect().top;
      let targetLeft = this.cartPosition.nativeElement.getBoundingClientRect().left;
      let top = flyingEle.nativeElement.getBoundingClientRect().top;
      let left = flyingEle.nativeElement.getBoundingClientRect().left;
      flyingEle.nativeElement.style.color = '#007bff';
      flyingEle.nativeElement.style.zIndex = '1500';
      flyingEle.nativeElement.animate(
        [
          {
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
            opacity: 1,
            transform: 'scale(1) rotate(0)',
          },
          {
            position: 'fixed',
            top: `${targetTop}px`,
            left: `${targetLeft}px`,
            opacity: 0.4,
            transform: 'scale(4) rotate(720deg)',
          },
        ],
        {
          duration: 700,
          delay: 0,
          easing: 'ease-in-out',
        }
      );

      setTimeout(() => {
        flyingEle.nativeElement.style.color = 'white';
      }, 700);
    }
  }
}
