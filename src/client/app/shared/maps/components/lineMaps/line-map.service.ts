import {Injectable} from '@angular/core';

import {BaThemeConfigProvider, layoutPaths} from '../../../../theme';

@Injectable()
export class LineMapService {


  constructor(private _baConfig:BaThemeConfigProvider) {
  }

  getCoordinateMidPoint(lat1, long1, lat2, long2, percent) {
    return [lat1 + (lat2 - lat1) * percent, long1 + (long2 - long1) * percent];
  }

  getData(coordinates) {
    let layoutColors = this._baConfig.get().colors;
    const midPoint = this.getCoordinateMidPoint(coordinates.client.latitude, coordinates.client.longitude, coordinates.server.latitude, coordinates.server.longitude,0.2);
    // svg path for target icon
    let targetSVG = 'M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z';
    // svg path for plane icon
    let binarySVG = 'm 355.2,545.6 v -67.2 h 43.2 l 14.4,14.4 v 52.8 z m 52.8,-48 -14.4,-14.4 H 360 v 57.6 h 48 z M 379.2,512 h -14.4 v -19.2 h 14.4 z m -4.8,-14.4 h -4.8 v 9.6 h 4.8 z m 0,33.6 h 4.8 v 4.8 h -14.4 v -4.8 h 4.8 v -9.6 h -4.8 v -4.8 h 9.6 z m 19.2,-24 h 4.8 V 512 H 384 v -4.8 h 4.8 v -9.6 H 384 v -4.8 h 9.6 z m 4.8,28.8 H 384 v -19.2 h 14.4 z m -4.8,-14.4 h -4.8 v 9.6 h 4.8 z';
    let binarySVG_upsideDown = 'm 412.8,478.4 v 67.2 h -43.2 l -14.4,-14.4 v -52.8 z m -52.8,48 14.4,14.4 H 408 V 483.2 H 360 Z M 388.8,512 h 14.4 v 19.2 h -14.4 z m 4.8,14.4 h 4.8 v -9.6 h -4.8 z m 0,-33.6 h -4.8 V 488 h 14.4 v 4.8 h -4.8 v 9.6 h 4.8 v 4.8 h -9.6 z m -19.2,24 h -4.8 V 512 H 384 v 4.8 h -4.8 v 9.6 h 4.8 v 4.8 h -9.6 z M 369.6,488 H 384 v 19.2 h -14.4 z m 4.8,14.4 h 4.8 v -9.6 h -4.8 z';
    console.log("midPoint: ", midPoint);
    return {
      type: 'map',
      theme: 'blur',
      dataProvider: {
        map: 'worldLow',
            zoomLevel: 8,
            zoomLongitude: midPoint[1],
            zoomLatitude: midPoint[0],          
        lines: [
          {
            id: "line1",
            arc: -0.85,
            alpha: 1,
            latitudes: [ coordinates.server.latitude, coordinates.client.latitude ],
            longitudes: [ coordinates.server.longitude, coordinates.client.longitude ]
          }
        ],
        images: [
          {
            id: 'systembolaget',
            svgPath: targetSVG,
            title: 'Systembolaget, server',
            latitude: coordinates.server.latitude,
            longitude: coordinates.server.longitude,
            scale: 1.5,
            zoomLevel: 8
          },
          {
            id: 'you',
            svgPath: targetSVG,
            title: 'You',
            latitude: coordinates.client.latitude,
            longitude: coordinates.client.longitude,
            scale: 1.5,
          },
          {
            label: 'Fetching data from Systembolaget API',
            left: 100,
            top: 45,
            labelShiftY: 5,
            labelShiftX: 5,
            color: layoutColors.defaultText,
            labelColor: layoutColors.defaultText,
            labelRollOverColor: layoutColors.defaultText,
            labelFontSize: 20
          },          
          {
            svgPath: binarySVG_upsideDown,
            positionOnLine: 0,
            color: layoutColors.defaultText,
            alpha: 1,
            animateAlongLine: true,
            animateAngle: true,
            lineId: 'line1',
            flipDirection: false,
            loop: true,
            scale: 0.5,
            positionScale: 1.2
          }
        ]
      },
      areasSettings: {
        unlistedAreasColor: layoutColors.info
      },
      imagesSettings: {
        color: layoutColors.warningLight,
        selectedColor: layoutColors.warning,
        "rollOverColor": "#585869",
        "pauseDuration": 0.2,
        "animationDuration": 2.5,
        "adjustAnimationSpeed": true        
      },
      linesSettings: {
        color: layoutColors.warningLight,
        alpha: 0.8
      },
      backgroundZoomsToTop: true,
      linesAboveImages: true,
      export: {
        'enabled': false
      },
      pathToImages: layoutPaths.images.amMap
    };
  }
}
