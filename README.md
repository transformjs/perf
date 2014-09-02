# perf

performance entries compess and uncompress util

## Installation

    npm install transform-perf

## Usage

In browser,

    var entries = window.performance.getEntries();
    TransformPerf.compess(entries);
    // send data to server

In NodeJS,

    var TransformPerf = require('transform-perf').TransformPerf;
    TransformPerf.uncompress(archive); // uncompress recived archive

## Benchmark

    ./benchmark/storage.js

## TODO

  * test

## License

MIT
