[Demo](code.bitsoflove.be/socialshare/)




###Description
BoL Social Share is yet another social share javascript library. It can share to the four biggest networks (facebook, twitter, google plus and linked in). Initializiation is done through a config file with settings for every network (eg. app id's). BoL Social Share is different from other social-share libraries because it allows for a broad customization of the share dialogs.



###Benefits

- No need to load additional scripts

    facebook, twitter and google-plus scripts are injected when needed

- 1 naming convention for all supported social networks

- Supports default share buttons (without app ID) as well as custom share buttons


###Prerequisites
#### OG-tags
When Facebook is one of the platforms you're going to support, you should always integrate OG-tags.
This is because people sometimes copy-paste your link straight into facebook, rather than using the provided links. Handling OG-tags is **NOT** something BoL socialshare does for you.

Therefore: first make sure you've set your [OG meta tags](https://developers.facebook.com/docs/sharing/best-practices) for Facebook.
- Your page-wide og:image tag should be at least 1200x630 pixels
- **Always read the [guidelines](https://developers.facebook.com/docs/sharing/best-practices) for the latest information.**



###Usage
####Easiest: Via ss-attributes and classes
All share options are set via attributes and classes.

#####ss-attributes
Global options are set as **ss-attributes** on the shareable element.
In the example below, we have defined a default image, URL and hashtag. We advise to use attributes over classes (see later) whenever you want to define social share content that's not 100% the same as your actual content. (Some things, like hashtag, are usually absent in the content anyway)

#####ss-classes
If you would like to use the content of an element as a social share property (eg. title, description, img, url, ...), you can simply add the corresponding **ss-** class to that element. BoL SocialShare will then use this content for your social share

**IMPORTANT**

Be sure to add a **ss-buttons** class to the element containing your actual share buttons. This element also needs a **ss-container-id** attribute, which points to the container element of the shareable content.



**Example:**
```html
<div id="news-item-1"
     ss-img="http://code.bitsoflove.be/socialshare/demo/img/social1.jpg"
     ss-url="http://code.bitsoflove.be/socialshare/"
     ss-hashtag="socialshare"
 >

    <h1 class="ss-title">
        Data Visualization in Belgium
    </h1>
    <p class="ss-description">
        Belgium has come a long way concerning data visualizations.
        A startup company named Bits of Love has recently changed the scene.
    </p>
</div>


<ul class="ss-buttons" ss-container-id="newsitem1" >
    <li><a class="ss-facebook" href="#">Share on Facebook</a></li>
    <li><a class="ss-twitter" href="#">Share on Twitter</a></li>
    <li><a class="ss-linkedin" href="#">Share on LinkedIn</a></li>
    <li><a class="ss-googleplus" href="#">Share on Google Plus</a></li>
</ul>

```


```javascript
var share = new bol.socialShare({
    facebook: {
        appId: '__YOUR_FACEBOOK_APP_ID',
        xfbml: false,
        status: true
    },
    googleplus: {
        clientId: '__YOUR_GOOGLE_PLUS_CLIENT_ID__',
        cta: "VISIT"
    }
});
```


======================================================================================================


#####List of ss-attributes and classes.
All of the below can be used as a class or as an attribute.

- ss-hashtag
- ss-image
- ss-title
- ss-url
- ss-cta-url
- ss-cta-text
- ss-cta-btn
- ss-prefill
- ss-description
- ss-caption
- ss-name




####Advanced: Via Javascript

If you want to specify all of the sharing options manually, we support that, too!

When using javascript, it is advised not to use the **ss-** classes and attributes at all.

All you have to do is bind your clicklisteners to the social share library.
Below is some example code to get you started
```javascript


var share = bol.socialShare(config);


$('.share-facebook').on('click', shareFacebook);
$('.share-twitter').on('click', shareTwitter);
$('.share-linkedin').on('click', shareLinkedin);

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
```




<!--
Use images that are at least 1200 x 630 pixels for the best display on high resolution devices. At the minimum, you should use images that are 600 x 315 pixels to display link page posts with larger images.

###Options



###Facebook

Read the guidelines for up-to-date information!

og:image should be at least 1200x630 px
-->
