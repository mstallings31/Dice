import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-date-icon',
  templateUrl: './date-icon.component.html',
  styleUrls: ['./date-icon.component.css']
})
export class DateIconComponent implements OnInit {
  @Input() date;
  month: string;
  day: string;

  constructor() { }

  ngOnInit(): void {
    this.parseDate(new Date(this.date));
  }

  parseDate(date: Date) {
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];
    this.month = monthNames[date.getMonth()];
    this.day = date.getDate().toLocaleString();
  }

}
