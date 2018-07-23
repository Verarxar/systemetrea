import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

declare var UIkit: any;

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.less']
})
export class CountdownComponent implements OnInit {
  countdown: any;

  constructor() { }

  ngOnInit() {
    // @ts-ignore
    let dateNow: moment.Moment = moment().format();
    const date = moment(this.getDate(dateNow)).hour(7);
    console.log('this date', dateNow);
    this.countdown = UIkit.countdown('#countdown', {
      date: date
    });
    this.countdown.start();
  }

  getDate(date) {
    const year = moment().year();
    console.log('year', year);
    const firstQuarter: any = moment({year: year, month: 2, date: 1}).quarter(1).format();
    const secondQuarter = moment({year: year, month: 2, date: 1}).quarter(2).format();
    const thirdQuarter = moment({year: year, month: 2, date: 1}).quarter(3).format();
    const fourthQuarter = moment({year: year, month: 2, date: 1}).quarter(4).format();
    if (moment(date).isBefore(firstQuarter)) {
      return firstQuarter;
    } else if (moment(date).isBefore(secondQuarter)) {
      return secondQuarter;
    } else if (moment(date).isBefore(thirdQuarter)) {
      return thirdQuarter;
    } else if (moment(date).isBefore(fourthQuarter)) {
      return fourthQuarter;
    }
  }

}
