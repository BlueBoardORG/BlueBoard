import passport from "passport";
import dotenv from "dotenv";
import createWelcomeBoard from "./createWelcomeBoard";
const { Strategy } = require("passport-shraga");
import { transformUser } from "../app/components/utils";
import authConfig from "./authConfig";

dotenv.config();

const configurePassport = db => {
  const users = db.collection("users");
  const boards = db.collection("boards");

  passport.serializeUser((user, cb) => {
    cb(null, user._id);
  });
  passport.deserializeUser((id, cb) => {
    users.findOne({_id: id }).then(user => {
      if((user && !user.provider) || !user){
        cb(null, false);
      }
      cb(null, transformUser(user));
    });
  });

  const {shragaURL, callbackURL} = authConfig;


  passport.use(new Strategy({shragaURL, callbackURL}, (profile, done) => {
    profile = { ...profile };
    profile._id = profile.id;
    delete profile.id;
    users.replaceOne({ _id: profile._id }, profile, { upsert: true })
      .then((result) => {
        if(result.upsertedCount){
          boards
            .insertOne(createWelcomeBoard(profile._id))
            .then(() => done(null, transformUser(profile)));
        } else {
          done(null, transformUser(profile));
        }
        
      });
  }))
};


export default configurePassport;
