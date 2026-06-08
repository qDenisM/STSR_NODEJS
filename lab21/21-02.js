const express = require('express')
const passport = require('passport')
const DigestStrategy = require('passport-http').DigestStrategy
const dataUsers = require('./data.js')
const session = require('express-session')

const PORT = 8081

const app = express()

passport.use(new DigestStrategy(
    {realm: 'Digest Authentication'},
    (username, done) => {
    const user = dataUsers.find(user => user.login === username)
    
    if (user)
        return done(null, user, user.password)
    
    return done(null, false, { message: 'Incorrect login or password' })
}))

passport.serializeUser((user, done) => {
    done(null, user.login)
})

passport.deserializeUser((login, done) => {
    const user = dataUsers.find(user => user.login === login)
    done(null, user)
})

app.use(session(
    {
        name: 'sessionID-digest',
        secret: 'digest-auth',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: false,
        }
    }
))

app.use(passport.initialize())
app.use(passport.session())

app.get('/login', 
    passport.authenticate('digest'), 
    (req, res) => {
    res.send(`Login as ${req.user.login}`)
})

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err)
            return res.status(500).send('Error with logout')
    
        req.session.destroy((err) => {
        if (err) 
            return res.status(500).send('Error destroying session');
        res.clearCookie('sessionID-digest', { path: '/' });
        res.send('Logout');
    });
    })
})

app.get('/resource', (req, res) => {
    if (!req.isAuthenticated())
        return res.redirect('/login')
    res.send('RESOURCE')
})

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}/`))