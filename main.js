const ChronosSDK = require('chronos-sdk');

// const Config = {
//   "authManagerURL": "https://st-irisauth-wcdcc-002.poc.sys.comcast.net",
//   "chronosURL": "https://st-chronos-asb-001.poc.sys.comcast.net",
//   "appkey": "",
//   "appsecret": ""
// }

const Config = {
  "authManagerURL": "http://localhost:4655",
  "chronosURL": "http://localhost:8080",
  "appkey": "",
  "appsecret": ""
}

let chronos = new ChronosSDK.Chronos(Config);
//const instanceID = chronos.getShortInstanceID()
const instanceID = "localtest"
console.log("instanceID: ", instanceID)
let counter = 0;
let timeout;

function *reportJobStatus(){
  var startTime = Date.now();
  while ((Date.now() - startTime) < 2000) {
    yield chronos.updateJobStatus(instanceID, `Counter=${counter}`);
  }
}

function runJob(generator) {
  if (!generator) {
    generator = reportJobStatus();
  }

  let j = generator.next();
  if (j.value === undefined) {
    //get arguments and display them before exiting
    //replace this test ID with any instanceID from your mongoDB entries
    let testInstanceID = "e747d9cd4cfb713a9f912405c4f02770b610aecb61918e0bae53c32195d47425"
    chronos.getJobArgs(testInstanceID)
    .then(response => {
      console.log("Got arguments: ", response)
    })
    .catch(error => {
      console.log("Error getting arguments: ", error)
    })
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
