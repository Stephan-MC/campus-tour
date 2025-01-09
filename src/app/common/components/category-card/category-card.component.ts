import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-category-card',
  imports: [NgClass],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
})
export class CategoryCardComponent {
  text = input.required<string>();
  color = input.required<string>();
  icon = input.required<string>();
}
