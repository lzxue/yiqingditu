var urllib = require('urllib');
var geodata = require('../data/data.json');
var fs = require('fs');

getAreaCounts().then(data=>{
  parseNcovData(data);
  // const province = GroupByArea(data);
  // const res = joinProvinceData(province);
  groupByCity(data)
  // fs.writeFileSync('../data/newdata.json',JSON.stringify(res))
});

async function getAreaCounts() {
  const res = await  urllib.request('https://view.inews.qq.com/g2/getOnsInfo?name=wuwei_ww_area_counts', {
      method: 'GET',
      headers: {
        'accept': 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36'
      },
    }).catch(err => [err, null]);
    
    const ncovData = eval(JSON.parse(res.data.toString()).data);
    return ncovData;
}
function parseNcovData(data) {
  fs.writeFileSync('result.json',JSON.stringify(data))
}

function GroupByArea(data) {
  const areaObj = {};
  data.forEach(element => {
    const { area, confirm, suspect, dead, heal, country } = element;
    if(country!=='中国')
     return;

    if(!areaObj[area]) {
      areaObj[area] ={
        "confirm":confirm,
        "suspect":suspect,
        "dead":dead,
        "heal":heal
      }
    } else {
      areaObj[area]['confirm']+= confirm;
      areaObj[area]['suspect']+= suspect;
      areaObj[area]['dead']+= dead;
      areaObj[area]['heal']+= heal;
    }
  });
  return areaObj;
}

function groupByCity(data) {
  const cityObj = {};
  data.forEach(element => {
    const {  city , area} = element;
    console.log(area,city)
    cityObj[city] = element;
  })
  return cityObj;
};

function joinProvinceData(province) {
  return geodata.map(item =>{
     return {
       ...item,
       ...province[item.name]
     }
  })

}