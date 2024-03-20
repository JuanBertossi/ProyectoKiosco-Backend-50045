const passport = require("passport");
const local = require("passport-local");
const UserModel = require("../models/user.model.js");
const GitHubStrategy = require("passport-github2");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          let user = await UserModel.findOne({ email: email });
          if (user) return done(null, false);
          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          let result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Login passport
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            console.log("Este usuario no existe");
            return done(null, false);
          }
          if (!isValidPassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
  });
};

//Para GitHub:
passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID: "Iv1.3f4e86b9c1d8b611",
      clientSecret: "de83fcc1721d414e503d14bbe28676aaf4a12558",
      callbackURL: "http://localhost:8080/api/sessions/githubcallback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      try {
        let user = await UserModel.findOne({ email: profile._json.email });
        if (!user) {
          let newUser = {
            first_name: profile._json.name,
            last_name: "secreto",
            age: 37,
            email: profile._json.email,
            password: "secreto",
          };
          let result = await UserModel.create(newUser);
          done(null, result);
        } else {
          done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

module.exports = initializePassport;
