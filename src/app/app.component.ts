import { NgStyle } from '@angular/common';
import {
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  viewChild,
  effect,
} from '@angular/core';
import { signal, computed } from '@angular/core';
import { interval } from 'rxjs';

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

  constructor() {
    effect(() => {
      // Get the container's bounding rectangle
      const rect = this.containerRef().nativeElement.getBoundingClientRect();

      // Initialize the x and y signals to the center based on the container's position
      this.x.set(rect.left + (rect.width - this.elementWidth) / 2);
      this.y.set(rect.top + (rect.height - this.elementHeight) / 2);
    });

    // Update the position of the element every 5000ms with random values within the container
    interval(5000).subscribe(() => {
      const glass = this.containerRef().nativeElement.getBoundingClientRect();

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
    });
  }
}
