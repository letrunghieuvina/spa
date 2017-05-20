/**
 * Created by hieule on 1/14/17.
 */
function InboxController(shell, model, view) {
    /**
     * url query conventions:
     * + ib=on:
     *      this module is turned on.
     *
     */

    this._shell = shell;
    this._model = model;
    this._view = view;

    this._stateMap = {
        inUse: false
    };

    this.onUrlChangeEventHandlerBind = null;
}

InboxController.prototype = {
    initModule: function() {
        this.onUrlChangeEventHandlerBind = this.onUrlChangeEventHandler.bind(this);

        this.registerEvents(this._shell);
    },

    registerEvents: function(shell) {
        // listen to events from _shell
        shell.registerEventListener(EVENT_TYPE_CONST.EVENT_TYPE_URL_CHANGE, this.onUrlChangeEventHandlerBind);
    },

    /**
     *
     * @param eventDataJson: [{}]
     *
     */
    onUrlChangeEventHandler: function(eventDataJson) {
        if (eventDataJson.length > 0) {
            var urlQueryMap = eventDataJson[0];
            if (urlQueryMap['ib'] === 'on') {
                if (!this._stateMap.inUse) {
                    this._view.initView();
                    this._view.show();
                }

                //TODO: check sub flags and do other setups
            } else if (urlQueryMap['ib'] === 'hide'){
                this._view.hide();
            } else {
                //TODO: release all resources and turn this module off
                this._shell.removeEventListener(EVENT_TYPE_CONST.EVENT_TYPE_URL_CHANGE, this.onUrlChangeEventHandlerBind);
                //this._shell.removeEventListener(EVENT_TYPE_CONST.EVENT_TYPE_PAGES_CHANGE, this.pagesChangeEventHandlerBind);

                this._view.disposeView();
                this._model.setConversations([]);
                this._shell = null;
            }
        }
    }


};