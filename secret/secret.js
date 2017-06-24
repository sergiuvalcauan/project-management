module.exports = {
    auth: {
        user: 'testapp9991@gmail.com' ,
        pass: 'Q1mH00tt'
    },

    facebook: {
        clientID: '1861759354108916', //Facebook login app id
        clientSecret: 'c88516cf29c19d5d591189d013a7c254', //Facebook login secret key
        profileFields: ['email', 'displayName'],
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        passReqToCallback: true
    }
}
