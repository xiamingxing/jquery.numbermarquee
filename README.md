# Numbermarquee

The best jQuery plugin ever.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.githubusercontent.com/xiamingxing/jquery.numbermarquee/master/dist/jquery.numbermarquee.min.js
[max]: https://raw.githubusercontent.com/xiamingxing/jquery.numbermarquee/master/dist/jquery.numbermarquee.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/numbermarquee.min.js"></script>
<script>
jQuery(function($) {
    $('#numlist').numbermarquee({
        size: 12,
        callBack: function () {
            alert('done');
        },
        targetValue: 19900725,
        speed: 1000
    });
});
</script>
```

## Documentation
```javascript

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

```

## Examples
Look example click [here][herelink]

[herelink]: http://xiamingxing.github.io/jquery.numbermarquee/demo/numbermarquee.html

## Release History
    1.0.0
