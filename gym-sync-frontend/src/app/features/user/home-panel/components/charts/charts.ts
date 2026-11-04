import { Component, OnInit } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ApexOptions } from 'ng-apexcharts';
import { TrainingHistoryService } from '../../../../../shared/services/training-history.service';
@Component({
  selector: 'app-charts',
  imports: [NgApexchartsModule],
  templateUrl: './charts.html',
  styleUrl: './charts.scss',
})
export class Charts implements OnInit {
  public chartOptions!: ApexOptions;
  selectedYear = new Date().getFullYear();
  monthlyData = {
    completed: Array<number>(12).fill(0),
  };

  constructor(private trainingHistoryService: TrainingHistoryService) {
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
  ngOnInit(): void {
    this.getMonthlyWorkoutCounts(this.selectedYear);
  }

  getMonthlyWorkoutCounts(year: number) {
    this.trainingHistoryService
      .getMonthlyWorkoutCounts(year)
      .subscribe((data) => {
        this.selectedYear = data.year;
        this.monthlyData.completed = data.monthlyWorkoutCounts;
        this.chartOptions = {
          ...this.chartOptions,
          series: [{ name: 'Wykonane', data: this.monthlyData.completed }],
        };
      });
  }
}
