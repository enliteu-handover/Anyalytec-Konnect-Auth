/**
 * Module dependencies.
 */
import util from "util";
import { Strategy as OAuth2Strategy } from "passport-oauth2";

import { StrategyOptionsWithRequest } from "passport-oauth2";

export interface SlackOptions extends StrategyOptionsWithRequest {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  profileURL?: string;
  profileUrl?: string;
  team?: string;
  user_scope?: string;
  name?: string;
}

/**
 * `Strategy` constructor.
 *
 * The Slack authentication strategy authenticates requests by delegating
 * to Slack using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`               your Slack application's client id
 *   - `clientSecret`           your Slack application's client secret
 *   - `callbackURL`            URL to which Slack will redirect the user after granting authorization
 *   - `scope`                  array of permission scopes to request defaults to:
 *                              ['identity.basic', 'identity.email', 'identity.avatar', 'identity.team']
 *                              full set of scopes: https://api.slack.com/docs/oauth-scopes
 *
 * Examples:
 *
 *     passport.use(new SlackStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/slack/callback',
 *         scope: ['identity.basic', 'channels:read', 'chat:write:user', 'client', 'admin']
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} SlackOptions
 * @param {Function} VerifyCallback
 * @api public
 */
function Strategy(this: any, options: SlackOptions, verify: any) {
  options = options || {};
  options.tokenURL = options.tokenURL || "https://slack.com/api/oauth.access";
  options.authorizationURL =
    options.authorizationURL || "https://slack.com/oauth/authorize";
  options.scope = options.scope || [
    "identity.basic",
    "identity.email",
    "identity.avatar",
    "identity.team",
  ];

  var defaultProfileUrl = "https://slack.com/api/users.identity"; // requires 'identity.basic' scope
  this.profileUrl =
    options.profileURL || options.profileUrl || defaultProfileUrl;
  this._team = options.team;
  this._user_scope = options.user_scope;

  OAuth2Strategy.call(this, options, verify);
  this.name = options.name || "Slack";

  // warn is not enough scope
  // Details on Slack's identity scope - https://api.slack.com/methods/users.identity
  if (
    !this._skipUserProfile &&
    this.profileUrl === defaultProfileUrl &&
    this._scope.indexOf("identity.basic") === -1
  ) {
    console.warn(
      "Scope 'identity.basic' is required to retrieve Slack user profile"
    );
  }
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Slack.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `Slack`
 *   - `id`               the user's ID
 *   - `displayName`      the user's full name
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function (accessToken: string, done: any) {
  var header = {
    Authorization: "Bearer " + accessToken,
  };
  this.get(
    this.profileUrl,
    header,
    function (err: Error, body: any, _res: any) {
      if (err) {
        return done(err);
      } else {
        try {
          var profile = JSON.parse(body);

          if (!profile.ok) {
            done(body);
          } else {
            delete profile.ok;

            profile.provider = "Slack";
            profile.id = profile.user.id;
            profile.displayName = profile.user.name;

            done(null, profile);
          }
        } catch (e) {
          done(e);
        }
      }
    }
  );
};

/** The default oauth2 strategy puts the access_token into Authorization: header AND query string
 * which is a violation of the RFC so lets override and not add the header and supply only the token for qs.
 */
Strategy.prototype.get = function (url: string, header: any, callback: any) {
  this._oauth2._request("GET", url, header, "", "", callback);
};

/**
 * Return extra Slack parameters to be included in the authorization
 * request.
 *
 * @param {Object} options
 * @return {Object}
 */
Strategy.prototype.authorizationParams = function (options: any) {
  var params: any = {};

  var team = options.team || this._team;
  if (team) {
    params.team = team;
  }

  var user_scope = options.user_scope || this._user_scope;
  if (user_scope) {
    if (Array.isArray(user_scope)) {
      user_scope = user_scope.join(this._scopeSeparator);
    }
    params.user_scope = user_scope;
  }

  return params;
};

export { Strategy };
