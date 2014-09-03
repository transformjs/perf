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

Result:

    bower.io
    Original 3380 Compressed 1274
    Compress ratio 2.6530612244897958

    cattail.me
    Original 3022 Compressed 1061
    Compress ratio 2.8482563619227146

    github.com
    Original 3103 Compressed 994
    Compress ratio 3.1217303822937628

    npmjs.org
    Original 11165 Compressed 3682
    Compress ratio 3.032319391634981

    wikipedia.org
    Original 7747 Compressed 2659
    Compress ratio 2.9135013162843175

    www.google.com
    Original 4123 Compressed 1949
    Compress ratio 2.1154438173422268

## TODO

  * test

## License

MIT
