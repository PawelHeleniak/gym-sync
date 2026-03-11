import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexOptions } from 'ng-apexcharts';

@Component({
  selector: 'app-charts',
  imports: [NgApexchartsModule],
  templateUrl: './charts.html',
  styleUrl: './charts.scss',
})
export class Charts {
  public chartOptions!: ApexOptions;
  chartState: string = 'Bench press';
  exercises = ['Bench press', 'Squat', 'Farmer walk'];
  chartDataMap: Record<string, { x: string; y: number }[]> = {
    'Bench press': [
      { x: '2026-01-10', y: 92 },
      { x: '2026-01-17', y: 95 },
      { x: '2026-01-24', y: 97 },
      { x: '2026-02-01', y: 100 },
    ],
    Squat: [
      { x: '2026-01-10', y: 120 },
      { x: '2026-01-17', y: 125 },
      { x: '2026-01-24', y: 130 },
      { x: '2026-02-01', y: 135 },
    ],
    'Farmer walk': [
      { x: '2026-01-10', y: 1200 },
      { x: '2026-01-17', y: 1400 },
      { x: '2026-01-24', y: 1500 },
      { x: '2026-02-01', y: 1650 },
    ],
  };
  constructor() {
    this.chartOptions = {
      series: [
        {
          name: this.chartState,
          data: this.chartDataMap[this.chartState],
        },
      ],
      chart: {
        type: 'line',
        height: '100%',
        width: '100%',
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        type: 'datetime',
        labels: {
          style: {
            colors: '#94a3b8',
            fontSize: '12px',
          },
        },
      },
      yaxis: [
        {
          labels: {
            style: {
              colors: '#94a3b8',
              fontSize: '12px',
            },
          },
        },
      ],
      colors: ['hsl(271, 80%, 38%)'],
      stroke: {
        width: 3,
      },
      markers: {
        size: 5,
        colors: ['hsl(180, 70%, 45%)'],
        strokeWidth: 0,
        strokeColors: '#ffffff',
      },
      grid: {
        borderColor: '#475569',
      },
    };
  }
  changeChart(name: string): void {
    this.chartState = name;
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          name: name,
          data: this.chartDataMap[name],
        },
      ],
    };
  }
}
