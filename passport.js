const config = require('config')
const GOOGLE_CLIENT_ID = config.get('GOOGLE_CLIENT_ID')
const GOOGLE_CLIENT_SECRET = config.get('GOOGLE_CLIENT_SECRET')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User')
const passport = require('passport')







passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await User.findOne({ googleId: profile.id })
            if (!user) {
                user = new User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                })
                await user.save()
            }
            return done(null, user)
        } catch (error) {
            return done(error, null)
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        done(error, null)
    }
})


// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:5000/auth/google/callback"
// },
//     async (accessToken, refreshToken, profile, done) => {
//         try {
//             const user = await User.findOne({ googleId: profile.id });
//             if (!user) {
//                 user = new User({
//                     googleId: profile.id,
//                     name: profile.displayName,
//                     email: profile.emails[0].value,
//                     avatar: profile.photos[0].value
//                 });
//                 await user.save();
//             }
//             return done(null, user);
//         } catch (err) {
//             return done(err, null);
//         }
//     }
// ));

// passport.serializeUser((user, done) => {
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await User.findById(id);
//         done(null, user);
//     } catch (err) {
//         done(err, null);
//     }
// });