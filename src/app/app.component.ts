import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UtilService } from './utils/common-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public lineChartData: any[] = [
    { label: 2017, values: [2, -5, -6, -4] },
    { label: 2018, values: [3, -4, -4, -4] },
    { label: 2019, values: [4, -3, -3, -3] },
    { label: 2020, values: [6, -1, -1, -1] },
    { label: 2021, values: [4, -2, -2, -2] },
    { label: 2022, values: [6, -1, -3, -2] },
    { label: 2023, values: [8, 0, -2, -1] },
    { label: 2024, values: [10, 1, -1, 0] }
  ];

  public lineChartData1: any[] = [
    { label: 2017, values: [5, 5, 5, 5] },
    { label: 2018, values: [5, 5, 5, 5] },
    { label: 2019, values: [5, 5, 5, 5] },
    { label: 2020, values: [4, 2, 0, -3] },
    { label: 2021, values: [10, 8, 8, 6] },
    { label: 2022, values: [9, 7, 7, 5] },
    { label: 2023, values: [8, 6, 6, 4] },
    { label: 2024, values: [7, 5, 5, 3] }
  ];

  public lineChartColors = ["red", "blue", "green", "orange"];

}
