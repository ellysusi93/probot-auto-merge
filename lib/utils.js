"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
function identity(v) { return v; }
exports.identity = identity;
function groupBy(keyFn, list) {
    return list.reduce(function (result, item) {
        var _a;
        var key = keyFn(item);
        var previousValue = result[key] || [];
        var newValue = previousValue.concat([item]);
        return __assign({}, result, (_a = {}, _a[key] = newValue, _a));
    }, {});
}
exports.groupBy = groupBy;
function groupByLast(keyFn, list) {
    return groupByLastMap(keyFn, identity, list);
}
exports.groupByLast = groupByLast;
function groupByLastMap(keyFn, valueFn, list) {
    return list.reduce(function (result, item) {
        var _a;
        return (__assign({}, result, (_a = {}, _a[keyFn(item)] = valueFn(item), _a)));
    }, {});
}
exports.groupByLastMap = groupByLastMap;
/**
 * Checks the supplied response for errors and casts response data to
 * supplied type.
 * @param response The response from a GitHub API
 */
function result(response) {
    if (response.status < 200 || response.status >= 300) {
        throw new Error("Response status was " + response.status);
    }
    return response.data;
}
exports.result = result;
//# sourceMappingURL=utils.js.map