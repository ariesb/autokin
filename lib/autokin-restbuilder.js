/*
 * Copyright 2018 Aries Beltran <ariesbe@icloud.com>
 * Licensed under the MIT license. See LICENSE.
 * 
 * Autokin - RestBuilder
 */
const request = require('request');
const Utils = require('./utilities');
const jp = require('jsonpath');
const diff = require('deep-diff');

class Response {
    constructor(response) {
        this.resp = response;
    }

    hasHeader(name) {
        let headers = this.resp.headers;
        return (name.toLowerCase() in headers);
    }

    headerValue(name) {
        return this.resp.headers[name.toLowerCase()];
    }

    statusCode() {
        return this.resp.statusCode;
    }

    Body() {
        return new Body(this.resp.body);
    }
}

class Body {
    constructor(body) {
        this.body = body;
    }

    isJSON() {
        return Utils.isJSON(this.body);
    }

    asJSON() {
        return Utils.asJSON(this.body);
    }

    hasPath(path) {
        let data = jp.query(this.asJSON(), path);
        return data.length > 0;
    }

    pathValue(path) {
        let data = jp.value(this.asJSON(), path);
        return data;
    }

    isSameAs(docJSON) {
        let changes = diff(docJSON, this.asJSON());
        return changes == undefined;
    }
}

class RestBuilder {
    constructor() {
        this.storage = {};
        this.reqbody = {};
        this.cookiejar = request.jar();
        this.resp = new Response();
    }

    reset() {
        this.reqbody = {};
        this.cookiejar = request.jar();
        this.resp = null;
    }

    resolve(variable) {
        let data = this.storage[variable];
        return data;
    }

    host(domain, https = true) {
        this.reqbody.https = https;
        this.reqbody.domain = domain;
        return this;
    }

    header(name, value) {
        this.reqbody.headers = !this.reqbody.headers ? {} : this.reqbody.headers;
        this.reqbody.headers[name] = value;
        return this;
    }

    query(name, value) {
        this.reqbody.qs = !this.reqbody.qs ? {} : this.reqbody.qs;
        this.reqbody.qs[name] = value;
        return this;
    }

    body(body) {
        this.reqbody.body = body;
        return this;
    }

    cookie(cookie) {
        this.cookiejar.setCookie(request.cookie(cookie), this.reqbody.domain);
        return this;
    }

    basicAuthentication(username, password) {
        const auth = Buffer.from(username.concat(':').concat(password)).toString('base64');
        return this.header('Authorization', 'Basic ' + auth);
    }

    keep(key, value) {
        this.storage[key] = value;
        return this;
    }

    Response() {
        return this.resp;
    }

    build(uri, method = 'GET') {
        uri = (this.reqbody.https ? 'https://' : 'http://') + this.reqbody.domain + uri;
        let buildProcessArgs = {
            method,
            uri,
            qs: this.reqbody.qs,
            headers: this.reqbody.headers
        };

        if(this.reqbody.body) {
            buildProcessArgs['body'] = this.reqbody.body;
        }

        return buildProcessArgs;
    }

    process(uri, callback, method = 'GET') {
        let self = this;
        request(this.build(uri, method), function (error, response) {
            if (error) {
                return callback(error);
            }

            self.resp = new Response(response);
            callback(null, response);
        });
    }
}

module.exports.RestBuilder = RestBuilder;
module.exports.Response = Response;
module.exports.Body = Body;