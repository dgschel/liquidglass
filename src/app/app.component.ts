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

  // Computed property to get the position of the element
  protected position = computed(() => ({
    x: this.x(),
    y: this.y(),
  }));

  // Use viewChild to get a reference to the container element which we will use to calculate the position of the element
  private containerRef =
    viewChild.required<ElementRef<HTMLDivElement>>('container');

  constructor() {
    effect(() => {
      // Get the container's bounding rectangle
      const rect = this.containerRef().nativeElement.getBoundingClientRect();

      // Initialize the x and y signals to the center based on the container's position
      this.x.set(rect.left + rect.width / 2 - 100);
      this.y.set(rect.top + rect.height / 2 - 100);
    });

    // Update the position of the element every 5000ms
    interval(5000).subscribe(() => {
      this.x.update((x) => x + 100);
      this.y.update((y) => y + 50);
    });
  }
}
