import { Scene } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import chinagData from "./data/geo.json";
import { addLegend, addInfoControl, mapInfoContol} from './layers/common'
import ProvinceNcovLayer from './layers/province';
import dataPoint from './data/data.json';

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
scene.addControl(mapInfoContol())
scene.addControl(addLegend());
scene.addControl(addInfoControl());
scene.on('loaded',()=>{
  getNcovData().then((ncovData=>{
    const chinageo = joinData(chinagData, ncovData)
    new ProvinceNcovLayer(scene, chinageo, dataPoint);
  }))

})


function joinData(geo, data) {
  const dataObj = {};
  data.forEach(item => {
    dataObj[item.name] = item;
  });
  geo.features = geo.features.map(item => {
    const name = item.properties.name;
    item.properties ={
      ...item.properties,
      ...dataObj[name]
    }
    return item
  })
  return geo;
}



/**
 * 获取疫情信息
 */
async function getNcovData() {
  // //lab.isaaclin.cn/nCoV/api/area
  const url = 'https://service-0gg71fu4-1252957949.gz.apigw.tencentcs.com/release/dingxiangyuan';
  const data = await (await fetch(url)).json();

  const provinceData = [];
  for (let i = 0; i < data.data.getAreaStat.length; i++) {
    const item = data.data.getAreaStat[i];
    // if (item.country === '中国') {
      const cities = item.cities;

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
  return provinceData;

}