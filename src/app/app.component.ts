import { Component } from '@angular/core';
import { LoadGeojsonService } from './load-geojson.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  map: google.maps.Map
  markersAsDesigned: google.maps.Marker[] = []
  markersAsBuilt: google.maps.Marker[] = []
  activeInfoWindow: google.maps.InfoWindow
  asBuiltLayer = new google.maps.Data();
  asDesignedLayer = new google.maps.Data();
  showTOC = false
  asDesignedChecked = false
  asBuitChecked = false
  LabelChecked = false
  SatelliteSelected = false
  StreetSelected = true


  constructor(private GISdata: LoadGeojsonService) { }

  ngOnInit(): void {
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 17,
      center: {
        lat: 47.4475,
        lng: 8.3482,
      },
      disableDefaultUI: true,
      zoomControl: true,
      scaleControl: true,
      streetViewControl: true,
    });

    this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
  }

  toggelTOC() {
    this.showTOC = !this.showTOC
  }

  LoadAsDesignedLayer(e: any) {
    this.asDesignedChecked = !this.asDesignedChecked
    if (e.checked) {
      this.GISdata.asDesignedData().subscribe((asDesGJson) => {
        this.asDesignedLayer.addGeoJson(asDesGJson)
        this.asDesignedLayer.forEach((feature) => {
          feature.getGeometry().forEachLatLng((latlong) => {

            let infowindow = new google.maps.InfoWindow({
              content: `<table style="border: 1px solid black; border-collapse: collapse;  border-spacing: 15px;">
              <tr>
                 <th colspan=2 style="border: 1px solid black; background-color: #dcdcdc">Designe Layer</th>
              </tr>
              <tr>
                 <td style="color: gray; padding: 3px">Element Name:&nbsp</td>
                 <td style="padding: 3px">${feature.getProperty('ElementName')}</td>
              </tr>
              <tr>
                 <td style="color: gray; padding: 3px">Designe X:&nbsp</td>
                 <td style="padding: 3px">${feature.getProperty('X')}</td>
              </tr>
              <tr>
                 <td style="color: gray; padding: 3px">Designe Y:&nbsp</td>
                 <td style="padding: 3px">${feature.getProperty('Y')}</td>
              </tr>
              <tr>
                 <td style="color: gray; padding: 3px">Hole Diameter:&nbsp</td>
                 <td style="padding: 3px">${feature.getProperty('HoleDiameter')}</td>
              </tr>
              <tr>
                 <td style="color: gray; padding: 3px">Bottom Elevation:&nbsp</td>
                 <td style="padding: 3px">${feature.getProperty('BottomElevation')}</td>
              </tr>
           </table>`
            });
            var marker = new google.maps.Marker({
              position: latlong,
              icon: '../assets/red.png',
              map: this.map
            });
            this.markersAsDesigned.push(marker)
            marker.addListener('click', () => {
              if (this.activeInfoWindow) {
                this.activeInfoWindow.close()
              }
              infowindow.open(this.map, marker);
              this.activeInfoWindow = infowindow
            });

          })

        })
      })
    } else {
      this.markersAsDesigned.forEach((marker) => {
        marker.setMap(null)
      })
    }
  }

  LoadAsBuiltLayer(e: any) {
    this.asBuitChecked = !this.asBuitChecked
    if (e.checked) {
      this.GISdata.asBuiltData().subscribe((asBltGJson) => {
        this.asBuiltLayer.addGeoJson(asBltGJson)
        this.asBuiltLayer.forEach((feature) => {
          feature.getGeometry().forEachLatLng((latlong) => {

            let infowindow = new google.maps.InfoWindow({
              content: `<table style="border: 1px solid black; border-collapse: collapse;  border-spacing: 15px;">
              <tr>
                 <th colspan=2 style="border: 1px solid black; background-color: #dcdcdc">Placed Layer</th>
              </tr>
              <tr>
                 <td style="color: gray; padding: 3px">Element Name:&nbsp</td>
                 <td style="padding: 3px">${feature.getProperty('ElementName')}</td>
              </tr>
              <tr>
                 <td style="color: gray; padding: 3px">Designe X:&nbsp</td>
                 <td style="padding: 3px">${feature.getProperty('X')}</td>
              </tr>
              <tr>
                 <td style="color: gray; padding: 3px">Designe Y:&nbsp</td>
                 <td style="padding: 3px">${feature.getProperty('Y')}</td>
              </tr>
              <tr>
                 <td style="color: gray; padding: 3px">Hole Diameter:&nbsp</td>
                 <td style="padding: 3px">${feature.getProperty('HoleDiameter')}</td>
              </tr>
              <tr>
                 <td style="color: gray; padding: 3px">Date Drilled:&nbsp</td>
                 <td style="padding: 3px">${feature.getProperty('DateDrilled').substring(0, 10)}</td>
              </tr>
           </table>`
            });
            var marker = new google.maps.Marker({
              position: latlong,
              icon: '../assets/green.png',
              map: this.map
            });
            this.markersAsBuilt.push(marker)
            marker.addListener('click', () => {
              if (this.activeInfoWindow) {
                this.activeInfoWindow.close()
              }
              infowindow.open(this.map, marker);
              this.activeInfoWindow = infowindow
            });

          })

        })
      })
    } else {
      this.markersAsBuilt.forEach((marker) => {
        marker.setMap(null)
      })
    }
  }

  SwitchBaseMap(e: any) {
    if (e.value == 'Street') {
      this.SatelliteSelected = false
      this.StreetSelected = true
      this.map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
    } else {
      this.SatelliteSelected = true
      this.StreetSelected = false
      this.map.setMapTypeId(google.maps.MapTypeId.SATELLITE)
      this.map.setTilt(0);
    }
  }

  zoomExtend() {
    this.map.setZoom(20)
    this.map.setCenter({
      lat: 47.44765,
      lng: 8.3482
    })
  }

  rotate90() {
    var heading = this.map.getHeading() || 0;
    this.map.setHeading(heading + 90);
  }

  threeDView() {
    if (this.map.getTilt() == 45) {
      this.map.setTilt(0);
    } else {
      this.map.setTilt(45);
    }
  }
}
