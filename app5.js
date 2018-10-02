function loadMap() {
  var map = new Datamap({
    element: document.getElementById('container'),
    scope: 'usa',
    responsive: true,
    geographyConfig: {
      popupOnHover: false,
      highlightOnHover: false
    },
    bubblesConfig: {
      popupTemplate: false
    },
    fills: {
      'state1': '#f1f1f1',
      'light-grey': '#ecedee',
      'defaultBubble': '#333',
      'state': '#333',
      'light-grey': '#ecedee',
      defaultFill: '#f1f1f1' // '#ECEDEE'
    },
    done: function(datamap) {
      datamap.svg.call(d3.behavior.zoom().on("zoom", redraw));
      function redraw() {
        datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      }
    }
  });

  // Add zoom in/out listener (scroll mouse wheel)
  d3.select(window).on('resize', function() {
    map.resize();
  });

  mapLabels(map);
  addArchs(map);
}

function mapLabels(map) {
  map.labels({
    labelColor: '#888',
    fontSize: 16
  });
}


function addArchs(map) {


  map.arc([
  {
      origin: {
          latitude: 39.9612,
          longitude: -82.9988
      },
      destination: {
          latitude: 37.618889,
          longitude: -122.375
      }
  },
  {
      origin: {
          latitude: 39.9612,
          longitude: -82.9988
      },
      destination: {
          latitude: 46.559,
          longitude: -100.375
      }
  },
  {
      origin: {
          latitude: 39.9612,
          longitude: -82.9988
      },
      destination: {
          latitude: 33.61349,
          longitude: -110.123456
      }
  },
  {
      origin: {
        latitude: 39.9612,
        longitude: -82.9988
      },
      destination: {
          latitude: 25.793333,
          longitude: -80.290556
      },
      options: {
        strokeWidth: 6,
        strokeColor: 'rgba(100, 10, 200, 0.8)',
        greatArc: true
      }
  },
],  {strokeWidth: 1, arcSharpness: 0.1});
}
