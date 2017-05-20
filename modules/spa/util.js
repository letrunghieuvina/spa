/**
 * Created by hieule on 2/16/17.
 */
'use strict';

spa.util = (function() {
    var center = function(jqObj) {
        jqObj.css(
            {
                top:'50%',
                left:'50%',
                margin:'-'+(jqObj.height() / 2)+'px 0 0 -'+(jqObj.width() / 2)+'px'
            }
        );
    };

    var binarySearch = function(arr, itemField, valueToSearch) {
        let retIndex = -1;
        let low = 0;
        let high = arr.length - 1;
        let mid = 0;
        let itemVal = null;

        let accessArr = 0;

        do {
            mid = Math.floor((high + low) / 2);
            //console.log("low = " + low + "; and high = " + high + "; and mid = " + mid);
            itemVal = arr[mid][itemField];
            accessArr++;
            if (valueToSearch == itemVal) {
                retIndex = mid;
                break;
            } else if (low == high) {
                break;
            } else if (valueToSearch < itemVal) {
                high = mid - 1;
            } else if (valueToSearch > itemVal) {
                low = mid + 1;
            }
        } while (true);

        //console.log("Access Array: " + accessArr);

        return retIndex;
    };

    return {
        center: center,
        binarySearch: binarySearch
    };
}());