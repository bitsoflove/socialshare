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
        //$('.share-google-plus').on('click', shareGooglePlus);

        var $googlePlusButtons = $('.share-google-plus');
        share.initGooglePlusButtons($googlePlusButtons);
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

        var $container = $(this).closest('div');

        var shareObject = {
            description: $container.find('h2').text().trim() + ': ' + $container.find('p').text(),
            hashtag: '#bitsoflove',
            url: 'http://bitsoflove.be'
        };
        share.twitter(shareObject);
    }

    function shareLinkedin(event) {
        event.preventDefault();
        var $container = $(this).closest('div');

        var shareObject = {
            name: $container.find('h2').text(),
            url: 'http://bitsoflove.be',
            description: $container.find('p').text()
        };
        share.linkedin(shareObject);
    }

    function shareGooglePlus(event) {
        event.preventDefault();

        var elId = $(this).attr('id');

        var options = {
            contenturl: 'https://plus.google.com/pages/',
            contentdeeplinkid: '/pages',
            prefilltext: 'Create your Google+ Page too!',
            calltoactionlabel: 'CREATE',
            calltoactionurl: 'http://plus.google.com/pages/create',
            calltoactiondeeplinkid: '/pages/create'
        };

        share.googleplus(elId, options);
    }

    function getConfig(callback) {
        $.getJSON('socialshare-config.json', callback);
    }

    return {
        init: init
    };

})();


$(document).on('ready', bol.main.init);
