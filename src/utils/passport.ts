import { APP_URL, AUTH_REDIRECT, GOOGLE_AUTH } from "./../constants";
import passport from "passport";
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth20";
import * as UserService from "../services/users.service";
import { User, UserAttributes } from "../db/models/user";
import { server } from "../index";

let validateUserAndRedirect = async (
  _accessToken: string,
  _refreshToken: string,
  profile: passport.Profile,
  done: VerifyCallback
) => {
  try {
    let redirect_url = APP_URL;
    let email_id: string | undefined =
      profile.emails && profile.emails[0].value;
    if (!email_id) {
      redirect_url = `${APP_URL}/user-not-found/`; // fallback page
      return done(null, redirect_url);
    }
    let userInstance: User | null = await UserService.findUnique({
      email_id,
    } as UserAttributes);
    if (!userInstance) {
      userInstance = await UserService.create({
        email_id,
      } as UserAttributes);
    }
    let token: string = server.jwt.sign({
      id: userInstance.id,
      email_id: userInstance.email_id,
    });
    redirect_url = `${APP_URL}/?auth_token=${token}`;
    return done(null, redirect_url);
  } catch (error: any) {
    console.error(error);
    return done(error);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_AUTH.CLIENT_ID,
      clientSecret: GOOGLE_AUTH.SECRET,
      callbackURL: `/api/v1/auth/google/${AUTH_REDIRECT}`,
    },
    validateUserAndRedirect
  )
);

export default passport;
