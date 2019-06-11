var fs = require('fs');
var path = require('path');
var request = require('request');

module.exports = class GSX {
    constructor(soldTo, shipTo, appleID, cert, key, cookie, env = 'uat') {
        this._soldTo = soldTo;
        this._shipTo = shipTo;
        this._appleID = appleID;
        this._cookie = cookie;
        this._activeToken = '';
        this._cert = cert;
        this._key = key;
        this._env = env;
        this._url = (this._env === 'uat') ? 'https://partner-connect-uat.apple.com/gsx/api/' : 'https://partner-connect.apple.com/gsx/api/';
        this._options = {
            agentOptions: {
                cert: fs.readFileSync(this._cert),
                key: fs.readFileSync(this._key),
            },
            headers: {
                'X-Apple-SoldTo': this._soldTo,
                'X-Apple-ShipTo': this._shipTo,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: {
                'userAppleId': this._appleID,
                'authToken': this._activeToken
            },
            json: true
        }
    }

    // Login 
    getActivateToken() {
        var _this = this;

        return new Promise(function (resolve, reject) {
            var j = request.jar();

            var cookie = request.cookie('myacinfo-uat=' + _this._cookie);
            j.setCookie(cookie, (_this._env === 'uat') ? 'https://gsx2-uat.apple.com' : 'https://gsx2.apple.com');
            request.get({
                url: (_this._env === 'uat') ? 'https://gsx2-uat.apple.com/gsx/api/login' : 'https://gsx2.apple.com/gsx/api/login',
                jar: j
            }, function (err, res, body) {
                if (err) {
                    reject(err);
                } else {
                    if (res.headers['x-apple-auth-token']) {
                        _this._activeToken = res.headers['x-apple-auth-token'];
                        _this._options.body.authToken = res.headers['x-apple-auth-token'];
                    }

                    console.log('[Activate Code] statusCode: ', res.statusCode);
                    console.log('[Activate Code] activaCode: ', _this._activeToken);
                    resolve();
                }

            });
        });


    }

    login() {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var options = Object.assign({
                method: 'POST',
                url: _this._url + 'authenticate/token',
            }, _this._options);

            _this._request(options)
                .then(function (data) {
                    if (data.body.hasOwnProperty('authToken')) {
                        _this._token = data.body.authToken;
                    }
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                });
        })
    }

    logout() {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var options = Object.assign({
                method: 'POST',
                url: _this._url + 'authenticate/end-session',
                headers: Object.assign(_this._options.headers, {
                    'X-Apple-Auth-Token': _this._token
                }),
                body: Object.assign(_this._options.body, {
                    authToken: _this._token
                })
            }, _this._options);

            _this._request(options)
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                });
        })
    }

    //repair
    repairSummary(_body) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var options = Object.assign({
                method: 'POST',
                url: _this._url + 'repair/summary',
                headers: Object.assign(_this._options.headers, {
                    'X-Apple-Auth-Token': _this._token
                })
            }, _this._options);
            options.body = _body;

            _this._request(options)
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                })
        });
    }

    repairDetails(repairID) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var options = Object.assign({
                method: 'GET',
                url: _this._url + 'repair/details?repairId=' + repairID,
                headers: Object.assign(_this._options.headers, {
                    'X-Apple-Auth-Token': _this._token
                })
            }, _this._options);
            delete options.body;

            _this._request(options)
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    repairAudit(repairID) {
        var _this = this;
        var options = Object.assign({
            method: 'GET',
            url: _this._url + 'repair/audit?repairId=' + repairID,
            headers: Object.assign(_this._options.headers, {
                'X-Apple-Auth-Token': _this._token
            })
        }, _this._options);
        delete options.body;

        return _this._request(options);
    }

    repairProductComponentIssue(_body) {
        var _this = this;

        var options = Object.assign({
            method: 'POST',
            url: _this._url + 'repair/product/componentissue',
            headers: Object.assign(_this._options.headers, {
                'X-Apple-Auth-Token': _this._token
            })
        }, _this._options);
        options.body = _body;

        return _this._request(options);
    }

    repairProductDetails(_body) {
        var _this = this;

        var options = Object.assign({
            method: 'POST',
            url: _this._url + 'repair/product/details',
            headers: Object.assign(_this._options.headers, {
                'X-Apple-Auth-Token': _this._token
            })
        }, _this._options);
        options.body = _body;

        return _this._request(options);
    }

    //diagnostic
    diagnosticSuite(deviceID) {
        var _this = this;

        var options = Object.assign({
            method: 'GET',
            url: _this._url + 'diagnostics/suites?deviceId=' + deviceID,
            headers: Object.assign(_this._options.headers, {
                'X-Apple-Auth-Token': _this._token
            })
        }, _this._options);
        delete options.body;

        return _this._request(options);
    }

    diagnosticInitTest(_body) {
        var _this = this;

        var options = Object.assign({
            method: 'POST',
            url: _this._url + 'diagnostics/initiate-test',
            headers: Object.assign(_this._options.headers, {
                'X-Apple-Auth-Token': _this._token
            })
        }, _this._options);
        options.body = _body;

        return _this._request(options);
    }

    diagnosticLookup(_body) {
        var _this = this;

        var options = Object.assign({
            method: 'POST',
            url: _this._url + 'diagnostics/lookup',
            headers: Object.assign(_this._options.headers, {
                'X-Apple-Auth-Token': _this._token
            })
        }, _this._options);
        options.body = _body;

        return _this._request(options);
    }

    diagnosticStatus(_body) {
        var _this = this;

        var options = Object.assign({
            method: 'POST',
            url: _this._url + 'diagnostics/status',
            headers: Object.assign(_this._options.headers, {
                'X-Apple-Auth-Token': _this._token
            })
        }, _this._options);
        options.body = _body;

        return _this._request(options);
    }

    //general
    partsSummary(_body) {
        var _this = this;

        var options = Object.assign({
            method: 'POST',
            url: _this._url + 'parts/summary',
            headers: Object.assign(_this._options.headers, {
                'X-Apple-Auth-Token': _this._token
            })
        }, _this._options);
        options.body = _body;

        return _this._request(options);
    }


    technicianLookup(_body) {
        var _this = this;

        var options = Object.assign({
            method: 'POST',
            url: _this._url + 'technician/lookup',
            headers: Object.assign(_this._options.headers, {
                'X-Apple-Auth-Token': _this._token
            })
        }, _this._options);
        options.body = _body;

        return _this._request(options);
    }

    _request(options) {
        return new Promise(function (resolve, reject) {
            request(options, function (err, res, body) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        header: res.headers,
                        statusCode: res.statusCode,
                        body: body,
                        options: options
                    });
                }
            });
        });
    }

}