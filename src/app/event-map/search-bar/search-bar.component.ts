import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  searchForm: FormGroup;
  @Output() newSearch = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      'address': new FormControl(null),
    });
  }

  onSubmit() {
    this.newSearch.emit(this.searchForm.get('address').value);
  }
}
