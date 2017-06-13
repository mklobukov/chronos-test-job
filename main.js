let counter = 0

var startTime = Date.now();
while ((Date.now() - startTime) < 60000) {
  console.log(counter);
  counter += 1
}
