var util = require('util'),
    OAuth2Strategy = require('passport-oauth2');

/**
 * KaKaoStrategy 생성자.<br/>
 * @param options.clientID 필수. kakao rest app key.
 * @param options.callbackURL 필수. 로그인 처리 후 호출할 URL
 * @param verify
 * @constructor
 */
function Strategy(options, verify) {
    var oauthHost = 'https://kauth.kakao.com';
    options = options || {};
    options.authorizationURL = oauthHost + '/oauth/authorize';
    options.tokenURL = oauthHost + '/oauth/token';

    // 실제로 clientSecret이 쓰이진 않으나 OAuth2Strategy에선 필수 파라메터라서 더미값 넣음
    options.clientSecret = 'kakao';

    options.scopeSeparator = options.scopeSeparator || ',';
    options.customHeaders = options.customHeaders || {};


    if (!options.customHeaders['User-Agent']) {
        options.customHeaders['User-Agent'] = options.userAgent || 'passport-kakao';
    }

    OAuth2Strategy.call(this, options, verify);
    this.name = 'kakao';
    this._userProfileURL = 'https://kapi.kakao.com/v1/user/me';

    // client secret이 파라메터에 있으면 엑세스 토큰 조회시 에러가 나므로 생성에서만 쓰고 생성 후엔 삭제한다.
    delete this._oauth2._clientSecret;
}

/**
 * `OAuth2Stragegy`를 상속 받는다.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * kakao 사용자 정보를 얻는다.<br/>
 * 사용자 정보를 성공적으로 조회하면 아래의 object가 done 콜백함수 호출과 함꼐 넘어간다.
 *
 *   - `provider`         kakao 고정
 *   - `id`               kakao user id number
 *   - `username`         사용자의 kakao nickname
 *   - `_raw`             json string 원문
 *   _ `_json`            json 원 데이터
 *
 * @param {String} accessToken
 * @param {Function} done
 */
Strategy.prototype.userProfile = function(accessToken, done) {
    this._oauth2.get(this._userProfileURL, accessToken, function(err, body, res) {
        if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

        try {
            var json = JSON.parse(body);
            var profile = { provider: 'kakao' };
            profile.id = json.id;

            // 카카오톡이나 카카오스토리에 연동한 적이 없는 계정의 경우
            // properties가 비어있다고 한다. 없을 경우의 처리
            var properties = json.properties || {
                nickname: '미연동 계정'
            };
            profile.username = properties.nickname;
            profile.displayName = properties.nickname;

            profile._raw = body;
            profile.username = json.properties.nickname;
            profile._json = json;
            return done(null, profile);
        } catch (e) {
            return done(e);
        }
    });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;