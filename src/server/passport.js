import passport from "passport";
import dotenv from "dotenv";
import { Strategy as LocalStrategy } from "passport-local";
import authConfig from "./authConfig";
import createWelcomeBoard from "./createWelcomeBoard";
const { Strategy } = require("passport-shraga");
import { transformUser } from "../app/components/utils";

dotenv.config();

const configurePassport = db => {
  const users = db.collection("users");
  const boards = db.collection("boards");

  passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  passport.deserializeUser((id, cb) => {
    users.findOne({_id: id }).then(user => {
      cb(null, transformUser(user));
    });
  });

  passport.use(new LocalStrategy(
    function(username, password, cb) {
      let profile={id:username+password,displayName:username}
      users.findOne({ name: username }).then(user => {
        if (user) {
          cb(null, user);
        } else {
          const newUser = {
            _id: profile.id,
            name: profile.displayName,
            imageUrl: null
          };
          users.insertOne(newUser).then(() => {
            boards
              .insertOne(createWelcomeBoard(profile.id))
              .then(() => cb(null, newUser));
          });
        }
      });
    }
  ));

  const config = { shragaURL: "http://localhost:3000", callbackURL: "http://localhost:1337/auth/shraga" };

  passport.use(new Strategy(config, (profile, done) => {
    profile = {...profile};
    profile._id = profile.id;
    delete profile.id;
    users.findOne({ _id: profile.id }).then(user => {
      if (user) {
        done(null, user);
      } else {
        users.insertOne(profile).then(() => {
          boards
            .insertOne(createWelcomeBoard(profile.id))
            .then(() => done(null, transformUser(profile)));
        });
      }
    });
  }
  ))
};

export default configurePassport;
