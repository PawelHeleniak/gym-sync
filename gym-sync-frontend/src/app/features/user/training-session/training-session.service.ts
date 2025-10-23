import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  async getTrainings(): Promise<trainingList[]> {
    const response = await fetch('/trening.json');

    if (!response.ok)
      throw new Error('Nie udało się wczytać pliku trening.json');
    return response.json();
  }
}
