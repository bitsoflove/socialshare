var bol = bol || {};

bol.socialShare = (function(options) {

    var fbImage;
    var fbTitle;
    var fbSiteName;
    var fbUrl;
    var fbDescription;
    var fbCaption;
    var hashtags;

    var url;
    var _self;

    initialize();

    function initialize() {
        if (checkOptionsProvided()) {
            initializeFacebook();
            initializeTwitter();
            initializeGooglePlus();
        }
    }

    function initializeGooglePlus() {

    }

    function initializeTwitter() {
        injectTwitterScript();
    }

    function initializeFacebook() {
        prepareFacebookOptions();
        injectFacebookScript();
        initializeNativeFacebookLikeButtons();
    }

    function initializeNativeFacebookLikeButtons() {

        $('.btn-fb-like').each(function() {
            var url = $(this).attr('data-url');

            var width = 100;
            var height = 35;
            var layout = 'button';
            var action = 'like';
            var share = 'true';
            var showFaces = false;
            var share = $(this).attr('data-share') || true;

            var qs = '&layout=' + layout + '&action=' + action + '&share=' + share + '&width=' + width + '&height=' + height + '&show_faces=' + showFaces + '&appId=' + options.facebook.appId;

            url += qs;

            var html = '<iframe src="//www.facebook.com/plugins/like.php?href=' + encodeURI(url) + '" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:' + width + '; height:' + height + ';" allowTransparency="true"></iframe>';

            $(this).replaceWith($(html));
        });


    }

    function checkOptionsProvided() {
        if (!options) {
            consoleError('bol.socialShare: No options provided');
            return false;
        } else {
            return true;
        }
    }

    function consoleLog(log, arg) {
        if (console && console.log) {
            console.log('socialShare: ' + log, arg);
        }
    }

    function consoleWarning(warn, arg) {
        if (console && console.warn) {
            console.warn('socialShare: ' + warn, arg);
        }
    }

    function consoleError(error, arg) {
        if (console && console.error) {
            console.error('socialShare: ' + error, arg);
        }
    }



    function postToTwitter(text, hashtag) {

    }

    /**
     * Share to faceook with options
     * Options = {
     *    url: 'http://google.com',
     *    img: 'http://placehold.it/293x332',
     *    name: 'Social Share Demo',
     *    caption: 'Caption',
     *    description: 'Description',
     *    actions: [{
     *        name: 'Social Share Action Link',
     *        link: 'http://action.com'
     *    }]
     * }
     */
    function postToFacebook(options, callback) {

        options = options || {};

        if (options.url) {
            options.href = options.url;
            options.link = options.url;
        }
        if (options.img) {
            options.picture = options.img;
        }

        options.method = 'feed';

        consoleLog('about to post to facebook', options);

        FB.ui(options, function(response) {
            if (typeof(callback) === 'function') {
                callback(response);
            }
        });

    }

    function postToLinkedIn() {

    }

    function postToGooglePlus() {

    }

    function injectTwitterScript() {
        window.twttr = (function(d, s, id) {
            var t, js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = 'https://platform.twitter.com/widgets.js';
            fjs.parentNode.insertBefore(js, fjs);
            return window.twttr || (t = {
                _e: [],
                ready: function(f) {
                    t._e.push(f);
                }
            });
        }(document, 'script', 'twitter-wjs'));
    }


    function prepareFacebookOptions() {
        var fbOptions = (options && options.facebook) ? options.facebook : {};
        fbOptions.language = fbOptions.language || 'en_US';
        fbOptions.xfbml = fbOptions.xfbml || false;
        fbOptions.status = fbOptions.status || true;
        fbOptions.version = fbOptions.version || 'v2.1';

        if (!fbOptions.appId) {
            console.error('No facebook appId provided');
            return;
        }
    }


    function injectFacebookScript() {

        //grab facebook options (and set defaults)
        var fbOptions = options.facebook;

        window.fbAsyncInit = function() {
            FB.init(fbOptions);
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//connect.facebook.net/' + fbOptions.language + '/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    return {
        facebook: postToFacebook,
        twitter: postToTwitter,
        linkedin: postToLinkedIn,
        googleplus: postToGooglePlus
    };


});
