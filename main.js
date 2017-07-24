const ChronosSDK = require('chronos-sdk');

const Config = {
  "authManagerURL": "https://st-irisauth-wcdcc-002.poc.sys.comcast.net",
  "chronosURL": "https://st-chronos-asb-001.poc.sys.comcast.net",
  "appkey": "",
  "appsecret": ""
}

let chronos = new ChronosSDK.Chronos(Config);
const instanceID = chronos.getShortInstanceID()

let counter = 0;
let timeout;

function *reportJobStatus(){
  var startTime = Date.now();
  while ((Date.now() - startTime) < 60000) {
    yield chronos.updateJobStatus(instanceID, `Counter=${counter}`);
  }
}

function runJob(generator) {
  if (!generator) {
    generator = reportJobStatus();
  }

  let j = generator.next();
  if (j.value === undefined) {
    return;
  }
  j.value.then(() => {
    console.log(`Counter=${counter}`);
    counter += 1;
    runJob(generator);
  })
  .catch(err => {
    console.log(err);
  });
}

runJob();
