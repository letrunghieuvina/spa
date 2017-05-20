'use strict'
/**
 * Created by hieule on 12/19/16.
 */
function PagesController(shell, model, view) {
    /**
     * url query conventions:
     * + pages=on:
     *      this module is turned on.
     *
     */

    //region variables
    this._shell = shell; // this points to the shell module
    this._view = view;
    this._model = model;

    this._stateMap = {
        inUse: false
    };

    this.onUrlChangeEventHandlerBind = null;
    this.pagesChangeEventHandlerBind = null;
    this.onPageLinkClickedEventHandlerBind = null;
    //endregion
}

PagesController.prototype = {
    initModule: function() {
        this.onUrlChangeEventHandlerBind = this.onUrlChangeEventHandler.bind(this);
        this.pagesChangeEventHandlerBind = this.pagesChangeEventHandler.bind(this);
        this.onPageLinkClickedEventHandlerBind = this.onPageLinkClickedEventHandler.bind(this);

        this.registerEvents(this._shell);
    },

    registerEvents: function (shell) {
        // listen to events from _shell
        shell.registerEventListener(EVENT_TYPE_CONST.EVENT_TYPE_URL_CHANGE, this.onUrlChangeEventHandlerBind);
        shell.registerEventListener(EVENT_TYPE_CONST.EVENT_TYPE_PAGES_CHANGE, this.pagesChangeEventHandlerBind);

        // listen events from view
        this._view.pageLinkClickedEvent.attach(this.onPageLinkClickedEventHandlerBind);
    },

    /**
     *
     * @param eventDataJson: [{}]
     *
     */
    onUrlChangeEventHandler: function(eventDataJson) {
        if (eventDataJson.length > 0) {
            var urlQueryMap = eventDataJson[0];
            if (urlQueryMap['pages'] === 'on') {
                if (!this._stateMap.inUse) {
                    this._view.initView();
                    this._view.show();
                } else {
                    // this module is already on
                }

                //TODO: check sub flags and do other setups
            } else if (urlQueryMap['pages'] === 'hide'){
                this._view.hide();
            } else {
                //TODO: release all resources and turn this module off
                this._shell.removeEventListener(EVENT_TYPE_CONST.EVENT_TYPE_URL_CHANGE, this.onUrlChangeEventHandlerBind);
                this._shell.removeEventListener(EVENT_TYPE_CONST.EVENT_TYPE_PAGES_CHANGE, this.pagesChangeEventHandlerBind);

                this._view.disposeView();
                this._model.setItems([]);
                this._shell = null;
            }
        }
    },

    /**
     *
     * @param eventDataJson: [{}] // this is an array of com.miracle.qshop.client.model.JsAccount
     */
    pagesChangeEventHandler: function(eventDataJson) {

    },

    /**
     *
     * @param eventSource
     * @param args
     */
    onPageLinkClickedEventHandler: function(eventSource, args) {
        var pageId = args[0];
        this._shell.changeUrlQuery({ib: 'on'}, {pages: 'off'});
    },

    setModel: function(model) {
        this._model = model;
    },
    getModel: function () {
        return this._model;
    },
    setView: function(view) {
        this._view = view;
    },
    getView: function() {
        return this._view;
    }
};