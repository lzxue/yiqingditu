import { Scene, Layers } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import chinagData from "./data/geo.json";
import world from "./data/world.json";
import { addLegend, addInfoControl, mapInfoContol, joinData, addLayerGroup, addLayerControl} from './layers/common'
import ProvinceNcovLayer from './layers/province';
import dataPoint from './data/data.json';
// import worldPoint from './data/world_point.json';

const scene = new Scene({
  id: "map",
  map: new GaodeMap({
    center: [112.3956, 34.9392],
    doubleClickZoom:false,
    pitch: 0,
    zoom: 4,
    rotation: 0,
    style: "dark"
  })
});
scene.addControl(mapInfoContol())
scene.addControl(addLegend());
scene.addControl(addInfoControl());

scene.on('loaded',()=>{
  getNcovData().then((ncovData=>{
    // const world_Point = Object.keys(worldPoint).map((country)=>{
    //   return {
    //     name: country,
    //     center:worldPoint[country],
    //   }
    // })
    const chinageo = joinData(chinagData, ncovData[0]);
    const worldGeo = joinData(world, ncovData[1]);
    // const layers = addLayerGroup(scene, worldGeo, []);
    new ProvinceNcovLayer(scene, chinageo, dataPoint);
    // const overLayer = {
    //   '世界地图': layers[0],
    //   '世界地图边界':layers[1],
    // }
  //  scene.addControl(addLayerControl(overLayer))
    
  }))

})


/**
 * 获取疫情信息
 */
async function getNcovData() {
  // //lab.isaaclin.cn/nCoV/api/area
  const url = 'https://service-0gg71fu4-1252957949.gz.apigw.tencentcs.com/release/dingxiangyuan';
  const data = await (await fetch(url)).json();

  const provinceData = [];
  const china = {
    name: '中国',
    confirm: 0,
    suspect: 0,
    heal: 0,
    dead: 0
  }
  for (let i = 0; i < data.data.getAreaStat.length; i++) {
    const item = data.data.getAreaStat[i];
    // if (item.country === '中国') {
      
      const cities = item.cities;
      china.confirm+=item.confirmedCount;
      china.suspect+=item.suspectedCount;
      china.heal+=item.curedCount;
      china.dead+=item.deadCount;

      provinceData.push({
        name: item.provinceShortName,
        confirm: item.confirmedCount,
        suspect: item.suspectedCount,
        heal: item.curedCount,
        dead: item.deadCount,
        cities: cities.map(city=>{
          return {
            name: city.cityName,
            confirm: city.confirmedCount,
            suspect: city.suspectedCount,
            heal: city.curedCount,
            dead: city.deadCount,
          }
        })
      });
    // }

  }

  // worldData
  const worldData = [china]
  for (let i = 0; i < data.data.getListByCountryTypeService2.length; i++) {
    const item = data.data.getListByCountryTypeService2[i];
      china.confirm+=item.confirmedCount;
      china.suspect+=item.suspectedCount;
      china.heal+=item.curedCount;
      china.dead+=item.deadCount;

      worldData.push({
        name: item.provinceName,
        confirm: item.confirmedCount,
        suspect: item.suspectedCount,
        heal: item.curedCount,
        dead: item.deadCount,
      });

  }
  
  return [provinceData, worldData];

}

