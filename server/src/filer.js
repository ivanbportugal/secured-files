'use strict';

const baseFilesDir = process.env.BASE_FILES_DIR || __dirname;

const fs = require("fs");
const path = require("path");

async function getFileList(ctx) {

  // get all files first
  let allFiles = getAllFiles(baseFilesDir);

  // convert to relative
  allFiles = allFiles.map(file => {
    const finalFile = file.substring(file.indexOf(baseFilesDir) + baseFilesDir.length);
    return finalFile;
  }).filter(file => {
    return file.endsWith('mp4') || file.endsWith('jpg');
  });

  ctx.status = 200;
  ctx.body = {
    files: allFiles
  };
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
 
  arrayOfFiles = arrayOfFiles || []
 
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
    }
  })
 
  return arrayOfFiles;
}

async function getFile(ctx) {
  const fileName = ctx.query.name;

  const toReturn = baseFilesDir + fileName;

  ctx.set('Content-disposition', `attachment; filename=${fileName}`);
  ctx.statusCode = 200;
  ctx.body = fs.createReadStream(toReturn);
}

module.exports.getFileList = getFileList;
module.exports.getFile = getFile;