var path = require('path').join.bind(this,__dirname);

module.exports = {
    resolve: {
        alias: {
            'config/navigation': path('./navigation.js'),
            'stores/TeamStore': path('../common/stores/TeamStore.js'),
            'components/Spinner': path('../common/components/Spinner.js')
        }
    }
};
