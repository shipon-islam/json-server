const path=require("path");
const fs=require("fs")
let jsonObject={}
fs.readdirSync("./model").forEach(file => { 
  const readData=fs.readFileSync(`./model/${file}`,'utf8');
  const parseData=JSON.parse(readData)
const keys=file.split(".")[0]

jsonObject[keys]=parseData

  
  
});
module.exports=jsonObject
