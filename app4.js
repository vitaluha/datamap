function loadMap() {
  var bubble_map = new Datamap({
    element: document.getElementById('container'),
    scope: 'india',
    geographyConfig: {
      popupOnHover: false,
      highlightOnHover: true,
      borderColor: '#444',
      borderWidth: 0.5,
      dataUrl: 'maps/india.topo.json'
      //dataJson: topoJsonData
    },
    fills: {
      'MAJOR': '#306596',
      'MEDIUM': '#0fa0fa',
      'MINOR': '#bada55',
      defaultFill: '#dddddd'
    },
    data: {
      'JH': { fillKey: 'MINOR' },
      'MH': { fillKey: 'MINOR' }
    },
    setProjection: function (element) {
      var projection = d3.geo.mercator()
      .center([78.9629, 23.5937]) // always in [East Latitude, North Longitude]
      .scale(1000);
      var path = d3.geo.path().projection(projection);
      return { path: path, projection: projection };
    }
  });
  setTimeout(function() {
    d3.select('#container svg').attr('height', '1024')
  }, 500)

}
