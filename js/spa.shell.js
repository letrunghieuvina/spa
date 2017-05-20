'use strict'
/**
 * Created by hieule on 10/5/16.
 */
spa.shell = (function() {
    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var configMap = {
        mainHtml: String()
        + '<div class="spa-shell-head">'
            + '<div class="spa-shell-head-logo"/>'
            + '<div class="spa-shell-head-breadcrumb"/>'
            + '<div class="spa-shell-head-account"/>'
        + '</div>'
        + '<div class="spa-shell-main-content"/>'
        + '<div class="spa-shell-foot"/>'
        + '<div class="spa-shell-modal"/>',
    };
    var stateMap = {
        uriQueryMap: {},
    };
    var uriQueryChangeListenerMap = {};
    var jqueryMap = {};
    var copyUriQueryMap;
    var initJqueryMap;
    var onUriQueryChange;
    var onTapAcct;
    var onLogin;
    var onLogout;
    var initModule;
    var getParamMapFromUrl;
    var createUrlQueryFromParamMap;
    var changeUriQuery;
    var getCurrentUrl;
    //var onResize;
    var registerUriChangeListener;
    var unregisterUriChangeListener;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //-------------------- BEGIN UTILITY METHODS -----------------

    registerUriChangeListener = function(flag, callback) {
        uriQueryChangeListenerMap[flag] = callback;
    };

    unregisterUriChangeListener = function(flag) {
        delete uriQueryChangeListenerMap[flag];
    };

    getCurrentUrl = function() {
        return window.location;
    }

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

    // Returns copy of stored anchor map; minimizes the overhead
    copyUriQueryMap = function() {
        return $.extend(true, {}, stateMap.uriQueryMap);
    };
    //--------------------- END UTILITY METHODS ------------------

    //--------------------- BEGIN DOM METHODS --------------------

    // Begin DOM method /changeUriQuery/
    // Purpose : Changes part of the URI anchor component
    // Arguments:
    //    * arg_map - The map describing what part of the URI anchor
    //    we want changed.
    // Returns : boolean
    //    * true - the Anchor portion of the URI was update
    //    * false - the Anchor portion of the URI could not be updated
    // Action :
    //    The current anchor rep stored in stateMap.uriQueryMap.
    //        See uriAnchor for a discussion of encoding.
    //        This method
    //    * Creates a copy of this map using copyUriQueryMap().
    //    * Modifies the key-values using arg_map.
    //    * Manages the distinction between independent
    //    and dependent values in the encoding.
    //    * Attempts to change the URI using uriAnchor.
    //    * Returns true on success, and false on failure.
    //
    changeUriQuery = function(argMap) {
        var updatedQueryMap = copyUriQueryMap();
        var retBool = true;
        var key;

        // Begin merge changes into anchor map
        for (key in argMap) {
            if (argMap.hasOwnProperty(key)) {
                updatedQueryMap[key] = argMap[key];
            }
        }
        // End merge changes into anchor map

        var urlQuery = createUrlQueryFromParamMap(updatedQueryMap);

        // Begin attempt to update URI; revert if not successful
        history.replaceState({}, '', urlQuery);
        $(window).trigger( 'uriQueryChange' );
        // End attempt to update URI

        return retBool;
    };
    // END DOM method /changeUriQuery/

    // Begin DOM method /initJqueryMap/
    initJqueryMap = function($container) {
        //var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $acct: $container.find('.spa-shell-head-acct'),
            $nav: $container.find('.spa-shell-main-nav')
        };
    };
    // End DOM method /initJqueryMap/

    //--------------------- END DOM METHODS ----------------------

    //------------------- BEGIN EVENT HANDLERS -------------------

    // Begin Event handler /onTapAcct/
    onTapAcct = function (event) {
        var accText;
        var username;
        var user = spa.model.people.getUser();
        if (user.isAnon()) {
            username = prompt('Please sing-in');
            spa.model.people.login(username);
            jqueryMap.$acct.text('... processing ...');
        } else {
            spa.model.people.logout();
        }
        return false;
    };
    // End Event handler /onTapAcct/

    // Begin Event handler /onLogin/
    onLogin = function(event, loginUser) {
        jqueryMap.$acct.text(loginUser.name);
    };
    // End Event handler /onLogin/

    // Begin Event handler /onLogout/
    onLogout = function(event, loginUser) {
        jqueryMap.$acct.text(loginUser.name);
    };
    // End Event handler /onLogout/

    // Begin Event handler /onResize/
    /*onResize = function() {
        if (stateMap.resize_idto) {
            return true;
        }

        spa.chat.handleResize();
        stateMap.resize_idto = setTimeout(
            function () {
                stateMap.resize_idto = undefined;
            },
            configMap.resize_interval
        );
        return true;
    };*/
    // End Event handler /onResize/

    // Begin Event handler /onUriQueryChange/
    // Purpose : Handles theuriQueryChange event
    // Arguments:
    //    * event - jQuery event object.
    // Settings : none
    // Returns : false
    // Action        :
    //    * Parses the URI anchor component
    //    * Compares proposed application state with current
    //    * Adjust the application only where proposed state differs from existing
    //      and is allowed by anchor schema
    //
    onUriQueryChange = function(event) {
        var currentUrl;
        var newQueryMap;
        var is_ok = true;
        var anchor_map_previous = copyUriQueryMap();
        var uqKey;
        var uqVal;

        currentUrl = getCurrentUrl();
        newQueryMap = getParamMapFromUrl(currentUrl);
        stateMap.uriQueryMap = newQueryMap;

        for (uqKey in newQueryMap) {
            uqVal = newQueryMap[uqKey];
            if (uqKey && uqVal) {
                uriQueryChangeListenerMap[uqKey](uqVal);
            }
        }
        // begin revert anchor if slider change denied
        if (!is_ok) {
            /*if (anchor_map_previous) {
             $.uriAnchor.setAnchor(anchor_map_previous, null,true);
             stateMap.anchor_map = anchor_map_previous;
             } else {
             delete  anchor_map_proposed.chat;
             $.uriAnchor.setAnchor(anchor_map_proposed, null, true);
             }*/
        }
        // end revert anchor if slider change denied

        return false;
    };
    // EndEvent handler /onUriQueryChange/

    //-------------------- END EVENT HANDLERS --------------------

    //---------------------- BEGIN CALLBACKS ---------------------
    //----------------------- END CALLBACKS ----------------------

    //------------------- BEGIN PUBLIC METHODS -------------------
    // Begin Public method /initModule/
    // Example        : spa.shell.initModule( $('#app_div_id') );
    // Purpose        :
    // Directs the Shell to offer its capability to the user
    // Arguments :
    //        * $container (example: $('#app_div_id')).
    //        A jQuery collection that should represent
    //        a single DOM container
    // Action         :
    //            Populates $container with the shell of the UI
    //        and then configures and initializes feature modules.
    //            The Shell is also responsible for browser-wide issues
    //        such as URI anchor and cookie management.
    // Returns        : none
    // Throws         : none
    initModule = function($container) {
        // load HTML and map jQuery collections
        $container.html(configMap.mainHtml);
        initJqueryMap($container);

        // configure and initialize feature modules
        /*spa.chat.configModule({
            changeUriQuery: changeUriQuery,
            chat_model: spa.model.chat,
            people_model: spa.model.people
        });
        spa.chat.initModule( jqueryMap.$container );
        registerUriChangeListener('chat', spa.chat.setSliderPosition);

        $.gevent.subscribe($container, 'spa-login-event', onLogin);
        $.gevent.subscribe($container, 'spa-logout-event', onLogout);
        */
        //jqueryMap.$acct.text('Please sign-in').bind('utap', onTapAcct);

        // Handle URI anchor change events.
        // This is done /after/ all feature modules are configured
        // and initialized, otherwise they will not be ready to handle
        // the trigger event, which is used to ensure the anchor
        // is considered on-load
        //
        $(window)
            //.bind('resize', onResize)
            .bind( 'uriQueryChange', onUriQueryChange )
            .trigger( 'uriQueryChange' );
    };
    // End PUBLIC method /initModule/

    return { initModule: initModule };
    //------------------- END PUBLIC METHODS ---------------------
}());