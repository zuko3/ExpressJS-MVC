const path = require("path");
console.log("Path name:",path.dirname(process.mainModule.filename));
console.log("filename:",process.mainModule.filename)
module.exports = path.dirname(process.mainModule.filename)