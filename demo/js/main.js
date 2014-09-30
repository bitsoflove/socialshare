var bol = bol || {};

bol.main = (function() {

    var share;

    function init() {
        //grab the config json file, and initialize the social share lib
        $.getJSON('socialshare-config.json', function(config) {
            share = bol.socialShare(config);
        });

    }

    function initSocialShare(config) {

        //initialize social share lib
        //share = bol.socialShare(config);

        /*
        var $containers = $('.socialshare-container');

        $containers.each(function() {

            var $container = $(this);

            $container.bolSocialShare({});

            share = new bol.socialShare($container, {
                config: {
                    language: "en_US",
                    facebook: {
                        appId: 772740719449905,
                        options: {
                            title: $container.closest('div').find('h1'),
                            description
                            actions

                        }
                    },
                    googleplus: {
                        clientId: "562607671653-th6jbbfopr2hnpfpfarpqv83f6g4luq8.apps.googleusercontent.com",
                        cta: "VISIT",
                        options: {
                            contenturl: 'http://bitsoflove.be',
                            contentdeeplinkid: '/vis',
                            prefilltext: 'Create your own data visualizations with this tool!',
                            calltoactionlabel: 'CREATE',
                            calltoactionurl: 'http://bitsoflove.be',
                            calltoactiondeeplinkid: '/vis/create'
                        }
                    },
                    twitter: {
                        description
                        title
                    },
                    linkedin: {
                        description
                        title
                    }
                }
            });

        });
*/

        //add click listeners to elements that will use the lib
        //addShareClickListeners();
    }

    /*
    function addShareClickListeners() {
        $('.share-facebook').on('click', shareFacebook);
        $('.share-twitter').on('click', shareTwitter);
        $('.share-linkedin').on('click', shareLinkedin);
        //$('.share-google-plus').on('click', shareGooglePlus);

        var $googlePlusButtons = $('.share-google-plus');
        $googlePlusButtons.each(function() {
            var $this = $(this);
            var options = {
                contenturl: 'http://bitsoflove.be',
                contentdeeplinkid: '/vis',
                prefilltext: 'Create your own data visualizations with this tool!',
                calltoactionlabel: 'CREATE',
                calltoactionurl: 'http://bitsoflove.be',
                calltoactiondeeplinkid: '/vis/create'
            };
            share.initGooglePlusButton($this, options);
        });
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

    */
    function getConfig(callback) {
        $.getJSON('socialshare-config.json', callback);
    }


    return {
        init: init
    };

})();


$(document).on('ready', bol.main.init);
