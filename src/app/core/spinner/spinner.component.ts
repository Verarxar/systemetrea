import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SpinnerState, SpinnerService } from './spinner.service';

@Component({
  selector: 'ev-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.less']
})
export class SpinnerComponent implements OnDestroy, OnInit {
  visible = false;
  private onDestroy = new Subject();

  private spinnerStateChanged: Subscription;

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.spinnerStateChanged = this.spinnerService.spinnerState
      .pipe(takeUntil(this.onDestroy))
      .subscribe((state: SpinnerState) => (this.visible = state.show));
  }

  ngOnDestroy() {
    this.onDestroy.next(true);
  }
}
