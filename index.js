const { nextISSTimesForMyLocation } = require('./iss');

const printPassTimes = function(time) {
  for (const pass of time) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work to give next ISS time at my location", error);
  }
  printPassTimes(passTimes);
});