# perf

[![Build Status](https://travis-ci.org/transformjs/perf.svg?branch=master)](https://travis-ci.org/transformjs/perf)

performance entries compess and uncompress util

## Installation

As node package

    npm install tran-perf

As bower package

    bower install tran-perf

## Usage

In browser,

    var entries = window.performance.getEntries();
    TranPerf.compess(entries);
    // send data to server

In NodeJS,

    var TranPerf = require('tran-perf').TranPerf;
    TranPerf.uncompress(archive); // uncompress recived archive

## Benchmark

    ./benchmark/storage.js

Result:

    bower.io
    Original 3380 Compressed 1344
    Compress ratio 2.5148809523809526

    cattail.me
    Original 3022 Compressed 1121
    Compress ratio 2.695807314897413

    github.com
    Original 3103 Compressed 1054
    Compress ratio 2.944022770398482

    npmjs.org
    Original 11165 Compressed 3902
    Compress ratio 2.861353152229626

    wikipedia.org
    Original 7747 Compressed 2839
    Compress ratio 2.728777738640366

    www.google.com
    Original 4123 Compressed 2019
    Compress ratio 2.04210004952947

## TODO

  * refact code for better test

## License

MIT
