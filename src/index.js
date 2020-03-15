import { Scene, Layers } from "@antv/l7";
import { Mapbox } from "@antv/l7-maps";
import chinagData from "./data/geo.json";
import { addLegend, addInfoControl, mapInfoContol, joinData, addLayerGroup, addLayerControl} from './layers/common'
import ProvinceNcovLayer from './layers/province';
import dataPoint from './data/data.json';
// import worldPoint from './data/world_point.json';

const scene = new Scene({
  id: "map",
  map: new Mapbox({
    center: [112.3956, 34.9392],
    doubleClickZoom:false,
    pitch: 0,
    zoom: 4,
    rotation: 0,
    style: "blank"
  })
});
scene.addControl(mapInfoContol())
scene.addControl(addLegend());
scene.addControl(addInfoControl());

scene.on('loaded',()=>{
  getNcovData().then((ncovData=>{
    const chinageo = joinData(chinagData, ncovData[0]);
    new ProvinceNcovLayer(scene, chinageo, dataPoint);
  }))

})


/**
 * 获取疫情信息
 */
async function getNcovData() {
  // //lab.isaaclin.cn/nCoV/api/area
  const url = 'https://lab.isaaclin.cn/nCoV/api/area?latest=1';
  const data = await (await fetch(url)).json();

  const provinceData = [];
  const china = {
    name: '中国',
    confirm: 0,
    suspect: 0,
    heal: 0,
    dead: 0
  }
  for (let i = 0; i < data.results.length; i++) {
    const item = data.results[i];
    if (item.countryName === '中国') {
      
      const cities = item.cities || [];
      china.confirm+=item.confirmedCount;
      china.suspect+=item.suspectedCount;
      china.heal+=item.curedCount;
      china.dead+=item.deadCount;

      provinceData.push({
        name: item.provinceShortName,
        currentConfirmedCount:item.currentConfirmedCount,
        confirm: item.confirmedCount,
        suspect: item.suspectedCount,
        heal: item.curedCount,
        dead: item.deadCount,
        cities: cities.map(city=>{
          return {
            name: city.cityName,
            confirm: city.confirmedCount,
            currentConfirmedCount: city.currentConfirmedCount,
            suspect: city.suspectedCount,
            heal: city.curedCount,
            dead: city.deadCount,
          }
        })
      });
    }

  }

  return [provinceData];

}

