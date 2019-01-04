/**
 * Determine project root from a running node.js application
 */
const path = require('path');
module.exports = path.dirname(process.mainModule.filename);