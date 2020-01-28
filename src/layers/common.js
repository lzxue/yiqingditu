import { LineLayer, PolygonLayer, PointLayer, Control } from "@antv/l7";
const colors= ['rgb(106,33,29)','rgb(144,55,53)','rgb(181,78,76)','rgb(211,104,101)','rgb(227,147,131)','rgba(255,255,255,0.8)'].reverse();
// const colors = ['#73181B', '#E04B49', '#F08E7E', 'rgba(255,255,255,0.8)'].reverse();
export function addLayerGroup(scene, data, dataPoint) {
  const china = new PolygonLayer({
    autoFit: true
  })
    .source(data)
    .size(1)
    .shape("fill")
    .color('red')
    .color("confirm", (d) => {
      return d > 1000 ? colors[5] :
      d > 499 ? colors[4] :
       d > 100 ? colors[3] :
        d > 10 ? colors[2] :
          d > 0 ? colors[1] :
            colors[0];
    })
    .style({
      opacity: 1
    });

  china.on('mousemove', e => {
    const info = scene.getControlByName('infoControl');
    info.update(e.feature);
    console.log(info);
    // const popup = new Popup({
    //   offsets: [0, 0],
    //   closeButton: true
    // })
    //   .setLnglat(e.lngLat)
    //   .setHTML(`
    //      <div class = info>
    //     <h4>${e.feature.properties.name}</h4>
    //     <p><span>确诊: ${e.feature.properties.confirm}</span> <span>疑似: ${e.feature.properties.suspect}</span><p>
    //     <p><span>治愈: ${e.feature.properties.heal}</span> <span>死亡: ${e.feature.properties.dead}</span> </p>
    //     </div>
    //     `);
    // scene.addPopup(popup);
    // const {adcode, cities} = e.feature.properties; 

  });
  const chinaline = new LineLayer({})
    .source(data)
    .size(0.5)
    .shape("line")
    .color("#222")
    .style({
      opacity: 1
    });
  const pointLayer = new PointLayer({})
    .source(dataPoint, {
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
      textAllowOverlap: false
    });

  scene.addLayer(china);
  scene.addLayer(chinaline);
  scene.addLayer(pointLayer);
  return [china, chinaline, pointLayer];
}

export function addLegend() {

  const legend = new Control({
    position: 'bottomright'
  });
  legend.onAdd = function () {
    var el = document.createElement('div');
    el.className = 'infolegend legend';
    var grades = [0, 1, 10, 100,500,1000];
    el.innerHTML += '<h4>图例</h4><span>确诊数</span><br>'
    for (var i = 0; i < grades.length; i++) {
      el.innerHTML += '<i style="background:' + colors[i] + '"></i> ' + grades[i] + (grades[i + 1] ? '–' + grades[i + 1] + '<br>' : '+');
    }
    return el;
  };
  return legend;
}

export function addInfoControl() {
  const info = new Control({
    position: 'topright',
    name: 'infoControl',
  });
  info.onAdd = function () {
    this._div = document.createElement('div');
    this.update();
    return this._div;
  };

  info.update = function (feature) {
    if (!feature) {
      return;

    }
    this._div.innerHTML = `<div class=info_control>
           <h4>${feature.properties.name}</h4>
          <p><span>确诊: ${feature.properties.confirm}</span> <span>疑似: ${feature.properties.suspect}</span><p>
          <p><span>治愈: ${feature.properties.heal}</span> <span>死亡: ${feature.properties.dead}</span> </p>
          <p style ='font-size: 8px;'>注：<I> 双击省份下钻到市级地图，双击空白处切换到省级地图</I> </p>
          </div>`;
  };
  return info;

}

export function mapInfoContol() {
  const info = new Control({
    position: 'bottomright',
  });
  info.onAdd = function () {
    const el = document.createElement('div');
    el.innerHTML = `<div class='mapinfo'>
      <span>数据来源：<a  target='_blank' href="https://github.com/BlankerL/DXY-2019-nCoV-Crawler">2019-nCov</a></span>
      <span>地图可视化库：<a  target='_blank' href="https://github.com/antvis/L7">AntV | L7</a></span>
      <span>源码：<a  target='_blank' href="https://github.com/lzxue/yiqingditu">疫情地图</a></span>
    </div>
    `
    return el;
  };

  return info

}