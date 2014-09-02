#! /usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    TransformPerf = require('../perf').TransformPerf;

var dir = path.join(__dirname, 'data');
fs.readdirSync(dir).forEach(function(filename) {
    var entries = require(path.join(dir, filename));
    var entriesLen = JSON.stringify(entries).length;
    var archive = TransformPerf.compress(entries);
    var archiveLen = JSON.stringify(archive).length;
    console.log(path.basename(filename, path.extname(filename)));
    console.log('Original', entriesLen, 'Compressed', archiveLen);
    console.log('Compress ratio', entriesLen / archiveLen, '\n');
});
