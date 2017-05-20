/**
 * Created by hieule on 1/14/17.
 */
function InboxView(jqContainer, model) {
    this._model = model; // this should be of type PagesModel

    this._jqContainer = jqContainer;

    this._configMap = {
        pagesHtml: String()
        + '<div class="inbox">'
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
}

InboxView.prototype = {

};