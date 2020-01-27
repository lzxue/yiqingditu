import { Scene, LineLayer, PolygonLayer, PointLayer, Popup, Control } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import chinagData from "./data/geo.json";
import data from './data/newdata.json';
const colors =  ['#73181B','#E04B49','#F08E7E','rgba(255,255,255,0.8)'].reverse();
const scene = new Scene({
  id: "map",
  map: new GaodeMap({
    center: [112.3956, 34.9392],
    pitch: 0,
    zoom: 4,
    rotation: 0,
    style: "dark"
  })
});
const chinageo = joinData(chinagData, data)
const china = new PolygonLayer()
  .source(chinageo)
  .size(1)
  .shape("fill")
  .color('red')
  .color("confirm",(d)=>{
    return d > 100 ?  colors[3] :
           d > 10  ?  colors[2] :
           d > 0  ?  colors[1] :
           colors[0] ;
  })
  .style({
    opacity: 1
  });

  china.on('click', e => {
    const popup = new Popup({
      offsets: [ 0, 0 ],
      closeButton: false
    })
      .setLnglat(e.lngLat)
      .setHTML(`
         <div class = info>
        <h4>${e.feature.properties.name}</h4>
        <p><span>确诊: ${e.feature.properties.confirm}</span> <span>疑似: ${e.feature.properties.suspect}</span><p>
        <p><span>治愈: ${e.feature.properties.heal}</span> <span>死亡: ${e.feature.properties.dead}</span> </p>
        </div>
        `);
    scene.addPopup(popup);
  });
const chinaline = new LineLayer({})
  .source(chinageo)
  .size(0.5)
  .shape("line")
  .color("#222")
  .style({
    opacity: 1
  });
const pointLayer = new PointLayer({})
  .source(data, {
    parser: {
      type: "json",
      coordinates: "center"
    }
  })
  .shape("name", "text")
  .size(12)
  .color("#fff")
  .style({
    stroke: "#ffffff", // 描边颜色
    strokeWidth: 1.0, // 描边宽度
    strokeOpacity: 1.0,
    textAllowOverlap: true
  });

scene.addLayer(china);
scene.addLayer(chinaline);
scene.addLayer(pointLayer);
const legend = addLegend();
scene.addControl(legend);

function joinData(geo, data) {
  const dataObj = {};
  data.forEach(item => {
    dataObj[item.name] = item;
  });
  geo.features = geo.features.map(item=>{
    const name = item.properties.name;
    item.properties = dataObj[name];
    return item
  })
  return geo;
}

function addLegend() {

  const legend = new Control({
    position: 'bottomright'
  });
  legend.onAdd = function() {
    var el = document.createElement('div');
    el.className = 'infolegend legend';
    var grades = [0, 1, 10, 100];
    el.innerHTML+='<h4>图例</h4><span>确诊数</span><br>'
    for (var i = 0; i < grades.length; i++) {
      el.innerHTML += '<i style="background:' + colors[i] + '"></i> ' + grades[i] + (grades[i + 1] ? '–' + grades[i + 1] + '<br>' : '+');
    }
    return el;
  };
  return legend;
}
