<h1 align="center">
    <b>
        <a href="https://axios-http.com">
            <img src="assets/authbird_logo.png" alt="AuthBird Logo"/>
        </a>
    </b>
</h1>

<p align="center">
    <a href="https://authbird.com/"><b>Website</b></a> &nbsp; | &nbsp;
    <a href="https://docs.authbird.com"><b>Documentation</b></a>
</p>

<div align="center">

[![npm version](https://img.shields.io/npm/v/@authbird/client-sdk.svg?style=flat-square)](https://www.npmjs.org/package/@authbird/client-sdk)
[![Build status](https://img.shields.io/github/actions/workflow/status/authbird/client-sdk/release.yml?branch=main&label=CI&logo=github&style=flat-square)](https://github.com/authbird/client-sdk/actions/workflows/release.yml)

</div>

# AuthBird Client SDK

## Getting Started

Before you can use this SDK, you need to create an account on [authbird.com](https://authbird.com).

Please check out the detailed [docs](https://docs.authbird.com).

## 1. Installation

```shell
npm install @authbird/client-sdk
```

## CDN

UNPKG.com

```html

<script src="https://unpkg.com/@authbird/client-sdk@1.0.0/lib/cjs/index.js"></script>
```

jsDelivr.com

```html

<script src="https://cdn.jsdelivr.net/npm/@authbird/client-sdk@1.0.0/lib/cjs/index.js"></script>
```

## Usage

After the package is installed, the library can be imported using import or require approach:

### 2. Import the SDK

```javascript
const authbird = require('@authbird/client-sdk');
```

or

```typescript
import {init, session, browser} from '@authbird/client-sdk';
```

### Init the SDK

Initialize the SDK with your appId and appSecret.

```javascript
authbird.init({
  appId: '<your appId>',
  appSecret: '<your appSecret>'
});
```

### 3. Authentication flow

#### a) Browser flow

To simplify the user login process for the browser, we have developed a straightforward function. 

```javascript
const user = await authbird.browser.loginUser('<login provider>');
```

Example response data:

```json
{
 "accessToken": "<accessToken>",
 "profile": {
  "photoUrl": "<photoUrl>",
  "provider": "<provider>",
  "displayName": "<displayName>",
  "id": "<id>",
  "email": "<email>"
 }
}
```

#### b) Session flow

If you desire greater control, you have the option to manage sessions on your own.

##### Create Session

```javascript
const newSession = await authbird.session.create();
```

Example response data:

```json
{
 "sessionId": "<sessionId>",
 "sessionSecret": "<sessionSecret>",
 "loginUrls": {
  "google": "https://api.authbird.com/auth/google?sessionId=<sessionId>",
  "facebook": "https://api.authbird.com/auth/facebook?sessionId=<sessionId>"
 }
}
```

##### Retrieve user session data

```javascript
const userAuthData = await authbird.session.getUserData('<sessionSecret>');
```

Example response data:

```json
{
 "accessToken": "<accessToken>",
 "profile": {
  "photoUrl": "<photoUrl>",
  "provider": "<provider>",
  "displayName": "<displayName>",
  "id": "<id>",
  "email": "<email>"
 }
}
```

## Continuous Integration and Continuous Delivery  (CI/CD)

The **Test pipeline** is triggered in push and pull requests to the `main` branch.

The **Release pipeline** is triggered when merging PR to the `main` branch.
It does the Github release, builds the library and publish it on npm.

The release version is calculated automatically based on commit messages
using [semantic release](https://github.com/semantic-release/semantic-release).
The example table below shows which commit message gets you which release type:

| Commit message                                                                                                                                                                                   | Release type                                                                                                 |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| `fix(pencil): stop graphite breaking when too much pressure applied`                                                                                                                             | Fix Release (Patch)                                                                                          |
| `feat(pencil): add 'graphiteWidth' option`                                                                                                                                                       | Feature Release (Minor)                                                                                      |
| `perf(pencil): remove graphiteWidth option`<br><br>`BREAKING CHANGE: The graphiteWidth option has been removed.`<br>`The default graphite width of 10mm is always used for performance reasons.` | Breaking Release (Major) <br/> (Note that the `BREAKING CHANGE: ` token must be in the footer of the commit) |


> Please remember that for the CD (Continuous Deployment) to function correctly, it is essential to provide a proper commit message.

## Contributing

Authbird welcomes all kinds of contributions! Whether it's code fixes,
feature enhancements, documentation updates, additional tests,
or helping with pull requests and issues, we appreciate any support you can provide.
Your contributions play a vital role in improving our project.

Join us and make a difference!

## License

[MIT](LICENSE)
