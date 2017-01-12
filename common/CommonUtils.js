'use strict';

class CommonUtils {
    static tickFormat(v) {
        // https://github.com/d3/d3/issues/2241#issuecomment-150099953 //
        let formatNumber = d3.format(".0f"),
            formatBillion = function(x) { return formatNumber(x / 1e9) + "B"; },
            formatMillion = function(x) { return formatNumber(x / 1e6) + "M"; },
            formatThousand = function(x) { return formatNumber(x / 1e3) + "k"; },
            formatHundred = function(x) { return formatNumber(x);};

        if (v < 1) {
            return v;
        } else {
            return (v >= .9995e9 ? formatBillion : v >= .9995e6 ? formatMillion :  v >= .9995e3 ? formatThousand : formatHundred)(v);
        }
    }
}

export default CommonUtils;