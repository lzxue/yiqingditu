import { Scene, LineLayer, PolygonLayer, PointLayer, Popup } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import chinagData from "./data/geo.json";
import data from './data/data.json';
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
  .source(chinageo,)
  .size(1)
  .shape("fill")
  .color("confirmed",(d)=>{
    return d > 10 ? '#800026' :
           d > 5  ? '#E31A1C' :
           d > 2  ? '#FD8D3C' :
           d > 0  ? '#FED976' :
                    'rgba(255,255,255,0.8)' ;
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
        <p><span>确诊: ${e.feature.properties.confirmed}</span> <span>疑似: ${e.feature.properties.suspected}</span><p>
        <p><span>治愈: ${e.feature.properties.cure}</span> <span>死亡: ${e.feature.properties.death}</span> </p>
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
  .active(true)
  .style({
    stroke: "#ffffff", // 描边颜色
    strokeWidth: 1.0, // 描边宽度
    strokeOpacity: 1.0
  });

scene.addLayer(china);
scene.addLayer(chinaline);
scene.addLayer(pointLayer);

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