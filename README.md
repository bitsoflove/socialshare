todo: register on bower




###Description
BoL Social Share is yet another social share javascript library. It can share to the four biggest networks (facebook, twitter, google plus and linked in). Initializiation is done through a config file with settings for every network (eg. app id's). When sharing to twitter, URL's are automatically shortened when a bitly access token has been provided in the config.


###Usage

1. Set OG meta tags for facebook
2. create options object
3.      > var share = new bol.socialShare(options);
4.      > share.twitter(text);
        > share.facebook(a,b,c)
        > share.linkedin()
        > share.googleplus()

###Options
```javascript
{
    facebook: {
        appId: '__YOUR_APP_ID',
    }
    bitly: {
        token: '__YOUR_BITLY_TOKEN__'
    }
}
```


###Facebook

    Read the guidelines for up-to-date information!

    og:image should be at least 1200x630 px
