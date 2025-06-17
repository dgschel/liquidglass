import {
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  viewChild,
  effect,
  signal,
  computed,
} from '@angular/core';

import { animate, createTimeline, utils } from 'animejs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'liquidglass';

  // Border size in pixels (0.5rem)
  private readonly borderSize = 0.5 * 16;

  private glassRef = viewChild.required<ElementRef<HTMLDivElement>>('glass');
  private containerRef =
    viewChild.required<ElementRef<HTMLDivElement>>('container');

  getRandomConstrainedPosition = () => {
    // Get the container's bounding rectangle
    const containerRect =
      this.containerRef().nativeElement.getBoundingClientRect();

    // Get the glass element's bounding rectangle
    const glassRect = this.glassRef().nativeElement.getBoundingClientRect();

    // Calculate the maximum x and y positions to keep the glass element fully visible
    const maxX = containerRect.width - glassRect.width - this.borderSize * 2;
    const minX = containerRect.left + this.borderSize * 2;
    const maxY = containerRect.height - glassRect.height - this.borderSize * 2;
    const minY = containerRect.top + this.borderSize * 2;

    // Return the computed position ensuring it stays within the container bounds
    return {
      x: utils.random(minX, maxX),
      y: utils.random(minY, maxY),
    };
  };

  private _imageLoaded = signal(false); // Signal for tracking image load state
  protected imageLoaded = computed(() => this._imageLoaded());

  constructor() {
    // Animation configuration
    const opacityIn = [0, 1];
    const scaleIn = [0.2, 1];
    const scaleOut = 3;
    const durationIn = 800;
    const durationOut = 600;
    const delay = 500;

    const image = new Image();
    image.src = 'bg.jpeg';

    image.onload = () => {
      this._imageLoaded.set(true); // Set the signal to true when the image is loaded

      // Use the callback to start the actual animation of the glass element
      createTimeline({
        onComplete: () => {
          // Play the calming background sound on loop when the glass animation is about to start
          const soundCalm = new Audio('calm.mp3');
          soundCalm.loop = true;
          soundCalm.volume = 0.5; // Set the volume to a comfortable level
          soundCalm.play();

          // Create a sound for the meditation bell
          const soundBell = new Audio('meditation-bell.mp3');
          soundBell.volume = 0.5;

          // Track the number of moves
          let moveCount = 0;

          // Animate the glass element to a new random position every random seconds with a random duration and a random delay
          const animateToRandomPosition = () => {
            const { x, y } = this.getRandomConstrainedPosition();
            const randomDuration = utils.random(2000, 5000);
            const randomDelay = utils.random(0, 3000);

            animate(this.glassRef().nativeElement, {
              translateX: x,
              translateY: y,
              duration: randomDuration,
              delay: randomDelay,
              easing: 'easeInOutQuad',
              onComplete: () => {
                // Play the bell sound every 3 moves
                if (moveCount++ % 3 === 0) soundBell.play();
                animateToRandomPosition();
              },
            });
          };

          // Start the animation to random positions
          animateToRandomPosition();
        },
      })
        .add('.letter-3', {
          opacity: opacityIn,
          scale: scaleIn,
          duration: durationIn,
        })
        .add('.letter-3', {
          opacity: 0,
          scale: scaleOut,
          duration: durationOut,
          ease: 'easeInExpo',
          delay: delay,
        })
        .add('.letter-2', {
          opacity: opacityIn,
          scale: scaleIn,
          duration: durationIn,
        })
        .add('.letter-2', {
          opacity: 0,
          scale: scaleOut,
          duration: durationOut,
          ease: 'easeInExpo',
          delay: delay,
        })
        .add('.letter-1', {
          opacity: opacityIn,
          scale: scaleIn,
          duration: durationIn,
        })
        .add('.letter-1', {
          opacity: 0,
          scale: scaleOut,
          duration: durationOut,
          ease: 'easeInExpo',
          delay: delay,
        })
        .add(this.glassRef().nativeElement, {
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: 1000,
          easing: 'easeOutExpo',
        });
    };

    effect(() => {
      // Use effect to access safely the viewChild signal properties
      const containerRect =
        this.containerRef().nativeElement.getBoundingClientRect();
      const glassRect = this.glassRef().nativeElement.getBoundingClientRect();

      // Calculate center position
      const centerX =
        (containerRect.width - glassRect.width - this.borderSize * 2) / 2;
      const centerY =
        (containerRect.height - glassRect.height - this.borderSize * 2) / 2;

      // Set initial position to center
      animate(this.glassRef().nativeElement, {
        translateX: centerX,
        translateY: centerY,
        duration: 0,
      });
    });
  }
}
