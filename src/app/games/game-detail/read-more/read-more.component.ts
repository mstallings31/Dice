import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.css']
})
export class ReadMoreComponent implements OnInit {
  @Input() content: string;
  isCollapsed = false;
  constructor() { }

  ngOnInit(): void {
  }
}
