/**
 * Created by hieule on 1/15/17.
 */
function InboxChatListView(jqContainer, model, pageId) {
    this._model = model;
    this._jqContainer = jqContainer;

    this._stateMap = {
        pageId: pageId,
        conversationIndexRendred: 0,
        numberOfConversationsSelected: 0
    }

    this._configMap = {
        ibHtml: String()
        + '<div class="ib">'
            + '<div class="ib-labels">'
                + '<span>Filter by labels:</span>'
                + '<div class="ib-labels-list">'
                    /* labels list to come here */
                + '</div>'
                + '<div class="ib-labels-new">'
                    + '<span>New label:</span>'
                    + '<div class="ib-labels-new-ctrl">'
                        + '<input id="tfNewLabelName" type="text"/>'
                        + '<input id="btnAddNewLabel" type="button" value="+"/>'
                    + '</div>'
                + '</div>'
            + '</div>'

            + '<div class="ib-threads">'
                + '<div class="ib-threads-filters">'
                    + '<div class="ib-threads-filters-filters">'
                        + '<div><span class="chk-span"><input id="chkAllThreads" type="checkbox"/>All</span></div>'
                        + '<div>Filters: </div>'
                        + '<div><input type="text" placeholder="by name..."/></div>'
                        + '<div class="ib-threads-filters-filters-cal">'
                            + '<span>by date from</span>'
                            + '<input type="date"/>'
                            + '<span>to</span>'
                            + '<input type="date"/>'
                        + '</div>'
                    + '</div>'
                    + '<div class="ib-threads-filters-actions">'
                        + '<div>'
                            + '<span>Selected:</span>'
                            + '<span class="ib-threads-filters-actions-selected">0</span>'
                        + '</div>'
                        + '<div>'
                            + '<span>Apply labels:</span>'
                            + '<input type="text" list="labelOptions">'
                            + '<datalist id="labelOptions">'
                                 /* labels list to come here*/
                            + '</datalist>'
                        + '</div>'
                        + '<div>'
                            + '<input id="btnReply" type="button" value="Reply Selected Threads"/>'
                        + '</div>'
                    + '</div>'
                + '</div>'

                + '<div class="ib-list-threads-threads">'
                        /* inbox threads to come here*/
                + '</div>'
            + '</div>' // end of 'ib-threads'

            + '<div class="hidden ib-reply">'
                + '<div class="ib-reply-editor">'
                    + '<textarea>Enter your message here.</textarea>'
                + '</div>'
                + '<div class="ib-reply-preview-title">Preview</div>'
                + '<div class="ib-reply-preview"></div>'
                + '<div class="ib-reply-ctrl">'
                    + '<input id="btnIbCancel" type="button" value="Cancel"/>'
                    + '<input id="btnIbSend" type="button" value="Send"/>'
                + '</div>'
            + '</div>' // end of 'ib-reply'
        + '</div>', // end of 'ib'

        threadHtml: String()
        + '<div class="ib-list-item">'
            + '<div class="ib-list-item-labels"><span></span></div>'
            + '<div class="ib-list-item-content">'
                + '<div class="ib-list-item-chk"><input type="checkbox"/></div>'
                + '<img class="ib-list-item-avatar"/>'
                + '<div class="ib-list-item-preview">'
                    + '<div class="ib-list-item-preview-name"/>'
                    + '<div class="ib-item-preview-snippet"/>'
                + '</div>'
                + '<div class="ib-list-item-ta">'
                    + '<input type="hidden" class="chatTimeAsNumber"/>'
                    + '<div class="ib-list-item-ta-time"></div>'
                    + '<div class="ib-list-item-ta-action"></div>'
                + '</div>'
            + '</div>'
        + '</div>',

        labelHtml: '<label><input type="checkbox"/>One</label>',

        labelOption: '<option data-value="" value=""/>'
    };

    this._jqMap = {};

    this.onListItemSelectionStateChangeEventHandlerBind = this.onListItemSelectionStateChangeEventHandler.bind(this);
    this.onCheckboxAllThreadChangedEventHandlerBind = this.onCheckboxAllThreadChangedEventHandler.bind(this);
    this.onButtonReplyClickedEventHandlerBind = this.onButtonReplyClickedEventHandler.bind(this);
    this.onButtonNewLabelClickedEventHandlerBind = this.onButtonNewLabelClickedEventHandler.bind(this);
    this.onButtonIbCancelClickedEventHandlerBind = this.onButtonIbCancelClickedEventHandler.bind(this);
    this.onButtonIbSendClickedEventHandlerBind = this.onButtonIbSendClickedEventHandler.bind(this);
    this.onLabelSelectionStateChangeEventHandlerBind = this.onLabelSelectionStateChangeEventHandler.bind(this);
}

InboxChatListView.prototype = {
    initView: function() {
        this._jqContainer.html(this._configMap.ibHtml);

        var jqMap = this._jqContainer.find('.ib');
        jqMap.spanNumberOfConversationsSelectedCount = jqMap.find('.ib-threads-filters-actions-selected');
        jqMap.ibLabelsList = jqMap.find('.ib-labels-list');
        jqMap.ibListThreads = jqMap.find('.ib-list-threads-threads');
        jqMap.labelOptions = jqMap.find('#labelOptions');
        jqMap.chkAllThreads = jqMap.find('#chkAllThreads');
        jqMap.btnReply = jqMap.find('#btnReply');
        jqMap.btnIbCancel = jqMap.find('#btnIbCancel');
        jqMap.btnIbSend = jqMap.find('#btnIbSend');
        jqMap.btnAddNewLabel = jqMap.find('#btnAddNewLabel');
        jqMap.tfNewLabelName = jqMap.find('#tfNewLabelName');

        this._jqMap = jqMap;

        this.setupEventHandler();
    },

    setupEventHandler: function() {
        // all 'change' events bubbled from checkboxes inside this._jqMap.ibListThreads will be handled by this handler.
        var jqMap = this._jqMap;
        jqMap.ibLabelsList.on('change', this.onLabelSelectionStateChangeEventHandlerBind);
        jqMap.ibListThreads.on('change', this.onListItemSelectionStateChangeEventHandlerBind);
        jqMap.chkAllThreads.on('change', this.onCheckboxAllThreadChangedEventHandlerBind);
        jqMap.btnReply.on('click', this.onButtonReplyClickedEventHandlerBind);
        jqMap.btnIbCancel.on('click', this.onButtonIbCancelClickedEventHandlerBind);
        jqMap.btnAddNewLabel.on('click', this.onButtonNewLabelClickedEventHandlerBind);
        jqMap.btnIbSend.on('click', this.onButtonIbSendClickedEventHandlerBind);
    },

    onLabelSelectionStateChangeEventHandler: function(event) {
        let target = event.target;
        if ('type' in target && target.type === 'checkbox') {
            let model = this._model;
            if (target.checked) {
                model.addLabelToDisplayingConversations(target['value']);
            } else {
                model.removeLabelFromDisplayingConversations(target['value']);
            }
        }

        var displayingConversations = this._model.getDisplayingConversations();
        this.updateChatListView(displayingConversations, 0, displayingConversations.length - 1, false);
    },

    onListItemSelectionStateChangeEventHandler: function(event) {
        var target = event.target;
        if ('type' in target && target.type === 'checkbox') {
            var index = parseInt(target.name);
            var model = this._model;
            var displayingConversations = model.getDisplayingConversations();
            var conversation = displayingConversations[index];
            //console.log(target.value + "; " + target.name);

            if (target.checked) {
                conversation['selected'] = true;
                //var arrayLength = model.getSelectedConversations().push(conversation);
                //conversation['selectedIndex'] = arrayLength - 1;

                this._stateMap.numberOfConversationsSelected++;
            } else {
                conversation['selected'] = false;
                //console.log("from model: " + model.getSelectedConversations()[conversation['selectedIndex']].id);
                //model.getSelectedConversations()[conversation['selectedIndex']] = null;
                //conversation['selectedIndex'] = -1;

                this._stateMap.numberOfConversationsSelected--;
            }

            this.updateNumberOfConversationsSelectedView(this._stateMap.numberOfConversationsSelected);
        }
    },

    onCheckboxAllThreadChangedEventHandler: function(event) {
        var chkThreads = this._jqMap.ibListThreads.find('input[type=checkbox]');

        var checked = event.target.checked;
        chkThreads.prop('checked', checked);
        this._stateMap.numberOfConversationsSelected = checked ? chkThreads.length : 0;
        this.updateNumberOfConversationsSelectedView(this._stateMap.numberOfConversationsSelected);
    },

    onButtonNewLabelClickedEventHandler: function(event) {

    },

    onButtonReplyClickedEventHandler: function(event) {
        var jqIbReply = jQuery('.ib-reply');

        spa.util.center(jqIbReply);
        jqIbReply.removeClass('hidden');

        jQuery('#popup-bg').removeClass('hidden');
    },

    onButtonIbSendClickedEventHandler: function(event) {

    },

    onButtonIbCancelClickedEventHandler: function(event) {
        var jqIbReply = jQuery('.ib-reply');
        jqIbReply.addClass('hidden');

        jQuery('#popup-bg').addClass('hidden');
    },

    show: function() {
        var model = this._model;

        var displayingConversations = model.getDisplayingConversations();
        this.updateChatListView(displayingConversations, 0, displayingConversations.length - 1, false);

        var labels = model.getLabels();
        var labelsLength = labels.length;
        this.buildLabelListView(labels, 0, labelsLength - 1);
        this.buildLabelOptionView(labels, 0, labelsLength - 1);

        //this.generateInboxSmsPreview(conversations);
        //this.buildAutoCtrlView();
    },

    hide: function() {
        this._jqMap.ib.addClass("hidden");
    },

    disposeView: function() {
        this._model = null;
        if ('ib' in this._jqMap) {
            this._jqMap.ib.empty();
            this._jqMap.ib.remove();
        }
    },

    /**
     * render all conversations from 'fromIndex' to 'toIndex' (included).
     * @param conversations
     * @param fromIndex
     * @param toIndex
     */
    updateChatListView: function(conversations, fromIndex, toIndex, toAppend) {

        var docFrag = this.generateInboxSnippet(conversations, fromIndex, toIndex);
        if (!toAppend) {
            this._jqMap.ibListThreads.empty();
        }
        this._jqMap.ibListThreads.get(0).appendChild(docFrag);

        var conversationsLength = conversations.length;
        var _toIndex = conversationsLength < toIndex ? conversationsLength : toIndex;;
        this._stateMap.conversationIndexRendred = _toIndex;
    },

    /**
     * render all labels from 'fromIndex' to 'toIndex' (included).
     * @param labels
     * @returns {DocumentFragment}
     */
    buildLabelListView: function(labels, fromIndex, toIndex) {
        var ibLabelsList = this._jqMap.ibLabelsList;
        var labelListDocFrag = this.generateLabelList(labels, fromIndex, toIndex);
        ibLabelsList.get(0).appendChild(labelListDocFrag);
    },

    buildLabelOptionView: function(labels, fromIndex, toIndex) {
        var ibLabelsOptions = this._jqMap.labelOptions;
        var labelOptionsDocFrag = this.generateLabelOptions(labels, fromIndex, toIndex);
        ibLabelsOptions.get(0).appendChild(labelOptionsDocFrag);
    },

    updateNumberOfConversationsSelectedView: function(newVal) {
        this._jqMap.spanNumberOfConversationsSelectedCount.html(newVal);
    },

    /**
     *
     * @param conversations
     * @returns {DocumentFragment}
     */
    generateInboxSnippet: function(conversations, fromIndex, toIndex) {
        var d = new Date();

        //var outLoop = 10;
        var conversationsLength = conversations.length;

        var _fromIndex = fromIndex;
        var _toIndex = conversationsLength < toIndex ? conversationsLength : toIndex;

        var doc = document;
        var docFrag = document.createDocumentFragment();

        // var start = new Date().getTime();

        //for(var a = 0; a < outLoop; ++a, _fromIndex = fromIndex)
            for (; _fromIndex <= _toIndex; ++_fromIndex) {
                var conversation = conversations[_fromIndex];
                if (conversation == null) {
                    continue;
                }

                /*+ '<div class="ib-list-item">'
                 +      '<div class="ib-list-item-labels"><span></span></div>'
                 +      '<div class="ib-list-item-content">'
                 +          '<div class="ib-list-item-chk"><input type="checkbox"/></div>'
                 +          '<img class="ib-list-item-avatar"/>'
                 +          '<div class="ib-list-item-preview">'
                 +              '<div class="ib-list-item-preview-name"/>'
                 +              '<div class="ib-item-preview-snippet"/>'
                 +          '</div>'
                 +          '<div class="ib-list-item-ta">'
                 +              '<input type="hidden" class="chatTimeAsNumber"/>'
                 +              '<div class="ib-list-item-ta-time"/>'
                 +              '<div class="ib-list-item-ta-action"/>'
                 +          '</div>'
                 +      '</div>'
                 + '</div>',*/

                var participant = conversation['participants'][0];

                var listItem = doc.createElement('div');
                listItem.className = 'ib-list-item';

                var listItemLabelsSpan = doc.createElement('span');
                var listItemLabels = doc.createElement('div');
                listItemLabels.className = 'ib-list-item-labels';
                listItemLabels.appendChild(listItemLabelsSpan);

                var listItemContent = doc.createElement('div');
                listItemContent.className = 'ib-list-item-content';

                var listItemChk = doc.createElement('input')
                listItemChk.setAttribute('type', 'checkbox')
                listItemChk.setAttribute('value', conversation['id']);
                listItemChk.setAttribute('name', _fromIndex);
                var listItemChkDiv = doc.createElement('div');
                listItemChkDiv.className = 'ib-list-item-chk';
                listItemChkDiv.appendChild(listItemChk);

                var listItemAvatar = doc.createElement('img');
                listItemAvatar.className = 'ib-list-item-avatar';
                listItemAvatar.setAttribute('src', participant['picture']);

                var listItemPreview = doc.createElement('div');
                listItemPreview.className = 'ib-list-item-preview';
                var listItemPreviewName = doc.createElement('div');
                listItemPreviewName.className = 'ib-list-item-preview-name';
                var listItemPreviewSnippet = doc.createElement('div');
                listItemPreviewSnippet.className = 'ib-item-preview-snippet';
                listItemPreview.appendChild(listItemPreviewName);
                listItemPreview.appendChild(listItemPreviewSnippet);
                listItemPreviewName.appendChild(doc.createTextNode(participant['name']));
                listItemPreviewSnippet.appendChild(doc.createTextNode(conversation['snippet']));

                var listItemTa = doc.createElement('div');
                listItemTa.className = 'ib-list-item-ta';
                var listItemTaHidden = doc.createElement('input');
                listItemTaHidden.setAttribute('type', 'hidden');
                var listItemTaTime = doc.createElement('div');
                listItemTaTime.className = 'ib-list-item-ta-time';
                var listItemTaAction = doc.createElement('div');
                listItemTaAction.className = 'ib-list-item-ta-action';
                listItemTa.appendChild(listItemTaHidden);
                listItemTa.appendChild(listItemTaTime);
                listItemTa.appendChild(listItemTaAction);
                listItemTaHidden.setAttribute('value', conversation['updatedTime']);
                d.setTime(conversation['updatedTime']);
                listItemTaTime.appendChild(doc.createTextNode(d.getHours() + ':' + d.getMinutes() + ' ' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getYear()));

                listItemContent.appendChild(listItemChkDiv);
                listItemContent.appendChild(listItemAvatar);
                listItemContent.appendChild(listItemPreview);
                listItemContent.appendChild(listItemTa);

                listItem.appendChild(listItemLabels);
                listItem.appendChild(listItemContent);

                docFrag.appendChild(listItem);
            }
        return docFrag;
    },

    /**
     *
     * @param labelList a list of label JSON
     *          Ex: [{'label': 'One', 'id': 'label1'}, ...]
     */
    generateLabelList: function(labelList, fromIndex, toIndex) {
        var labelListLength = labelList.length;
        var _fromIndex = fromIndex;
        var _toIndex = labelListLength < toIndex ? labelListLength : toIndex;

        var doc = document;
        var docFrag = document.createDocumentFragment();

        for (; _fromIndex <= _toIndex; ++_fromIndex) {
            // '<label><input type="checkbox"/>One</label>'

            var label = labelList[_fromIndex];
            //console.log("THE LABEL: ");
            //console.log(label);

            var spanTag = doc.createElement('span');
            spanTag.className = 'chk-span';

            var inputTag = doc.createElement('input');
            inputTag.setAttribute('type', 'checkbox')
            inputTag.setAttribute('value', label['id']);
            spanTag.appendChild(inputTag);
            spanTag.appendChild(doc.createTextNode(label['label']));

            docFrag.appendChild(spanTag);
        }

        return docFrag;
    },

    generateLabelOptions: function(labelList, fromIndex, toIndex) {
        var labelListLength = labelList.length;
        var _fromIndex = fromIndex;
        var _toIndex = labelListLength < toIndex ? labelListLength : toIndex;

        var doc = document;
        var docFrag = document.createDocumentFragment();

        for (; _fromIndex <= _toIndex; ++_fromIndex) {
            // '<option data-value="" value=""/>'

            var label = labelList[_fromIndex];

            var optionTag = doc.createElement('option');
            optionTag.setAttribute('data-value', label['id']);
            optionTag.setAttribute('value', label['label']);

            docFrag.appendChild(optionTag);
        }

        return docFrag;
    },

    generateInboxSmsPreview: function(conversations) {
        //var docFrag = this.generateInboxSnippet(conversations, 0, conversations.length - 1);
        //this._jqMap.ibPanelAutoPreview.get(0).appendChild(docFrag);
    },

    buildAutoCtrlView: function() {
        //var labelView = this._jqMap.ibPanelAutoCtrl.find(".ib-list-filter-label");
        //var labelItems = this.buildLabelsViewItems(this._model.getLabels());
        //labelView.get(0).appendChild(labelItems);
    }
};
