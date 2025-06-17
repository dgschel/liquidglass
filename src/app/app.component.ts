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
        const maxX =
      containerRect.left +
      containerRect.width -
      glassRect.width -
      this.borderSize;
    const minX = containerRect.left + this.borderSize;
        const maxY =
      containerRect.top +
      containerRect.height -
      glassRect.height -
      this.borderSize;
    const minY = containerRect.top + this.borderSize;

    // Return the computed position ensuring it stays within the container bounds
    return {
      x: utils.random(minX, maxX),
      y: utils.random(minY, maxY),
    };
  };

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
