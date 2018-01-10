(function (factory, window) {

  // define an AMD module that relies on 'leaflet'
  if (typeof define === 'function' && define.amd) {
      define(['leaflet'], factory);

  // define a Common JS module that relies on 'leaflet'
  } else if (typeof exports === 'object') {
      module.exports = factory(require('leaflet'));
  }

  // attach your plugin to the global 'L' variable
  if (typeof window !== 'undefined' && window.L) {
      window.L.SmoothHeatmapLayer = factory(L);
  }
}(function (L) {
  var SmoothHeatmapLayer = L.GridLayer.extend({
    options: {
      canvasSize: 3,
      getColorForLatLng: function() { return 'rgba(0, 0, 0, 0);' }
    },

    initialize: function(options) {
      L.setOptions(this, options);
    },

    _convertTileToLat: function(x, y, z) {
      var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
      return 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
    },
    _convertTileToLng: function(x, y, z) {
      return x / Math.pow(2, z) * 360 - 180;
    },
  
    createTile: function(coords) {
      var tile = document.createElement('canvas');
      var tileSize = this.getTileSize();
      tile.setAttribute('width', tileSize.x);
      tile.setAttribute('height', tileSize.y);
      var ctx = tile.getContext('2d');

      var lat = this._convertTileToLat(coords.x, coords.y, coords.z);
      var lng = this._convertTileToLng(coords.x, coords.y, coords.z);

      var latEnd = this._convertTileToLat(coords.x + 1, coords.y + 1, coords.z);
      var lngEnd = this._convertTileToLng(coords.x + 1, coords.y + 1, coords.z);

      var latStep = (latEnd - lat) / tileSize.y;
      var lngStep = (lngEnd - lng) / tileSize.x;
      
      var canvasSize = this.options.canvasSize;

      for (var i = 0; i < tileSize.x; i += canvasSize) {
        for (var j = 0; j < tileSize.y; j += canvasSize) {
          var rectCenterLat = lat + latStep * (j + canvasSize / 2);
          var rectCenterLng = lng + lngStep * (i + canvasSize / 2);
  
          ctx.fillStyle = this.options.getColorForLatLng(rectCenterLat, rectCenterLng);
          ctx.fillRect(i, j, canvasSize, canvasSize);
        }
      }

      return tile;
    }
  });

  return SmoothHeatmapLayer;
}, window));
