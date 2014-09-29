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


    var googlePlusScriptLoaded = false;

    function initialize() {
        if (checkOptionsProvided()) {
            initializeFacebook();
            initializeTwitter();
            initializeGooglePlus();
        }
    }

    function initializeGooglePlus() {
        injectGooglePlusScript(onGooglePlusScriptLoaded);
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

            var html = '<iframe src="//www.facebook.com/plugins/like.php?href=' + encodeURI(url) + '" scrolling="no" frameborder="0" style="border:none; overflow:hidden" allowTransparency="true"></iframe>';

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



    /**
     * options
     *     description
     *     hashtag
     *     url
     */
    function postToTwitter(options) {

        var twitterUrl = 'http://twitter.com/share?text=' + encodeURIComponent(options.description) + '&url=' + encodeURIComponent(options.url) + '&hashtags=' + options.hashtag;

        popupCenter(twitterUrl, 'Twitter', 600, 300);
    }

    function popupCenter(url, title, w, h) {
        // Fixes dual-screen position                       Most browsers      Firefox
        var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

        var left = ((screen.width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((screen.height / 2) - (h / 2)) + dualScreenTop;
        var newWindow = window.open(url, title, 'width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        // Puts focus on the newWindow
        if (window.focus) {
            newWindow.focus();
        }
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

    function postToLinkedIn(options) {
        var url = 'http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(options.fbUrl) + '&title=' + options.name + '&summary=' + options.description + '&source=';
        popupCenter(url, options.name, 600, 300);
    }



    /**
     * Wait 50ms for google to initialize its library,
     * then execute all logic that's waiting !
     */
    function onGooglePlusScriptLoaded() {

        setTimeout(function() {

            googlePlusScriptLoaded = true;

            for (var i = googlePlusQueue.length - 1; i >= 0; i--) {
                var item = googlePlusQueue[i];

                //Function.call(item[0], item[1]);
                var theFunction = item[0];
                theFunction(item[1]);
            }
        }, 50);
    }

    var googlePlusQueue = [];

    function initGooglePlusButtons($btns) {

        if (googlePlusScriptLoaded) {
            $btns.each(function() {

                var $this = $(this);

                var elId = $(this).attr('id');

                var _options = {
                    contenturl: 'https://plus.google.com/pages/',
                    contentdeeplinkid: '/pages',
                    prefilltext: 'Create your Google+ Page too!',
                    calltoactionlabel: 'CREATE',
                    calltoactionurl: 'http://plus.google.com/pages/create',
                    calltoactiondeeplinkid: '/pages/create'
                };

                _options.clientid = options.googleplus.clientId;
                _options.cookiepolicy = 'single_host_origin';



                gapi.interactivepost.render(elId, _options);
            });
        } else {
            //put this function call in the queue.
            //it will be exected when the google plus script has been loaded
            googlePlusQueue.push([arguments.callee, $btns]);
        }
    }

    function postToGooglePlus(elementId, _options) {

        var $this = $('#' + elementId);

        var dummyBtnId = 'gpib-' + elementId;
        $this.after('<button id="' + dummyBtnId + '" style="display:none">Dummy Google-Plus Interactive Button</button>');

        //wait 200ms for the google library to do its magic, and trigger the click event on the button
        setTimeout(function() {
            $("#" + dummyBtnId).trigger('click');
        }, 200);



        _options.clientid = options.googleplus.clientId;
        _options.cookiepolicy = 'single_host_origin';

        // Call the render method when appropriate within your app to display
        // the button.
        gapi.interactivepost.render(dummyBtnId, _options);

    }


    function prepareFacebookOptions() {
        var fbOptions = (options && options.facebook) ? options.facebook : {};
        fbOptions.language = options.language || 'en_US';
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

    function injectGooglePlusScript(c) {
        //1. inject the global page share script
        window.___gcfg = {
            lang: options.language || 'en-US'
        };

        (function() {
            var po = document.createElement('script');
            po.type = 'text/javascript';
            po.async = true;
            po.src = '//apis.google.com/js/plusone.js';
            var s = document.getElementsByTagName('script')[0];

            s.parentNode.insertBefore(po, s);

            if (c) {
                s.addEventListener('load', function(e) {
                    setTimeout(function() {
                        c(null, e);
                    }, 50);

                }, false);
            }
        })();
    }

    function injectTwitterScript() {
        window.twttr = (function(d, s, id) {
            var t, js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//platform.twitter.com/widgets.js';
            fjs.parentNode.insertBefore(js, fjs);
            return window.twttr || (t = {
                _e: [],
                ready: function(f) {
                    t._e.push(f);
                }
            });
        }(document, 'script', 'twitter-wjs'));
    }

    return {
        facebook: postToFacebook,
        twitter: postToTwitter,
        linkedin: postToLinkedIn,
        googleplus: postToGooglePlus,

        initGooglePlusButtons: initGooglePlusButtons
    };


});
