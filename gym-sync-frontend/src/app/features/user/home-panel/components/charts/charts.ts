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
  selectedYear = 2026;
  monthlyData = {
    planned: [12, 12, 13, 12, 13, 12, 13, 12, 13, 13, 12, 13],
    completed: [9, 11, 12, 8, 13, 10, 12, 9, 11, 12, 2, 0],
  };

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Wykonane',
          data: this.monthlyData.completed,
        },
      ],
      chart: {
        type: 'bar',
        height: '100%',
        width: '100%',
        parentHeightOffset: 0,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '60%',
          borderRadius: 4,
        },
      },
      xaxis: {
        categories: [
          'Sty',
          'Lut',
          'Mar',
          'Kwi',
          'Maj',
          'Cze',
          'Lip',
          'Sie',
          'Wrz',
          'Paź',
          'Lis',
          'Gru',
        ],
        labels: {
          style: {
            colors: '#94a3b8',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        labels: {
          show: false,
          style: {
            colors: '#94a3b8',
          },
          formatter: (value) => Math.round(value).toString(),
        },
      },
      colors: ['hsl(271, 80%, 38%)'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 0,
      },
      grid: {
        borderColor: '#334155',
        padding: {
          top: -10,
          right: 0,
          bottom: 0,
          left: -10,
        },
      },
      legend: {
        position: 'bottom',
        labels: {
          colors: '#94a3b8',
        },
      },
      tooltip: {
        y: {
          formatter: (value) => `${value} treningów`,
        },
      },
    };
  }
}
