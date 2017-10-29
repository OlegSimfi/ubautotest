## **UB** authentication schema

Actually this is modified DIGEST schema with SHA256 hash algorithm and modified authorization mechanism.
In case of this schema usage UnityBase store client passwords hash in `upasswordHashHexa` attribute of `uba_user` entity.
Schema is protected from MIT type of attack and secure enough for most type of application.

On the UI client enter a `userName` & `password`, after this client must send a two request:

### 1) Request a nonce
Client call `auth` endpoint passing `userName` as parameter.

    -> GET|POST appName/auth?AUTHTYPE=UB&userName=admin

Server return a `serverNonce` - one time public key **valid for 5 minutes** in a result field

    <- 200 OK
    {"result":"c0a94994a9baaf5f6f071a13c6b5f7c4f8219e1ba514d9f0b81df57cc4b4b81f"}


### 2) Sending hashed password and obtain a `sessionWord`
Client generate `clientNonce`, calculate hash of his password
and call auth again, passing as parameters `userName`, `clientNonce` and password hashed with `nonces`.

    -> GET|POST appName/auth?AUTHTYPE=UB&
      clientNonce=ffac6401331cce72e82ecfa8dd40c8cb4456098000392da2bac8c41d19b57467&
      password=09561d07211a8ef1d125355bfb5e871028826484a30bde6c98562742d2e9460e
      &userName=admin

here:

    clientNonce = unique string client generate and memorize
    secretWord = sha256('salt' + passwordWhatUserEnterDuringLogin)
    password=sha256(appName + serverNonce + clientNonce + userName + secretWord)


Server return `sessionPrivateKey`, used in future request as one of signature part.

    <- 200 OK
    {
        "result":"537445910+634e82b0aa70c0ec67395d59935f1cec36c14cedc4cc824049e175109987d1c6",
        "logonname":"admin",
        "uData": {}
    }

`result` in response is a `sessionPrivateKey`. First part of result before `+` is `clientSessionID`.

Consider what neither password, nor password hash not transferred other the wire, so the MIT attack is impossible.


JavaScript implementation:

    var secretWord, sessionPrivateKey, hexa8ID;
    promise = me.get('auth', {
        params: {
            AUTHTYPE: authSchema,
            userName: authParams.login
        }
    }).then(function(resp){
        var
            serverNonce = resp.data.result,
            SHA256 = CryptoJS.SHA256;
        if (!serverNonce) throw new Error('invalid auth response');
        var clientNonce = SHA256(new Date().toISOString().substr(0, 16)).toString();
        var pwdHash = SHA256('salt' + authParams.password).toString();
        secretWord = pwdHash;
        return me.get('auth', {
            params: {
                AUTHTYPE: authSchema,
                userName: authParams.login,
                password: SHA256(appName.toLowerCase() + serverNonce +
                    clientNonce + authParams.login + pwdHash).toString(),
                clientNonce: clientNonce
            }
        });
    }).then(function(response){
        sessionPrivateKey = response.result;
        hexa8ID = hexa8(sessionWord.split('+')[0]);
    });