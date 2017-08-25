import { Component, OnInit } from '@angular/core';
import { XmlService } from './';

@Component({
  selector: 'app-xml',
  templateUrl: './xml.html',
})
export class XmlComponent implements OnInit {
  xmlFiles = null;
  status: any = "";
  isBusy: boolean = false;
  mapCoordinates:any = null;
  hasFetchedXml:boolean = false;
  tableSettings = { title: 'file names', data: null };

  constructor(private service: XmlService) {
  }

  ngOnInit() {
    this.service.getXmlFiles().then(response => {
      this.tableSettings.data = response;
    });
  }

  getXml() {
    this.isBusy = true;
    this.service.getMapCoordinates().then(response => {
      this.mapCoordinates = response;
    });

    this.service.fetchNewXml().then(response => {
      this.status = response;
      this.hasFetchedXml = true;
      this.isBusy = false;
    }).catch(this.handleError);
  }

  deleteFile(fileName: string) {
    this.service.deleteXmlFile(fileName).subscribe(response => {
      console.log("ok");
    }, (this.handleError));
  }

  handleError(err) {
    console.log("@xml.component err:", err);
  }
}
