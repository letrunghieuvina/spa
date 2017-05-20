'use strict'
/**
 * Created by hieule on 12/19/16.
 */
spa.shell = (function() {
    //region events handling
    var eventListeners = {};
    var registerEventListener;
    var removeEventListener;
    var fireEvent;
    var convertDataTypeToEventType;
    //endregion

    //region event handlers
    var onUrlChangeEventHandler;
    //endregion

    var getCurrentUrl;
    var getParamMapFromUrl;
    var createUrlQueryFromParamMap;
    var changeUrlQuery;
    var copyUrlQueryMap;
    var initModule;
    var buildUrlQueryMap;

    var stateMap = {
        urlQueryParamsMap: {},
        accessKey: null
    };
    var jqueryMap = {};

    // region web socket connection
    var openWsConnection;
    var getWebsocketEndpoint;
    var wsConnection;
    var wsOnOpen;
    var wsOnMessage;
    var wsOnError;
    var wsOnClose;
    var closeWsConnection;
    var wsSend;
    // endregion

    //region init and start modules
    var startModulePages;
    var startModuleInbox;
    //endregion

    initModule = function(jqContainer) {
        //open a websocket connection to server
        //openWsConnection();

        startModulePages.call(this, jqContainer);
        startModuleInbox.call(this, jqContainer);

        buildUrlQueryMap();

        registerEventListener(EVENT_TYPE_CONST.EVENT_TYPE_URL_CHANGE, onUrlChangeEventHandler);
        changeUrlQuery({}, {});
    };

    buildUrlQueryMap = function() {
        var currentUrl;
        var newQueryMap;

        currentUrl = getCurrentUrl();
        newQueryMap = getParamMapFromUrl(currentUrl);
        stateMap.accessKey = newQueryMap['t'];
        delete newQueryMap['t'];
        stateMap.urlQueryParamsMap = newQueryMap;
    };

    //region websocket
    getWebsocketEndpoint = function() {
        var endpoint = null;
        var url = getCurrentUrl();
        endpoint = "wss://" + url.host + COMMON_CONST.WEB_SOCKET_ENDPOINT;
        return endpoint;
    };

    openWsConnection = function () {
        var wse = getWebsocketEndpoint()
        wsConnection = new WebSocket(wse);

        wsConnection.onopen = wsOnOpen;
        wsConnection.onmessage = wsOnMessage;
        wsConnection.onerror = wsOnError;
        wsConnection.onclose = wsOnClose;
    };

    wsOnOpen = function(e) {

    };

    wsOnMessage = function(msg) {
        var jsonObj = JSON.parse(msg);
        fireEvent(jsonObj);
    };

    wsOnError = function(e) {

    };

    wsOnClose = function(e) {

    };

    wsSend = function(data) {
        var obj = {
            accessKey: stateMap.accessKey,
            data: data
        };
        var str = JSON.stringify(data);
        wsConnection.send(str);
    };

    closeWsConnection = function() {
        wsConnection.close();
    }
    //endregion

    //region event handling
    registerEventListener = function(eventType, callback) {
        if (!eventListeners[eventType]) {
            eventListeners[eventType] = [];
        }
        eventListeners[eventType].push(callback);
    };

    removeEventListener = function(eventType, callback) {
        var eventListenerArr = eventListeners[eventType];
        if (eventListenerArr) {
            var i = eventListenerArr.length - 1;
            for(; i >= 0; --i) {
                if (eventListenerArr[i] == callback) {
                    eventListenerArr.splice(i, 1);
                    break;
                }
            }
        }
    };

    //
    /*
        eventJson: {
            dataType: 1,
            data: [] // this is an array
        }
     */
    fireEvent = function(eventJson) {
        var eventType = convertDataTypeToEventType(eventJson.dataType);
        var eventListenerList = eventListeners[eventType];
        if (eventListenerList != null) {
            for(var i = eventListenerList.length - 1; i >= 0; --i) {
                eventListenerList[i](eventJson.data);
            }
        }
    };

    convertDataTypeToEventType = function(dataType) {
        var eventType = null;

        switch (dataType) {
            case EVENT_TYPE_CONST.EVENT_TYPE_URL_CHANGE_CODE:
                eventType = EVENT_TYPE_CONST.EVENT_TYPE_URL_CHANGE;
                break;
            case EVENT_TYPE_CONST.EVENT_TYPE_PAGES_CHANGE_CODE:
                eventType = EVENT_TYPE_CONST.EVENT_TYPE_PAGES_CHANGE;
                break;
        }

        return eventType;
    };

    //endregion

    getCurrentUrl = function() {
        return window.location;
    };

    // BEGIN Utility method /getParamMapFromUrl/
    // Purpose: parse a url location and return a map of keys and values
    // Arguments:
    //      * url: of type Location
    // Returns: a map of param keys and values
    getParamMapFromUrl = function(url) {
        var search = url.search;
        var kvPairs;
        var kvPairIndex;
        var kv;
        var k;
        var v;
        var returnObject = {};

        if (search && search.length > 0) {
            search = search.substring(1);
            kvPairs = search.split('&');
            if (kvPairs.length > 0) {
                for (kvPairIndex in kvPairs) {
                    kv = kvPairs[kvPairIndex].split('=');
                    k = kv[0];
                    v = kv[1];
                    returnObject[k] = v;
                }
            }
        }

        return returnObject;
    };
    // END Utility method /getParamMapFromUrl/

    // BEGIN Utility method /getParamMapFromUrl/
    // Purpose: parse a url location and return a map of keys and values
    // Arguments:
    //      * url: of type Location
    // Returns: a map of param keys and values
    createUrlQueryFromParamMap = function(argMap) {
        var retObj = String();
        var argKey;
        var argVal;

        for (argKey in argMap) {
            argVal = argMap[argKey];
            retObj += argKey + '=' + argVal + '&';
        }

        return '?' + retObj;
    };
    // END Utility method /getParamMapFromUrl/

    // Begin DOM method /changeUrlQuery/
    // Purpose : Changes part of the URI anchor component
    // Arguments:
    //    * argMap - The map describing what part of the URI anchor
    //    we want changed.
    //    * action: - append or remove
    // Returns : boolean
    //    * true - the Anchor portion of the URI was update
    //    * false - the Anchor portion of the URI could not be updated
    // Action :
    //    The current anchor rep stored in stateMap.anchor_map.
    //        See uriAnchor for a discussion of encoding.
    //        This method
    //    * Creates a copy of this map using copyUriQueryMap().
    //    * Modifies the key-values using arg_map.
    //    * Manages the distinction between independent
    //    and dependent values in the encoding.
    //    * Attempts to change the URI using uriAnchor.
    //    * Returns true on success, and false on failure.
    //
    changeUrlQuery = function(argsMapToAdd, argsMapToRemove) {
        var updatedQueryMap = copyUrlQueryMap();
        var key;

        for (key in argsMapToAdd) {
            if (argsMapToAdd.hasOwnProperty(key)) {
                updatedQueryMap[key] = argsMapToAdd[key];
            }
        }

        for (key in argsMapToRemove) {
            if (argsMapToRemove.hasOwnProperty(key)) {
                delete updatedQueryMap[key];
            }
        }

        var urlQuery = createUrlQueryFromParamMap(updatedQueryMap);

        // Begin attempt to update URI; revert if not successful
        history.pushState({}, '', urlQuery);

        /*

        // Begin merge changes into anchor map
        if (argMap != null && action != null) {
            if (action === 'append') {

            } else if (action === 'remove') {

            }
            // End merge changes into anchor map


        }*/

        // Fire event
        fireEvent({
            dataType: EVENT_TYPE_CONST.EVENT_TYPE_URL_CHANGE_CODE,
            data: [updatedQueryMap]
        });
        // End attempt to update URI
    };
    // END DOM method /changeUrlQuery/

    // BEGIN OF METHOD //copyUrlQueryMap//
    // Returns copy of stored anchor map; minimizes the overhead
    copyUrlQueryMap = function() {
        return $.extend(true, {}, stateMap.urlQueryParamsMap);
    };
    // END OF METHOD //copyUrlQueryMap//

    //region event handlers
    /**
     *
     * @param eventDataJson
     * expected:
     * eventDataJson: [{}]
     */
    onUrlChangeEventHandler = function(eventDataJson) {
        buildUrlQueryMap();
    };
    //endregion

    //region init and start modules
    startModulePages = function(jqContainer) {
        var pagesModel = new PagesModel();
        var pagesView = new PagesView(jqContainer, pagesModel);
        var pagesController = new PagesController(this, pagesModel, pagesView);
        pagesController.initModule();
    };
    startModuleInbox = function(jqContainer) {
        var inboxChatListModel = new InboxChatListModel();
        inboxChatListModel.initData();

        var inboxChatListView = new InboxChatListView(jqContainer, inboxChatListModel);
        var inboxController = new InboxController(this, inboxChatListModel, inboxChatListView);
        inboxController.initModule();
    };
    //endregion

    return {
        initModule: initModule,
        changeUrlQuery: changeUrlQuery,
        registerEventListener: registerEventListener,
        removeEventListener: removeEventListener
    };
}());