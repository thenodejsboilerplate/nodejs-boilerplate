// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : 'your-secret-clientID-here', // your App ID
        'clientSecret'  : 'your-client-secret-here', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '686520850572-u203iegsat9i5nn3136j2igfsobf9hv7.apps.googleusercontent.com',
        'clientSecret'  : 'otw5yuDlG1sSnubxc3pYDa_y',
        'callbackURL'   : 'http://localhost:8000/auth/google/callback'
    }

};