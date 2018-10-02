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

  addArchs(map);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomOriginDestination() {
  return {
      origin: {
          latitude: 39.9612,
          longitude: -82.9988
      },
      destination: {
        latitude: getRandomArbitrary(24.7433195, 49.3457868),
        longitude: getRandomArbitrary(-66.9513812, -124.7844079)
      }
  }
}

function addArchs(map) {
  var archs = []
  for (var i = 0; i < 100; i++) {
    archs.push(getRandomOriginDestination());
  }
  map.arc(archs,  {strokeWidth: 1, arcSharpness: .1});
}
