
const basename = typeof(__DEV__) !== 'undefined' ? '/' : '/ch/heliosight/';

export default {
    routeMatch: /\/ch\/heliosight/,
    navigation: {
        easyinsights_index: function (e) {
            return basename;
        },
        easyinsights_search: function(e) {
            return basename+'search/'+e.query;
        },
        easyinsights_expand_card: function(e) {
            return basename+'search/'+e.query+'/'+e.cardId;
        }
    }
};
