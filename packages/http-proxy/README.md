# HTTP(S) proxy for UnityBase

Reverse proxy with authentication
 
Code below will add a `cms` endpoint.

On every request to cms endpoint will check UB authentication header is valid (if not - return 401)
and after this proxy all requests for `cms` endpoint to the `http://localhost:3030`.

For requests what start from `/ubcms` authentication not checked

I.e. `GET /cms/some/path&p1=true` will be proxies to `GET http://localhost:3030/some/path&p1=true`
 
```JavaScript
const HttpProxy = require('@unitybase/http-proxy')
new HttpProxy({
    endpoint: 'cms',
    targetURL: 'http://localhost:3030',
    nonAuthorizedURLs: [///ubcms/]
})
```
