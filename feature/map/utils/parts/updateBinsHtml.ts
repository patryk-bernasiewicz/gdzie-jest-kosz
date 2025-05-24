export const updateBinsHtml = /* js */ `
  // -- Update bins
  window.updateBins = function(bins) {
    loggerInstance.log('Bins updated: ' + JSON.stringify(bins, null, 2));

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
`;
