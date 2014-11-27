var bol = bol || {};

bol.socialShare = (function(options) {

    var googlePlusQueue = [];
    var initializedLibraries = {};
    initialize();

    var googlePlusScriptLoaded = false;

    function initialize() {
        if (checkOptionsProvided()) {
            initializeFacebook();
            initializeTwitter();
            initializeGooglePlus();

            autoInitializeButtons();
        }
    }

    function autoInitializeButtons() {
        var $ssButtons = $('.ss-buttons');
        if(!$ssButtons.length) {
            consoleWarning('Could not find any ss-buttons.');
        }
        
        $ssButtons.each(function() {
            var $container = $(this);
            var contentId = $container.attr('ss-container-id');
            var $contentContainer = $('#' + contentId);
            var contentVariables = getContentVariables($contentContainer);
            var $btns = $container.find('[ss-button]');
            
            if(!$btns.length) {
                consoleWarning('Found ss-buttons group, but no ss-button inside!');
            }

            $btns.each(function() {
                var $btn = $(this);
                var btnType = $btn.attr('ss-button');
                var options = contentVariables[btnType];
                initializeShareButton($btn, btnType, options);
            });
        });
    }

    function getContentVariables($container) {
        if ($container.length) {

            //grab the default values, set as ss- attributes on the $container
            var defaults = getDefaultValues($container);

            //grab the specific values, set as ss-classes on the $container's children
            var specifics = getSpecificValues($container);

            //merge defaults with specifics.
            var options = mergeDefaultsWithSpecifics(defaults, specifics);

            //prepare object for all networks
            var preparedOptions = prepareOptionsForAllNetworks(options);

            return preparedOptions;

        } else {
            consoleError('No valid ss-container-id provided')
        }
    }

    function prepareOptionsForAllNetworks(_options) {


        //first do some pre-processing
        if (_options.url == '[current]') {
            _options.url = window.location.href;
        }


        var facebook = prepareFacebookOptions(_options);
        var twitter = prepareTwitterOptions(_options);
        var linkedin = prepareLinkedInOptions(_options);
        var googleplus = prepareGooglePlusOptions(_options);

        return {
            facebook: facebook,
            twitter: twitter,
            linkedin: linkedin,
            googleplus: googleplus
        };
    }

    function prepareLinkedInOptions(_options) {
        return {
            name: _options.title,
            url: _options.url,
            description: _options.description
        };
    }

    function prepareGooglePlusOptions(_options) {
        return {
            contenturl: _options.url,
            //contentdeeplinkid: '/vis',
            prefilltext: _options.prefill,
            calltoactionlabel: _options['cta-btn'],
            calltoactionurl: _options['cta-url'] || _options.url,
            //calltoactiondeeplinkid: '/vis/create'
        };
    }


    function prepareTwitterOptions(_options) {
        return {
            description: _options.prefill,
            hashtag: '#' + _options.hashtag,
            url: _options.url
        };
    }

    function prepareFacebookOptions(_options) {
        var facebookOptions = {
            name: _options.title,
            caption: _options.prefill,
            description: _options.description,
            url: _options.url,
            img: _options.img,
        };

        //only add the actions property when both cta-name and cta-url have been provided
        if (_options['cta-name'] && _options['cta-url']) {
            facebookOptions.actions = [{
                name: _options['cta-name'],
                link: _options['cta-url']
            }];
        }

        return facebookOptions;
    }

    function mergeDefaultsWithSpecifics(defaults, specifics) {
        //clone the defaults object
        var options = jQuery.extend(true, {}, defaults);

        for (var key in specifics) {
            options[key] = specifics[key];
        }

        return options;
    }


    //grab all the values of elements with a class starting with ss-
    //trigger a warning whenever there's multiple elements with the same class
    function getSpecificValues($container) {
        var specificValues = {};
        var $specifics = $container.find('[class^=ss-]');

        $specifics.each(function() {
            var $specific = $(this);
            var classes = $specific.attr('class').split(' ');
            for (var i = classes.length - 1; i >= 0; i--) {
                var theClass = classes[i];

                if (theClass.indexOf('ss-') === 0) {
                    var key = theClass.substr(3); //remove the ss- prefix

                    if (specificValues[key]) {
                        consoleWarning('' + theClass + ' has been defined more than once in the same container');
                    }

                    specificValues[key] = $specific.text().trim();
                }
            }
        });

        return specificValues;
    }

    //grab all the attributes on $container starting with ss-
    function getDefaultValues($container) {
        var defaultValues = {};
        var item = $container[0];

        for (var attributeKey in item.attributes) {
            var attribute = item.attributes[attributeKey];
            if (attribute.nodeName && attribute.nodeName.indexOf('ss-') === 0) {
                var key = attribute.nodeName.substr(3); //remove the ss- prefix
                var value = attribute.nodeValue;
                defaultValues[key] = value;
            }
        }

        return defaultValues;
    }

    function initializeShareButton($btn, type, _options, callback) {

        //google plus is a special case: we create an interactive post
        if (type === 'googleplus') {
            initGooglePlusButton($btn, _options);
        } else {
            //for all others, we add a click listener to the button
            $btn.on('click', function(event) {
                event.preventDefault();

                if (type === 'facebook') {
                    postToFacebook(_options, function(response) {
                        if (typeof(callback) === 'function') {
                            callback(type, response, _options, $btn);
                        }
                    });
                } else if (type === 'twitter') {
                    postToTwitter(_options);
                } else if (type === 'linkedin') {
                    postToLinkedIn(options);
                }
            });
        }
    }

    function initializeGooglePlus() {
        if (typeof(initializedLibraries.googleplus) === 'undefined') {
            initializedLibraries.googleplus = false;
            injectGooglePlusScript(onGooglePlusScriptLoaded);
        }

    }

    function initializeTwitter() {

        if (typeof(initializedLibraries.twitter) === 'undefined') {
            initializedLibraries.twitter = false;
            injectTwitterScript(onTwitterScriptLoaded);
        }
    }

    function initializeFacebook() {
        if (typeof(initializedLibraries.facebook) === 'undefined') {
            initializedLibraries.facebook = false;

            prepareFacebookOptionsOld();
            injectFacebookScript();
            initializeNativeFacebookLikeButtons();
        }
    }

    function initializeNativeFacebookLikeButtons() {

        $('.ss-fb-like').each(function() {
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
        if (console && console.log && options.debug) {
            console.log('socialShare: ' + log, arg);
        }
    }

    function consoleWarning(warn, arg) {
        if (console && console.warn && options.debug) {
            console.warn('socialShare: ' + warn, arg);
        }
    }

    function consoleError(error, arg) {
        if (console && console.error && options.debug) {
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
        var url = 'http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(options.url) + '&title=' + options.name + '&summary=' + options.description + '&source=';
        popupCenter(url, options.name, 600, 300);
    }



    /**
     * Wait 50ms for google to initialize its library,
     * then execute all logic that's waiting !
     */
    function onGooglePlusScriptLoaded() {

        setTimeout(function() {

            googlePlusScriptLoaded = true;
            initializedLibraries.googleplus = true;

            for (var i = googlePlusQueue.length - 1; i >= 0; i--) {
                var item = googlePlusQueue[i];

                var theFunction = item[0];
                theFunction(item[1], item[2]);
            }
        }, 50);
    }

    function onTwitterScriptLoaded() {
        initializedLibraries.twitter = true;
    }



    function initGooglePlusButton($btn, _options) {

        if (googlePlusScriptLoaded) {
            var elId = $btn.attr('id');

            _options.clientid = options.googleplus.clientId;
            _options.cookiepolicy = 'single_host_origin';
            gapi.interactivepost.render(elId, _options);
        } else {
            //put this function call in the queue.
            //it will be exected when the google plus script has been loaded
            googlePlusQueue.push([arguments.callee, $btn, _options]);
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


    function prepareFacebookOptionsOld() {
        var fbOptions = (options && options.facebook) ? options.facebook : {};
        fbOptions.language = options.language || 'en_US';
        fbOptions.xfbml = fbOptions.xfbml || false;
        fbOptions.status = fbOptions.status || true;
        fbOptions.version = fbOptions.version || 'v2.1';

        if (!fbOptions.appId) {
            consoleError('No facebook appId provided');
            return;
        }
    }


    function injectFacebookScript() {

        //grab facebook options (and set defaults)
        var fbOptions = options.facebook;

        window.fbAsyncInit = function() {
            FB.init(fbOptions);
            initializedLibraries.facebook = true;
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

    function injectTwitterScript(c) {
        window.twttr = (function(d, s, id) {
            var t, js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = '//platform.twitter.com/widgets.js';
            fjs.parentNode.insertBefore(js, fjs);


            if (c) {
                fjs.addEventListener('load', function(e) {
                    setTimeout(function() {
                        c(null, e);
                    }, 50);

                }, false);
            }

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

        initGooglePlusButton: initGooglePlusButton
    };


});
