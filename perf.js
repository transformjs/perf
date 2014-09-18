/**
 * PerformanceResourceTimeing compress and uncompress util.
 * @see http://www.w3.org/TR/resource-timing/
 */
(function() {
    'use strict';

    var global = typeof exports === 'undefined' ? window : exports;

    function isArray(arr) {
        return typeof arr === 'object' && arr.length !== undefined;
    }

    global.TransformPerf = global.TranPerf = {
        compress: function(entries) {
            var urlPattern = new RegExp('^([^:]+)://([^/]+)(.+)$');
            var timings = global.TranPerf.timings;
            var archive = {};

            for (var i=0; i<entries.length; i++) {
                seed(carve(archive, split(entries[i].name)), entries[i]);
            }

            return archive;

            function split(urlStr) {
                var match = urlPattern.exec(urlStr);
                return {
                    protocol: match[1],
                    host: match[2],
                    paths: match[3]
                        .split('/')
                        .filter(function(s) { return s.length; })
                };
            }

            function carve(archive, url) {
                var cur, path;
                archive[url.protocol] = archive[url.protocol] || {};
                cur =
                    archive[url.protocol][url.host] =
                    archive[url.protocol][url.host] || {};
                while (url.paths.length) {
                    path = url.paths.shift();
                    cur = cur[path] = cur[path] || {};
                }
                return cur;
            }

            function seed(mount, entry) {
                mount.$$ || (mount.$$ = []);

                var item = {};
                mount.$$.push(item);

                item.timings = [];
                for (var index in timings) {
                    item.timings[index] = Math.round(entry[timings[index]]);
                }
                for (var key in entry) {
                    if (key !== 'name' && !~timings.indexOf(key)) {
                        item[key] = entry[key];
                    }
                }
                return item;
            }
        },

        uncompress: function(archive) {
            var timings = global.TranPerf.timings;

            return walk([], archive, []);

            function join(parts) {
                var urlStr = parts[0] + '://';
                urlStr += parts.slice(1).join('/');
                return  urlStr;
            }

            function walk(entries, archive, parts) {
                var entry, newParts;
                for (var part in archive) {
                    if (part === '$$' && isArray(archive.$$)) {
                        for (var i=0; i<archive.$$.length; i++) {
                            entry = {};
                            entry.name = join(parts);
                            collect(archive.$$[i], entry);
                            entries.push(entry);
                        }
                    } else {
                        newParts = parts.slice();
                        newParts.push(part);
                        walk(entries, archive[part], newParts);
                    }
                }
                return entries;
            }

            function collect(item, entry) {
                for (var index in timings) {
                    entry[timings[index]] = item.timings[index];
                }
                delete item.timings;
                for (var key in item) {
                    entry[key] = item[key];
                }
                return entry;
            }
        },

        getTimingNames: function() {
            return global.TranPerf.timings;
        },

        timings: [
            'startTime',
            'redirectStart',
            'redirectEnd',
            'fetchStart',
            'domainLookupStart',
            'domainLookupEnd',
            'connectStart',
            'secureConnectionStart',
            'connectEnd',
            'requestStart',
            'responseStart',
            'responseEnd',
            'duration'
        ]
    };
}());
