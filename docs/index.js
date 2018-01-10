const currentColorSourceElement = document.querySelector('[data-current-color-source]');
const changeColorSourceElement = document.querySelector('[data-change-color-source]');

const COLOR_SOURCE = {
  LAT: {
    message: 'temp by lat'
  },
  KRIGING: {
    message: 'temp by kriging (slower)'
  }
}

let currentColorSource = COLOR_SOURCE.LAT;
currentColorSourceElement.textContent = COLOR_SOURCE.LAT.message

changeColorSourceElement.addEventListener('click', () => {
  switch (currentColorSource) {
    case COLOR_SOURCE.LAT:
      currentColorSource = COLOR_SOURCE.KRIGING;
      currentColorSourceElement.textContent = COLOR_SOURCE.KRIGING.message;
    break;
    case COLOR_SOURCE.KRIGING:
      currentColorSource = COLOR_SOURCE.LAT;
      currentColorSourceElement.textContent = COLOR_SOURCE.LAT.message;
    break;
  }

  if (map.getZoom() > 0) {
    map.zoomOut();
  } else {
    map.zoomIn();
  }
});


const map = L.map('map').setView([0, 0], 0);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);


// interpolation based on random points
// https://github.com/oeo4b/kriging.js
const numberOfPoints = 20;

const t = [];
const x = [];
const y = [];

for (let i = 0; i < numberOfPoints; i++) {
  t.push(Math.random() * 50 - 20);
  x.push(Math.random() * 360 - 180);
  y.push(Math.random() * 180 - 90);
}

const model = "exponential";
const sigma2 = 0, alpha = 100;
const variogram = kriging.train(t, x, y, model, sigma2, alpha);


function getBackgroundFromTemperature(temp, alpha = 50) {
  if (typeof temp !== 'number' || isNaN(temp)) {
    // Grey
    return `hsla(0, 0%, 75%, ${alpha}%)`;
  }

  const hue = temp >= 0 ?
    -3 * Math.min(temp, 30) + 90 :
    -2 * Math.max(temp, -20) + 180;

  return `hsla(${hue}, 80%, 60%, ${alpha}%)`;
}

function getColorForLatLng(lat, lng) {
  return getBackgroundFromTemperature(currentColorSource == COLOR_SOURCE.LAT ?
    lat :
    kriging.predict(lng, lat, variogram));
}

map.addLayer( new L.SmoothHeatmapLayer({ getColorForLatLng }) );
