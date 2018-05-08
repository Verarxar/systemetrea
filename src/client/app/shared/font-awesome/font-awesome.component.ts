import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-fa',
  templateUrl: './font-awesome.component.html',
  styleUrls: ['./font-awesome.component.less']
})
export class FontAwesomeComponent implements OnInit {
  @Input() condition: boolean;
  @Input() truthyIcon: string;
  @Input() falsyIcon: string;
  @Input() baseClass: string;

  constructor() { }

  ngOnInit() {
  }

}
