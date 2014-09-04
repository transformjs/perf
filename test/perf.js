'use strict';
/* global it */

var TransformPerf = require('../').TransformPerf,
    compress = TransformPerf.compress,
    uncompress = TransformPerf.uncompress,
    entries = require('./entries'),
    chai = require('chai'),
    expect = chai.expect;

describe('perf', function() {
    var timings = TransformPerf.getTimingNames();

    function findOne(archive) {
        if (typeof archive.timings === 'object') {
            return archive;
        } else {
            for (var path in archive) {
                return findOne(archive[path]);
            }
        }
    }

    describe('compress', function() {
        it('should reuse url path', function() {
            var archive = compress(entries);
            var protocols = [];
            for (var protocal in archive) {
                protocols.push(protocal);
            }
            expect(protocols.length).to.equal(1);
        });

        it('should store common timing value in single array', function() {
            var archive = findOne(compress(entries));
            expect(archive.timings).to.be.instanceOf(Array);
            expect(archive.timings.length).to.equal(timings.length);
        });

        it('should preserve misc values', function() {
            var archive = findOne(compress(entries));
            expect(archive.initiatorType).to.exist;
            expect(archive.entryType).to.exist;
        });
    });

    describe('uncompress', function() {
        var data = uncompress(compress(entries));
        var entry = data[0];

        it('should restore original url', function() {
            expect(entry.name).to.exist;
            expect(entry.name).to.match(new RegExp('^[^:]+://.+$'));
        });

        it('should restore timing values', function() {
            for (var key in timings) {
                expect([entry[key]]).to.exist;
            }
        });

        it('should restore misc values', function() {
            expect(entry.initiatorType).to.exist;
            expect(entry.entryType).to.exist;
        });
    });
});
