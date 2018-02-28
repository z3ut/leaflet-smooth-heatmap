# Leaflet Smooth Heatmap

Serverless smooth and unbroken heatmap tile layer.

[Live Demo](https://z3ut.github.io/leaflet-smooth-heatmap/)

## Description

Canvas tile layer. Each tile filled with grid of rectangles. Rectangle color requested by coordinates of it center.

Not intended for use on low-performance devices.

## Installation

1. Install with [npm](https://www.npmjs.com)

```
npm install leaflet-smooth-heatmap
```

2. Import JS dependencies

```
import SmoothHeatmapLayer from 'leaflet-smooth-heatmap';
```

or include src/index.js to your bundle and use plugin through global L variable

## Usage

```
const options = {
  canvasSize: 5,
  getColorForLatLng: (lat, lng) => `rgba(${90 + lat}, ${180 + lng}, 100, .5)`
};
map.addLayer( new SmoothHeatmapLayer(options) );
```

Example with data point interpolation in ./docs

### Options

Name | Description | Type | Default
--- | --- | --- | ---
canvasSize | Size of rectangles in canvas (low values influence on performance) | Number | 3
getColorForLatLng | Return color for point coordinates. Arguments - lat, lng | Function | function() { return 'rgba(0, 0, 0, 0);' }
