"use strict";
/**
 * Created by hieule on 1/15/17.
 */
function InboxChatListModel(conversations) {
    //this._conversations = conversations;

    this._labels = [
        {'label': 'All', 'id': 'all'},
        {'label': 'No Label', 'id': '__nolabel__'},
        {'label': 'One', 'id': 'label1'},
        {'label': 'Two', 'id': 'label2'},
        {'label': 'Three', 'id': 'label3'},
        {'label': 'Four', 'id': 'label4'},
        {'label': 'Five', 'id': 'label5'},
        {'label': 'Six', 'id': 'label6'},
        {'label': 'Seven', 'id': 'label7'},
        {'label': 'Eight', 'id': 'label8'},
        {'label': 'Nine', 'id': 'label9'},
        {'label': 'Ten', 'id': 'label10'},
        {'label': 'Eleven', 'id': 'label11'},
        {'label': 'Twelve', 'id': 'label12'}
    ];

    //this._selectedConversations = new Array();

    this._allConversations_dummy = [
        {
            "link": "/NuocHoaBonMua/manager/messages/?threadid=1316883845051281&folder=inbox",
            "id": "t_mid.1482907756817:51eb76d114",
            "updatedTime": 1484548507000,
            "snippet": "Hello 1",
            "participants": [
                {
                    "name": "Momo Mai 1",
                    "id": "1319387298134269",
                    "picture": "images/a.jpg"
                },
                {
                    "name": "N\u01b0\u1edbc Hoa B\u1ed1n M\u00f9a",
                    "id": "1405924026328697",
                    "picture": "images/bbc.jpg"
                }
            ],
            "labels": ['label1', 'label2']
        },
        {
            "link": "/NuocHoaBonMua/manager/messages/?threadid=1316883845051281&folder=inbox",
            "id": "t_mid.1482907756817:51eb76d113",
            "updatedTime": 1484548507000,
            "snippet": "Hello 2",
            "participants": [
                {
                    "name": "Momo Mai 2",
                    "id": "1319387298134269",
                    "picture": "images/a.jpg"
                },
                {
                    "name": "N\u01b0\u1edbc Hoa B\u1ed1n M\u00f9a",
                    "id": "1405924026328697",
                    "picture": "images/tiin.png"
                }
            ],
            "labels": ['label3']
        },
        {
            "link": "/NuocHoaBonMua/manager/messages/?threadid=1316883845051281&folder=inbox",
            "id": "t_mid.1482907756817:51eb76d115",
            "updatedTime": 1484548507000,
            "snippet": "Hello 3",
            "participants": [
                {
                    "name": "Momo Mai 3",
                    "id": "1319387298134269",
                    "picture": "images/b.png"
                },
                {
                    "name": "N\u01b0\u1edbc Hoa B\u1ed1n M\u00f9a",
                    "id": "1405924026328697",
                    "picture": "images/eng.jpg"
                }
            ],
            "labels": ['label2']
        },
        {
            "link": "/NuocHoaBonMua/manager/messages/?threadid=1316883845051281&folder=inbox",
            "id": "t_mid.1482907756817:51eb76d112",
            "updatedTime": 1484548507000,
            "snippet": "Hello 4",
            "participants": [
                {
                    "name": "Momo Mai 4",
                    "id": "1319387298134269",
                    "picture": "images/a.jpg"
                },
                {
                    "name": "N\u01b0\u1edbc Hoa B\u1ed1n M\u00f9a",
                    "id": "1405924026328697",
                    "picture": "images/bbc.jpg"
                }
            ],
            "labels": ['label1']
        },
        {
            "link": "/NuocHoaBonMua/manager/messages/?threadid=1316883845051281&folder=inbox",
            "id": "t_mid.1482907756817:51eb76d111",
            "updatedTime": 1484548507000,
            "snippet": "Hello 5",
            "participants": [
                {
                    "name": "Momo Mai 5",
                    "id": "1319387298134269",
                    "picture": "images/a.jpg"
                },
                {
                    "name": "N\u01b0\u1edbc Hoa B\u1ed1n M\u00f9a",
                    "id": "1405924026328697",
                    "picture": "images/tiin.png"
                }
            ],
            "labels": ['label4']
        },
        {
            "link": "/NuocHoaBonMua/manager/messages/?threadid=1316883845051281&folder=inbox",
            "id": "t_mid.1482907756817:51eb76d116",
            "updatedTime": 1484548507000,
            "snippet": "Hello 6",
            "participants": [
                {
                    "name": "Momo Mai 6",
                    "id": "1319387298134269",
                    "picture": "images/b.png"
                },
                {
                    "name": "N\u01b0\u1edbc Hoa B\u1ed1n M\u00f9a",
                    "id": "1405924026328697",
                    "picture": "images/eng.jpg"
                }
            ]
        }
    ];

    this._displayingConversationIndex = 0;
    this._displayingConversationNullCount = 0;
    this._displayingConversations = [];//this._allConversations;

    this._conversationsByLabels = [];

    /* a list of label's IDs */
    this._displayingLabels = [
    ];
}

InboxChatListModel.prototype = {
    initData: function() {
        for(let i = 0; i < this._allConversations_dummy.length; ++i) {
            this.addConversation(this._allConversations_dummy[i]);
        }
    },

    getAllConversations: function() {
        return this._allConversations;
    },

    setAllConversations: function(allConversations) {
        this._allConversations = allConversations;
    },

    getDisplayingConversations: function() {
        return this._displayingConversations;
    },

    getLabels: function() {
        return this._labels;
    },

    setLabels: function(labels) {
        this._labels = labels;
    },

    addLabelToDisplayingConversations: function(labelId) {
        let conversationsByLabels = this._conversationsByLabels;
        let displayingLabels = this._displayingLabels;
        let displayingConversations = this._displayingConversations;

        let conversations = conversationsByLabels[labelId];

        if (conversations) { // if 'conversations' exists.
            let conversationsLength = conversations.length;

            //now loop through 'conversations' and add each item into 'displayingConversations'
            for(let i = 0; i < conversationsLength; ++i) {
                let currentConversation = conversations[i];
                let labelsOfCurrentConversation = currentConversation['labels'];
                let l = labelsOfCurrentConversation.length;

                let included = false;

                // 'cause a conversation could belong to more than one labels, so this check is to make sure
                // this the 'currentConversation' is not in the 'displayingConversations' already.
                for(let j = 0;j < l; ++j) {
                    if (displayingLabels.includes(labelsOfCurrentConversation[j])) {
                        included = true;
                        break;
                    }
                }
                // if this conversation's label is in _displayingLabels, i.e. this conversation should be in _displayingConversations already
                // if this conversation's label is not in _displayingLabels, i.e. this conversation is not in _displayingConversations,
                // so it should be put in _displayingConversations now.
                if (!included) {
                    currentConversation['displayIndex'] = this._displayingConversationIndex++;
                    displayingConversations.push(currentConversation);
                }
            }
        }

        displayingLabels.push(labelId);
    },

    removeLabelFromDisplayingConversations: function(labelId) {
        let conversationsByLabels = this._conversationsByLabels;
        let displayingLabels = this._displayingLabels;
        let displayingConversations = this._displayingConversations;
        let displayingConversationsLength = displayingConversations.length;

        //remove 'labelId' from displayingLabels.

        displayingLabels.splice(displayingLabels.indexOf(labelId), 1);

        for (let i = 0; i < displayingConversationsLength; ++i) {
            let currentConversation = displayingConversations[i];
            if (currentConversation == null) {
                continue;
            }
            let leaveCurrentConversationInDisplayingConversations = false;

            let currentConversationLabels = currentConversation['labels'];
            if (currentConversationLabels) { // if 'currentConversation' has 'labels'
                let currentConversationLabelsLength = currentConversationLabels.length;
                if (currentConversationLabelsLength == 0 && labelId === '__nolabel__') {
                    displayingConversations[i] = null;
                } else if (currentConversationLabelsLength == 1 && currentConversationLabels[0] === labelId) {
                    //displayingConversationsLength.splice(i, 1);
                    displayingConversations[i] = null;
                } else {
                    for (let j = 0; j < currentConversationLabelsLength; ++j) {
                        let cLabel = currentConversationLabels[j];
                        if (cLabel !== labelId && displayingLabels.includes(cLabel)) {
                            leaveCurrentConversationInDisplayingConversations = true;
                            break;
                        }
                    }
                }
            }

            if (!leaveCurrentConversationInDisplayingConversations) {
                displayingConversations[i] = null;
            }
        }
    },

    addConversation: function (conversation) {
        let labels = null;
        if ('labels' in conversation) {
            labels = conversation['labels'];
        } else {
            labels = ['__nolabel__'];   // conversation with no label will be put in this._conversationsByLabels['__nolabel__']
            conversation['labels'] = labels;
        }
        let labelsLength = labels.length;
        let cbl = this._conversationsByLabels;
        for(let i = 0; i < labelsLength; ++i) {
            if (!cbl[labels[i]]) {
                cbl[labels[i]] = [];
            }
            cbl[labels[i]].push(conversation);
        }
    }
};


/*
 chat data structure example from Facebook:
 {
     "link": "/NuocHoaBonMua/manager/messages/?threadid=1316883845051281&folder=inbox",
     "id": "t_mid.1482907756817:51eb76d113",
     "updatedTime": "2016-12-29T09:16:35+0000",
     "snippet": "V\u00e2ng",
     "participants": [
         {
             "name": "Momo Mai",
             "id": "1319387298134269",
             "picture": "{link to picture}"
         },
         {
             "name": "N\u01b0\u1edbc Hoa B\u1ed1n M\u00f9a",
             "id": "1405924026328697",
             "picture": "{link to picture}"
         }
     ],
     "selected": {true|false},
     "displayIndex": 3, // index of this conversation in this._displayingConversations.
                        // negative value indicates this conversation is not in this._displayingConversation.
 }
 */