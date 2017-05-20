/**
 * Created by hieule on 1/13/17.
 */
function PagesModel(items) {
    //this._items = items;
    this._items = [
        {
            id: 'id1',
            name: "page1",
            picture: 'images/a.jpg'
        },
        {
            id: 'id2',
            name: "page2",
            picture: 'images/bbc.jpg'
        },
        {
            id: 'id3',
            name: "page3",
            picture: 'images/eng.jpg'
        },
        {
            id: 'id4',
            name: "page4",
            picture: 'images/b.png'
        },
        {
            id: 'id5',
            name: "page5",
            picture: 'images/tiin.png'
        }
    ];
}

PagesModel.prototype = {
    getItems: function() {
        return this._items;
    },

    /**
     *
     * @param items an array
     */
    setItems: function(items) {
        this._items = items;
    }
};