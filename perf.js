/**
 * PerformanceResourceTimeing compress and uncompress util.
 * @see http://www.w3.org/TR/resource-timing/
 */
var global = typeof exports === 'undefined' ? window : exports;

global.TransformPerf = {
    compress: function(entries) {
        var urlPattern = new RegExp('^([^:]+)://([^/]+)(.+)$');
        var timings = global.TransformPerf.timings;
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

        function seed(item, entry) {
            item.timings = [];
            for (var index in timings) {
                item.timings[index] = Math.round(entry[timings[index]]);
                delete entry[timings[index]];
            }
            for (var key in entry) {
                if (key !== 'name') {
                    item[key] = entry[key];
                }
            }
            return item;
        }
    },

    uncompress: function(archive) {
        var timings = global.TransformPerf.timings;

        return walk([], archive, []);

        function join(parts) {
            var urlStr = parts[0] + '://';
            urlStr += parts.slice(1).join('/');
            return  urlStr;
        }

        function walk(entries, archive, parts) {
            var entry;
            if (typeof archive.timings === 'object') {
                entry = {};
                entry.name = join(parts);
                collect(archive, entry);
                entries.push(entry);
            } else {
                var newParts;
                for (var part in archive) {
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

    timings: [
        "startTime",
        "redirectStart",
        "redirectEnd",
        "fetchStart",
        "domainLookupStart",
        "domainLookupEnd",
        "connectStart",
        "secureConnectionStart",
        "connectEnd",
        "requestStart",
        "responseStart",
        "responseEnd",
        "duration"
    ]
};
