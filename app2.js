function loadMap() {
  var map = new Datamap({
    element: document.getElementById('container'),
    scope: 'usa',
    responsive: true,
    geographyConfig: {
      popupOnHover: false,
      highlightOnHover: false
    },
    fills: {
      'red': '#ff1500',
      'green': '#006700',
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

  var bombs;
  d3.csv('data/2013 Geographric Coordinate Spreadsheet for U S  Farmers  Markets .csv', function(rows) {
    bombs = rows;
    setupBubbles(bombs);
    mapBubbles(map,bombs);
    mapLabels(map);
    addMapClick(map);
  });
}

function setupBubbles(bombs) {
  for(var i = 0; i < bombs.length; i++){
    var radius = 1;
    var fillKey = 'defaultBubble';
    var borderWidth = 1;
    switch (bombs[i].Season1Date) {
      case "June to October":
        radius = 5;
        fillKey = 'red';
        borderWidth = 1;
        break;
      case "March to December":
        radius = 30;
        fillKey = 'green';
        borderWidth = 5;
        bombs[i].fillOpacity  = .2;
        break;
      default:
        radius = 1;
        fillKey = 'defaultBubble';
        borderWidth = 1;
    }
    bombs[i].radius = radius;
    bombs[i].borderColor = 'state';
    bombs[i].borderWidth = borderWidth;
    bombs[i].fillKey     = fillKey;
  }
}

function mapBubbles(map, bombs) {
  map.bubbles(bombs, {
    popupTemplate: function (geo, data) {
      var produce = '<div class="produce">';
      var j = 0;
      for (var property in data) {
        if (data.hasOwnProperty(property) && data[property] === 'Y') {
          j++;
          produce +=  '<div style="width: 160px; display: inline-block">' + property + '</div>';
          if(j % 4 === 0){
            produce += '<div></div>';
          }
        }
      }
      produce += '</div>';

      return [
        '<div class="hoverinfo">' +
          '<div class="market-name">' + data.MarketName + '</div>',
          '<br/>',
          '<p>Website: ' +  data.Website + '</p>',
          '<p>Address:' + data.street + ', ' + data.city + ', ' + data.State + ' ' + data.zip + '</p>',
          data.Location.length > 0 ? '<p class="light-grey">'+data.Location+'</p>' : '',
          '<p>Date: ' + data.Season1Date + '</p>',
          '<p>Time: ' + data.Season1Time + '</p>',
          '<p>Produce: ' + produce,
        '</div>'].join('');
      }
    });
}

function mapLabels(map) {
  map.labels({
    labelColor: '#888',
    fontSize: 16
  });
}

function addMapClick(map) {
  map.svg.selectAll('.datamaps-bubble').on('click', function(record) {
    var url = record.Website;
    var address = record.street + ', ' + record.city + ', ' + record.State + ' ' + record.zip;

    if(url && url.length > 0){
      window.open(record.Website, '_blank');
    } else {
      window.open('https://www.google.com/maps/place/' +  address, '_blank');
    }
  });
}
