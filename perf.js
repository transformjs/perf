/**
 * PerformanceResourceTimeing compress and uncompress util.
 * @see http://www.w3.org/TR/resource-timing/
 */
var global = typeof exports === 'undefined' ? window : exports;

global.TransformPerf = {
    compress: function(entries) {
        var urlPattern = new RegExp('^([^:]+)://([^/]+)(.+)$');
        var timings = this.timings;
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
            item.initiatorType = entry.initiatorType;
            item.entryType = entry.entryType;
            item.timing = [];
            for (var index in timings) {
                item.timing[index] = Math.round(entry[timings[index]]);
            }
            return item;
        }
    },

    uncompress: function(archive) {
        var timings = this.timings;

        return walk([], archive, []);

        function join(parts) {
            var urlStr = parts[0] + '://';
            urlStr += parts.slice(1).join('/');
            return  urlStr;
        }

        function walk(entries, archive, parts) {
            if (typeof archive.timing === 'object') {
                archive.name = join(parts);
                collect(archive, archive);
                entries.push(archive);
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
            entry.initiatorType = item.initiatorType;
            entry.entryType = item.entryType;
            // restore entry name
            entry.name = item.name;
            for (var index in timings) {
                entry[timings[index]] = item.timing[index];
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
