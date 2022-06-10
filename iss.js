/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require('request');
const fetchMyIP = function(callback) {
  const url = "https://api.ipify.org?formatjsonp&";
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, body);
  });
  // use request to fetch IP address from JSON API
};

const fetchCoordsByIP = function(ip, callback) {
  const url = `https://api.ipbase.com/v1/json/${ip}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coords. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const { latitude, longitude } = JSON.parse(body);
    callback(null, { latitude, longitude });
  });

};

const fetchISSFlyOverTimes = function(coords, callback) {
  const { latitude, longitude } = coords;
  const url = `https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const obj = JSON.parse(body);
    callback(null, obj.response);
  });
};
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work to fetchMyIP!", error);
      return error;
    }
    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        console.log("It didn't work to fetch the coords!", error);
        return;
      }
      fetchISSFlyOverTimes(data, (error, times) => {
        if (error) {
          console.log("It didn't work to fetch the times", error);
          return;
        }
        callback(error, times);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };