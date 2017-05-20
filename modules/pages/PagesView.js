'use strict'

/**
 * Created by hieule on 1/13/17.
 */
function PagesView(jqContainer, model) {
    this._model = model; // this should be of type PagesModel

    this._jqContainer = jqContainer;

    this._configMap = {
        pagesHtml: String()
        + '<div class="pages hidden">'
        + '</div>',

        pageThumbnailHtml: String()
        + '<a class="pages-thumbnail" href="">'
            + '<div class="pages-thumbnail-item">'
                + '<div class="pages-thumbnail-item-title"></div>'
                + '<div class="pages-thumbnail-item-imgfr">'
                    + '<img class="pages-thumbnail-imgfr-img" src=""/>'
                + '</div>'
            + '</div>'
        + '</a>'
    };

    this._jqMap = {};

    this.pageLinkClickedEvent = new Event(this);
}

PagesView.prototype = {
    initView: function() {
        this._jqContainer.html(this._configMap.pagesHtml);

        this._jqMap.pages = this._jqContainer.find('.pages');
    },

    firePageLinkClicked: function(event) {
        this.pageLinkClickedEvent.notify([jQuery(event.delegateTarget).attr('id')]);
        return false;
    },

    show: function() {
        this.buildView();
        this._jqMap.pages.removeClass("hidden");
    },

    hide: function() {
        this._jqMap.pages.addClass("hidden");
    },

    disposeView: function() {
        this._model = null;

        if ('pages' in this._jqMap) {
            this._jqMap.pages.empty();
            this._jqMap.pages.remove();
        }
    },

    buildView: function() {
        var jqPages = this._jqMap.pages;

        // remove current html content
        jqPages.html('');

        var i = 0, a = 0;
        var items = this._model.getItems();
        for (var a = 0; a < 20; ++a, i = 0)
        for (; i < items.length; ++i) {
            var item = items[i];

            var jqThumbnail = jQuery(this._configMap.pageThumbnailHtml);
            jqThumbnail.attr('id', item['id']);

            //set name
            var jqTitle = jqThumbnail.find('.pages-thumbnail-item-title');
            jqTitle.html(item['name']);

            //set avatar
            var jqImage = jqThumbnail.find(".pages-thumbnail-imgfr-img");
            jqImage.attr("src", item['picture']);

            jqPages.append(jqThumbnail);

            // setup event handler for this page link
            jqThumbnail.on('click', this.firePageLinkClicked.bind(this));
        }
    }
};