function loadMap() {
  map = new Datamap({
    element: document.getElementById('container'),
    scope: 'usa',
    responsive: true,
    geographyConfig: {
      popupOnHover: false,
      highlightOnHover: false
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

  var bombs;
  d3.csv('data/2013 Geographric Coordinate Spreadsheet for U S  Farmers  Markets .csv', function(rows) {
    bombs = rows;
    setupBubbles(bombs);
    mapBubbles(map,bombs);
    mapLabels(map);
    addMapClick(map);
    addListeners();
  });
}

function setupBubbles(bombs) {
  for(var i = 0; i < bombs.length; i++){
    bombs[i].radius = 1;
    bombs[i].borderColor = 'defaultBubble';
    bombs[i].borderWidth = 1;
    bombs[i].fillKey     = 'defaultBubble';
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

function addListeners() {
  d3.select('#gimmeColors').on('click', function(d){
    setNewColors();
  });
  d3.select('#clearColors').on('click', function(d){
    clearColors();
  });
}

function getStates() {
  return ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA',  'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];
}

function setNewColors() {
  var states =  getStates();
  var statesMap = {};
  states.forEach(function(d) {
    statesMap[d] =  getBlueOrRed();
  });
  map.updateChoropleth(statesMap);
}

function clearColors() {
  var states =  getStates();
  var statesMap = {};
  states.forEach(function(d) {
    statesMap[d] =  '#f1f1f1';
  });
  map.updateChoropleth(statesMap);
}

function getBlueOrRed() {
  return Math.random() > 0.75 ? 'blue' : 'red';
}
