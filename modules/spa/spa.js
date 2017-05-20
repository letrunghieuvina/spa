/**
 * Created by hieule on 07/01/17.
 */
'use strict'

var COMMON_CONST = {
    WEB_SOCKET_ENDPOINT: "/web/wse"
};

var EVENT_TYPE_CONST = {
    /*
    eventJson: {
        urlQueryParamsMap: urlQueryParamsMap
    }
    */
    EVENT_TYPE_URL_CHANGE: 'urlChangeEvent',
    EVENT_TYPE_URL_CHANGE_CODE: 1,

    /*
     eventJson: {

     }
     */
    EVENT_TYPE_PAGES_CHANGE: 'pagesChangeEvent',
    EVENT_TYPE_PAGES_CHANGE_CODE: 2,
};

var spa = (function() {
    var initModule;

    initModule = function (jqContainer) {
        spa.shell.initModule(jqContainer);
    };

    return {
        initModule: initModule
    };
}());


