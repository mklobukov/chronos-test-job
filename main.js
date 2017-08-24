const ChronosSDK = require('chronos-sdk');

const Config = {
  "authManagerURL": "https://st-irisauth-wcdcc-002.poc.sys.comcast.net",
  "chronosURL": "https://st-chronos-asb-001.poc.sys.comcast.net",
  "appkey": "",
  "appsecret": ""
}

let chronos = new ChronosSDK.Chronos(Config);

//replace this instanceID with an job_instance_id from your DB entries
//the special value "localtest" will cause Chronos to respond with
//status 400 - Bad Request instead of a 404
const instanceID = chronos.getShortInstanceID()
let counter = 0;

//get arguments from the the job with the given instance ID
//and initialize the counter value to the argument value
//In this example, assume the response looks like this:  {counterInit: 200}

chronos.getJobArgs(instanceID)
.then(response => {
  console.log("Got arguments: ", response)
  const parsedResponse = JSON.parse(response)
  counter = parsedResponse.counterInit !== undefined ? Number(parsedResponse.counterInit) : 0;
})
.catch(error => {
  console.log("Error getting arguments: ", error)
})

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
