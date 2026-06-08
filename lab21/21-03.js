const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const dataUsers = require("./data.js");
const session = require("express-session");

const PORT = 8082;

const app = express();

app.use(express.urlencoded({ extended: true }));

passport.use(
  new LocalStrategy(
    { usernameField: "login", passwordField: 'password' },
    (username, password, done) => {
      const user = dataUsers.find(
        (user) => user.login === username && user.password === password,
      );

      if (user) return done(null, user);

      return done(null, false, { message: "Incorrect login or password" });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.login);
});

passport.deserializeUser((login, done) => {
  const user = dataUsers.find((user) => user.login === login);
  done(null, user);
});

app.use(
  session({
    name: "sessionID-forms",
    secret: "forms-auth",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/login", (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      <input name="login" placeholder="Login" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Войти</button>
    </form>
  `);
});

app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login'
  })
);

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Error with logout");

    req.session.destroy((err) => {
      if (err) return res.status(500).send("Error destroying session");
      res.clearCookie("sessionID-forms", { path: "/" });
      res.send("Logout");
    });
  });
});

app.get("/resource", (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  res.send("RESOURCE");
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}/`),
);
