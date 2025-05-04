/* eslint-disable no-undef */
import { Image } from 'react-native';

const userImageMarker = require('@/assets/images/person-marker-v2.png');
const userImageSource = Image.resolveAssetSource(userImageMarker);
const userImageUrl = userImageSource.uri || userImageSource.uri;

const binImageMarker = require('@/assets/images/bin-marker-v2.png');
const binImageSource = Image.resolveAssetSource(binImageMarker);
const binImageUrl = binImageSource.uri || binImageSource.uri;

const MIN_ZOOM = 18;
const MAX_ZOOM = 19;

export default function createLeafletHtml(
  latitude: number | undefined,
  longitude: number | undefined
): string {
  const html = /*html*/ `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <style>
        html, body, #map {
          margin: 0;
          padding: 0;
          height: 100vh;
          width: 100vw;
          -webkit-user-select: none;
          user-select: none;
        }

        .context-menu-marker {
          background-color: rgba(255, 0, 0, 0.5);
          border-radius: 50%;
          width: 15px;
          height: 15px;
          position: fixed;
          z-index: 1000;
        }

        .user-marker {
        }

        .bin-marker {
        }

        .closest-bin-marker {
          filter: hue-rotate(120deg) drop-shadow(0 0 8px rgba(0, 255, 0, 0.5));
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var selectionRangeTreshold = 0.000054; // ~6 meters

        var logger = function () {
          function log(message) {
            console.log('[WEBVIEW Log] ', message);
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'log',
              message: message,
            }));
          }

          return { log: log };
        };
        var loggerInstance = logger();

        var contextMenuMarker = null;
        var closestBinBarker = null;

        //loggerInstance.log('Script started', { obj: 'foo', bar: 'zoo' });

        var map = L
          .map('map', {
            dragging: false,
            touchZoom: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            tap: false,
            zoomControl: false,
          });

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          maxZoom: ${MAX_ZOOM},
          minZoom: ${MIN_ZOOM},
        }).addTo(map);

        var userMarkerIcon = L.icon({
          iconUrl: '${userImageUrl}',
          iconSize: [40, 40],
          className: 'user-marker',
        });

        var userMarker = L.marker(
          [${latitude}, ${longitude}],
          {
            icon: userMarkerIcon,
          }
        ).addTo(map);

        //loggerInstance.log('User marker added at: ' + ${latitude} + ', ' + ${longitude});

        var binMarkerIcon = L.icon({
          iconUrl: '${binImageUrl}',
          iconSize: [35, 35],
          className: 'bin-marker',
        });
        var binMarkers = [];

        // # Internal handlers

        // -- handle map onload event

        map.on('load', function(event) {
          loggerInstance.log('Map loaded', event);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'maploaded',
          }));
        });

        // -- handle doubleclick - context menu

        map.on('dblclick', function(event) {
          if (contextMenuMarker) {
            map.removeLayer(contextMenuMarker);
            contextMenuMarker = null;
          }
          var latlng = event.latlng.lat + ', ' + event.latlng.lng;
          var screenPos = event.containerPoint.x + ', ' + event.containerPoint.y;

          contextMenuMarker = L.marker(event.latlng, {
            icon: L.divIcon({
              className: 'context-menu-marker',
            }),
          }).setZIndexOffset(1000).addTo(map);

          var foundMarkers = [];
          try {
            for (var i = 0; i < binMarkers.length; i++) {
              var currentMarker = binMarkers[i];

              var markerId = currentMarker.id;
              var markerLatLng = currentMarker.getLatLng();
              var markerLat = markerLatLng.lat;
              var markerLng = markerLatLng.lng;

              if (
                Math.abs(markerLatLng.lat - event.latlng.lat) < selectionRangeTreshold &&
                Math.abs(markerLatLng.lng - event.latlng.lng) < selectionRangeTreshold
              ) {
                foundMarkers.push(markerId);
              }
            }
            loggerInstance.log('Found markers around selected point: ' + JSON.stringify(foundMarkers, null, 2));
          } catch (e) {
            loggerInstance.log('Error while searching for markers: ' + e.message, e);
          }

          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'contextmenu',
            latlng: { lat: event.latlng.lat, lng: event.latlng.lng },
            screenPos: {  x: event.containerPoint.x, y: event.containerPoint.y },
            selectedBins: foundMarkers,
          }));
        });

        // # External handlers

        // -- Update position
        window.updateMapPosition = function(lat, lng) {
          //loggerInstance.log('Map position updated to: ' + lat + ', ' + lng);
          map.setView([lat, lng], map.getZoom());
          userMarker.setLatLng([lat, lng]);
        };
        

        // -- Update zoom
        window.updateMapZoom = function(zoom) {
          //loggerInstance.log('Zoom level changed to: ' + zoom);
          map.setZoom(zoom);
        };
        
        // -- Update bins
        window.updateBins = function(bins) {
          //loggerInstance.log('Bins updated: ' + JSON.stringify(bins, null, 2));

          // remove far away bins
          var binsToRemove = binMarkers.filter((marker) => {
            return !bins.find((bin) => bin.id === marker.id);
          });
          binsToRemove.forEach((marker) => {
            map.removeLayer(marker);
          });

          bins.forEach((bin) => {
            var exists = binMarkers.find((marker) => marker.id === bin.id);
            if (!exists) {
              var marker = L.marker([bin.latitude, bin.longitude], {
                icon: binMarkerIcon,
              }).setZIndexOffset(100).addTo(map);
              marker.id = bin.id;
              binMarkers.push(marker);
            }
          });
        }

        // -- Clear selected position
        window.clearSelectedPos = function() {
          //loggerInstance.log('Clearing selected position');
          if (contextMenuMarker) {
            map.removeLayer(contextMenuMarker);
            contextMenuMarker = null;
          }
        }

        // -- Mark bin marker as the closest
        window.markClosestBin = function(binId) {
          //loggerInstance.log('Marking bin ' + binId + ' as closest');
          if (closestBinBarker) {
            closestBinBarker._icon.classList.remove('closest-bin-marker');
          }
          closestBinBarker = binMarkers.find((marker) => marker.id === binId);
          if (closestBinBarker) {
            closestBinBarker._icon.classList.add('closest-bin-marker');
          }
        }

        map.setView(
          [${latitude},${longitude}],
          ${MIN_ZOOM}
        );

        //loggerInstance.log('Script successfully parsed');
      </script>
    </body>
  </html>`;

  return html;
}
