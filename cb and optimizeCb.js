_.map = function (obj, iteratee, context) {
    //使用cb函数对iteratee和context进行处理
    iteratee = cb(iteratee, context);

    var length = obj.length, results = Array(length);
    for (var index = 0; index < length; index++) {
        results[index] = iteratee(obj[index], index, obj);
    }

    return results;
};

var cb = function(value, context, argCount) {

    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);

    //如果value不存在
    if (value == null) return _.identity;

    if (_.isFunction(value)) return optimizeCb(value, context, argCount);

    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);

    return _.property(value);
};

//直接返回对应的值
_.identity = function(value) {
    return value;
};

var optimizeCb = function(func, context, argCount) {
    // 如果没有传入 context，就返回 func 函数
    if (context === void 0) return func;
    // switch (argCount) {
    //     case 1:
    //         return function(value) {
    //             return func.call(context, value);
    //         };
    //     case null:
    //     case 3:
    //         return function(value, index, collection) {
    //             return func.call(context, value, index, collection);
    //         };
    //     case 4:
    //         return function(accumulator, value, index, collection) {
    //             return func.call(context, accumulator, value, index, collection);
    //         };
    // }
    return function() {
        return func.apply(context, arguments);
    };
};

var nativeIsArray = Array.isArray;

_.isArray = nativeIsArray || function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

_.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};


// extend 函数可以参考 《JavaScript 专题之手写一个 jQuery 的 extend》
_.matcher = function(attrs) {
    attrs = _.extend({}, attrs);
    return function(obj) {
        return _.isMatch(obj, attrs);
    };
};

// 该函数判断 attr 对象中的键值是否在 object 中有并且相等

// var stooge = {name: 'moe', age: 32};
// _.isMatch(stooge, {age: 32}); => true

// 其中 _.keys 相当于 Object.keys
_.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
        var key = keys[i];
        if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
};


_.property = function(path) {
    // 如果不是数组
    if (!_.isArray(path)) {
        return shallowProperty(path);
    }
    return function(obj) {
        return deepGet(obj, path);
    };
};

var shallowProperty = function(key) {
    return function(obj) {
        return obj == null ? void 0 : obj[key];
    };
};

// 根据路径取出深层次的值
var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
        if (obj == null) return void 0;
        obj = obj[path[i]];
    }
    return length ? obj : void 0;
};