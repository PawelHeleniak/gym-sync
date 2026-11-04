import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-last-training-card',
  imports: [CommonModule],
  templateUrl: './last-training-card.html',
  styleUrl: './last-training-card.scss',
})
export class LastTrainingCard {
  stats = [
    {
      icon: 'clock-4',
      value: '54 min',
      label: 'Czas treningu',
    },
    {
      icon: 'list-check',
      value: '24',
      label: 'Wykonane serie',
    },
    {
      icon: 'weight',
      value: '4 250 kg',
      label: 'Objętość treningu',
    },
  ];
}
