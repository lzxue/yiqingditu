var china =require('./china');
var fs = require('fs');
china.features = china.features.map(element => {
  console.log(`curl https://geo.datav.aliyun.com/areas/bound/${element.properties.adcode}_full.json > ${element.properties.adcode}.json`)
  return {
    "type":"Feature",
    "properties":{
      name: element.properties.name,
      adcode: element.properties.adcode

    },
    "geometry": element.geometry,
  }
});


