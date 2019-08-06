/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 *
 * Autokin - Measure
 */
class Measure {

    constructor() {
        this.measurements = {};
    }

    get(domain, path) {
        let dom = this.measurements[domain];
        if (!dom) {
            dom = this.measurements[domain] = {};
        }
        let dompath = dom[path];
        if (!dompath) {
            dompath = this.measurements[domain][path] = {
                count: 0,
                time: []
            };
        }

        return dompath;
    }

    set(domain, path, value) {
        this.measurements[domain][path] = value;
    }

    add(response) {
        const { host, pathname } = response.request.uri;
        let m = this.get(host, pathname);
        m.count += 1;
        m.time.push({
            status: response.statusCode,
            timings: response.timingPhases
        });

        // Max / Min / Avg / Error Rate
        let tt = m.time.map(n => n.timings.total);
        m.min = Math.min.apply(null, tt);
        m.max = Math.max.apply(null, tt);
        let avg = tt.reduce((prev, current) => current += prev);
        m.avg = avg / m.count;
        let errors = m.time.filter(t => t.status >= 400);
        m.errors = ((errors.length / m.count) * 100);

        this.set(host, pathname, m);
    }

    stats() {
        return this.measurements;
    }
}

module.exports = new Measure();