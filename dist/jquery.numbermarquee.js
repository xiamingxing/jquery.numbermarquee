/*! Numbermarquee - v0.1.0 - 2016-01-06
* https://github.com/xiamingxing/jquery.numbermarquee
* Copyright (c) 2016 xiamingxing; Licensed MIT */
(function ($) {

    // Collection method.
    $.fn.numbermarquee = function (option) {

        option = $.extend({}, $.fn.numbermarquee.option, option);

        return this.each(function () {
            var $ele = $(this),
                rangeList = option.rangeList,
                MaxRange = rangeList.length,
                rangeMap = {};

            for (var i = 0; i < MaxRange; i++) {
                rangeMap[rangeList[i]] = i;
            }

            var cols = option.cols,
                rows = option.rows,
                size = option.size,
                align = option.align,
                speed = option.speed,
                direction = option.direction,
                delay = option.delay,
                callBack = option.callBack,
                symbol = direction === 'down' ? '+' : '-';

            if (option.autoFix) {

                for (var i = 0, l = MaxRange; i < l; i++) {
                    cols = Math.max(rangeList[i].toString().length, cols);
                }

                var prefix = option.fixMode === 'pre' ? option.fixContent : '',
                    suffix = option.fixMode === 'suf' ? option.fixContent : '';

                for (var i = 0, l = MaxRange; i < l; i++) {

                    var item_size = rangeList[i].toString().length;
                    var diff = cols - item_size;

                    if (diff > 0) {
                        for (; diff--;) {
                            rangeList[i] = prefix + rangeList[i] + suffix;
                        }
                    }
                }
            }

            var fontSize = option.fontSize || parseInt($ele.css('fontSize')),
                charCssText = {
                    lineHeight: fontSize + 'px',
                    width: fontSize / 2 * cols,
                    height: fontSize * rows
                },
                str = rangeList.join(''),
                charRangeText = str + str + str,
                $charElement =
                    $("<div style='word-wrap: break-word; position: relative;'></div>")
                        .html(charRangeText),
                $charWrapper =
                    $("<span style='float: left; overflow: hidden; position: relative'></span>")
                        .css(charCssText)
                        .append($charElement)
                        .addClass(option.itemClass);

            for (var i = 0; i < size; i++) {
                $ele.append($charWrapper.clone());
            }

            $ele.css({
                'fontSize': fontSize + 'px',
                'fontFamily': option.fontFamily,
                'color': option.color
            });

            var currentVal = [],
                currentSerial = -1,
                completed = false,
                statusRecord = [];

            setValue(option.defaultValue);
            delay && setTimeout(function () {
                turnValue();
            }, delay);

            function animate($char, symbol, distance, speed, callBack) {
                $char.length &&
                $char
                    .find('div')
                    .stop(true)
                    .animate({
                        top: symbol + '=' + distance
                    }, speed, function () {
                        callBack && callBack($char);
                    });
            }

            function scroll($char, symbol, step, speed, callBack) {
                var charInfo = getCharInfo($char);
                var distance = ( step % charInfo.total ) * charInfo.height;
                charInfo.flag !== 1 && setCharIndex($char, charInfo.index);
                animate($char, symbol, distance, speed, callBack);
            }

            function setCharIndex($char, index) {
                var charInfo = getCharInfo($char),
                    total = charInfo.total,
                    height = charInfo.height,
                    top = -( ( total + index ) % ( 2 * total ) ) * height;
                $char.children().css('top', top);
            }

            function getCharInfo($char) {
                var $childen = $char.find('div'),
                    height = $char.height(),
                    top = Math.abs(parseInt($childen.css('top'))) || 0,
                    totalHeight = $childen.height(),
                    total = totalHeight / height / 3,
                    pos = Math.round(top / height),
                    index = pos % total,
                    flag = Math.floor(pos / total);

                return {
                    totalHeight: totalHeight,
                    height: height,
                    total: total,
                    index: index,
                    flag: flag
                };
            }

            function analyzeValue(val, rangMap, cols, size, align) {

                var result = [];

                if ($.isArray(val)) {
                    for (var i = 0, l = val.length; i < l; i++) {
                        result[i] = rangMap[val[i]] || 0;
                    }
                }

                if (typeof val == 'string' || typeof val == 'number') {
                    val = val.toString();
                    cols = cols || 1;
                    for (var i = 0, l = val.length, flag = (align === 'right' ? size - l : 0); i < l; i = i + cols) {
                        var item = val.substr(i, cols);
                        result[i + flag] = rangMap[item] || 0;
                    }
                }

                for (var i = size - 1; i--;) {
                    if (result[i] === undefined) {
                        result[i] = 0;
                    }
                }
                return result;

            }

            function isComplete(serial, index) {
                if (arguments.length === 0 || index === undefined) {
                    return completed;
                }
                statusRecord[serial] = statusRecord[serial] || [];
                statusRecord[serial][index] = true;
                completed = true;
                for (var i = size; i--;) {
                    completed = completed && statusRecord[serial][i];
                }
                return completed;
            }

            function setValue(val) {
                var $chars = $ele.children(),
                    val = analyzeValue(val, rangeMap, cols, size, align);
                for (var i = Math.min(val.length, $chars.length); i--;) {
                    var $char = $chars.eq(i);
                    setCharIndex($char, val[i]);
                }
                currentVal = val;
            }

            function getValue(serial) {

                var val = option.targetValue,
                    isLoop = option.isLoop;

                if (!val) {
                    console.error("getValue: targetValue is null;");
                }
                else if (typeof val === 'function') {
                    val = [val(serial)];
                    serial = 0;
                }
                else if (typeof val === 'string' || typeof val === 'number') {
                    val = [val];
                    serial = serial || 0;
                }
                else if (val instanceof Array && isLoop) {
                    serial = serial % val.length;
                }
                else {
                    console.error("getValue: targetValue is a object, but expected array;");
                }

                return val ? val[serial] : false;
            }

            function turnValue(serial) {

                serial = serial || 0;
                var val = getValue(serial);
                if (val === false || val === undefined) {
                    return;
                }

                var $chars = $ele.children(),
                    value = analyzeValue(val, rangeMap, cols, size, align);

                for (var i = Math.min(currentVal.length, value.length, $chars.length); i--;) {
                    var $char = $chars.eq(i),
                        gap = value[i] - currentVal[i],
                        vector = {
                            up: (MaxRange + gap) % MaxRange,
                            down: (2 * MaxRange - gap) % MaxRange
                        }[direction];
                    scroll($char, symbol, vector, speed, function ($char) {
                        if (isComplete(serial, $char.index())) {
                            currentVal = value;
                            currentSerial = serial;
                            if (!callBack || callBack.call($ele, val, serial) === undefined) {
                                turnValue(serial + 1);
                            }
                        }
                    });
                }
            }

        });
    };

    // Static method default option.
    $.fn.numbermarquee.option = {
        punctuation: '1.0.0',
        rangeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        autoFix: true,
        fixMode: 'pre',
        fixContent: '0',
        cols: 1,
        rows: 1,
        size: 18,
        fontSize: 30,
        fontFamily: 'heiti',
        color: '#eee',
        itemClass: 'charClass',
        direction: 'up',
        speed: 1500,
        delay: 1000,
        callBack: function (val, serial) {

        },
        defaultValue: "00000000",
        targetValue: '',
        isLoop: false,
        align: 'right'
    };

}(jQuery));
