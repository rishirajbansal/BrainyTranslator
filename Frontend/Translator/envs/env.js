/*
 * Licensed To: ThoughtExecution
 * Authored By: Rishi Raj Bansal
 * Developed in: December 2019
 *
*/

const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');


const NODE_ENV = process.env.NODE_ENV

const currentPath = path.resolve(__dirname);

//Default .env path
const envPath = currentPath + '/.env';

//Environment specific path
const envSpecificPath = envPath + '.' + NODE_ENV;

//Check if the file exists, otherwise fall back to the production .env
const finalPath = fs.existsSync(envSpecificPath) ? envSpecificPath : envPath;

//Set the path parameter (for global env file) in the dotenv config
const globalFileEnv = dotenv.config({
    path: envPath,
}).parsed;

//Set the path parameter (for env specific file) in the dotenv config
const envSpecificFileEnv = dotenv.config({
    path: finalPath,
}).parsed;

//concatenate all these variables together as well as include our NODE_ENV option in this object
//The Object.assign() method creates a new object and merges each object from right to left.
const consolidateFileEnv = Object.assign({}, {
    'NODE_ENV': NODE_ENV
}, globalFileEnv, envSpecificFileEnv);

//an object that puts these variables on process.env and ensures they are valid strings
const envKeys = Object.keys(consolidateFileEnv).reduce((name, key) => {
    name['process.env.' + key.toUpperCase()] = JSON.stringify(consolidateFileEnv[key]);
    return name;
}, {});


module.exports = {
    envKeys
};
