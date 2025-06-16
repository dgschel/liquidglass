import { NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  viewChild,
  effect,
} from '@angular/core';
import { signal, computed } from '@angular/core';
import { interval, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'liquidglass';

  // initialize x and y as signals
  private x = signal(0);
  private y = signal(0);

  // Size of the element to keep visible
  private readonly elementWidth = 200;
  private readonly elementHeight = 200;

  // Computed property to get the position of the element
  protected position = computed(() => ({
    x: this.x(),
    y: this.y(),
  }));

  // Use viewChild to get a reference to the container element
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
        const maxX = glass.left + glass.width - this.elementWidth;
        const minX = glass.left;
        const maxY = glass.top + glass.height - this.elementHeight;
        const minY = glass.top;

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
