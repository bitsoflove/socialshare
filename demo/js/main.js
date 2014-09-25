var bol = bol || {};

bol.main = (function() {

    var share;

    function init() {
        //grab the config json file, and initialize the social share lib
        getConfig(initSocialShare);
    }

    function initSocialShare(config) {

        //initialize social share lib
        share = bol.socialShare(config);

        //add click listeners to elements that will use the lib
        addShareClickListeners();
    }

    function addShareClickListeners() {
        $('.share-facebook').on('click', shareFacebook);
        $('.share-twitter').on('click', shareTwitter);
        $('.share-linkedin').on('click', shareLinkedin);
        $('.share-google-plus').on('click', shareGooglePlus);
    }

    function shareFacebook(event) {
        event.preventDefault();

        var $container = $(this).closest('div');

        var shareObject = {
            name: $container.find('h2').text(),
            caption: $container.find('p').text(),
            description: $('#caption').text(),
            url: 'http://bitsoflove.be/',
            img: location.href + $container.find('img').attr('src'),
            actions: [{
                name: 'Learn more about DataViz!',
                link: 'http://bitsoflove.be/dataviz'
            }]
        };

        share.facebook(shareObject);
    }

    function shareTwitter(event) {
        event.preventDefault();
        share.twitter();
    }

    function shareLinkedin(event) {
        event.preventDefault();
        share.linkedin();
    }

    function shareGooglePlus(event) {
        event.preventDefault();
        share.googleplus();
    }

    function getConfig(callback) {
        $.getJSON('socialshare-config.json', callback);
    }

    return {
        init: init
    };

})();


$(document).on('ready', bol.main.init);
