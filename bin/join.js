var fs = require('fs');
var data = require('../src/data/data.json');
const lines = fs.readFileSync('./bin/raw.txt').toString().split('\n').filter((line)=>{
  return line!=='';
});
const cityObj = {}

lines.forEach(line=>{
  const city = line.split(' ')[0];
  cityObj[city] = {
  confirmed:getCountByType(line,'确诊') ,
  suspected:getCountByType(line,'疑似'),
  death:getCountByType(line,'治愈'),
  cure:getCountByType(line,'死亡'),
}
})

data.forEach(city=>{
  if(cityObj[city.name]) {
    city.confirmed = cityObj[city.name].confirmed;
    city.suspected = cityObj[city.name].suspected;
    city.death = cityObj[city.name].death;
    city.cure = cityObj[city.name].cure;

  } else {
    city.confirmed = 0;
    city.suspected = 0;
    city.death = 0;
    city.cure = 0;
  }
})

fs.writeFileSync('./src/data/newdata.json',JSON.stringify(data))
function getCountByType(item, type) {
  const re = new RegExp(`${type}\\s+\\d+\\s*例`);
  const m = item.match(re);
  if(m === null) return 0;
  return m === null? 0 : m[0].split(' ')[1] * 1;
}