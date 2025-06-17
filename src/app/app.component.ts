import { NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  viewChild,
  effect,
} from '@angular/core';

import { animate, utils } from 'animejs';

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

  private containerRef =
    viewChild.required<ElementRef<HTMLDivElement>>('container');

  // Compute only once the bounding rectangle of the container
  private glassRect = computed(() =>
    this.containerRef().nativeElement.getBoundingClientRect()
  );

  // Create an interval signal from an Observable that updates the position every 5000ms
  interval = toSignal(
    interval(5000).pipe(
      tap(() => {
        const glass = this.glassRect();

        // Calculate max x and y so the element stays fully visible
        const maxX =
          glass.left + glass.width - this.elementWidth - this.borderSize;
        const minX = glass.left - this.borderSize;
        const maxY =
          glass.top + glass.height - this.elementHeight - this.borderSize;
        const minY = glass.top + this.borderSize;

        // Generate random x and y within bounds
        const randomX = Math.random() * (maxX - minX) + minX;
        const randomY = Math.random() * (maxY - minY) + minY;

        // Update the x and y signals with the new random values
        this.x.set(randomX);
        this.y.set(randomY);
      })
    )
  );

  constructor() {
    effect(() => {
      // Get the container's bounding rectangle
      const glass = this.glassRect();

      // Initialize the x and y signals to the center based on the container's position
      this.x.set(glass.left + (glass.width - this.elementWidth) / 2);
      this.y.set(glass.top + (glass.height - this.elementHeight) / 2);
    });
  }
}
