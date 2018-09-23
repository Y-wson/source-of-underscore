(function () {

    //此处this为window，我们将_挂载到root上，那么外面也就能调用了
    var root = this;

    var ArrayProto = Array.prototype;

    var push = ArrayProto.push;

    //如果要使_().也能够使用的话，_必须是一个函数，
    var _ = function(obj) {
        if (obj instanceof _) return obj;

        //如果this不是_的实例的话，那么重新new一个
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };

    //挂载到window上
        root._ = _;


    _.VERSION = '0.1';

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    //判断是不是数组就用length是不是数字还有length的长度是否在0和最大数组索引之间
    var isArrayLike = function(collection) {
        var length = collection.length;
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    _.each = function(obj, callback) {
        var length, i = 0;

        if (isArrayLike(obj)) {
            length = obj.length;
            for (; i < length; i++) {
                //callback.call与判断语句在一起执行
                if (callback.call(obj[i], obj[i], i) === false) {
                    break;
                }
            }
        } else {
            for (i in obj) {
                if (callback.call(obj[i], obj[i], i) === false) {
                    break;
                }
            }
        }

        return obj;
    }

    //判断是不是function也是用typeof
    _.isFunction = function(obj) {
        return typeof obj == 'function' || false;
    };

    //获取所有的key值
    _.functions = function(obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };

    /**
     * 在 _.mixin(_) 前添加自己定义的方法
     */
    _.reverse = function(string){
        return string.split('').reverse().join('');
    }

    _.mixin = function(obj) {
        _.each(_.functions(obj), function(name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function() {
                var args = [this._wrapped];

               var result= push.apply(args, arguments);

                return func.apply(_, args);
            };
        });
        return _;
    };

    _.mixin(_);

})();






