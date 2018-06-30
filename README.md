# Api

This is a simple api in express for front-end tests. Enjoy =).

## Setup
* Clone this project.
* Run `npm install`
* Run `npm start`
* The service is listening on port `3000`

## Endpoints

### [POST] /account
Create a new account.

Body (JSON):

| param    | type   | is required           | notes                      |
| -------- | ------ | --------------------- | -------------------------- |
| email    | string | yes                   | the e-mail used for login. |
| password | string | yes (minimum 4 chars) | the password for login.    |

Results:

| code | what happened? | result data |
| ---- | -------------- | ----------- |
| 201 | account created successfully | json with email vinculated to account.
| 403 | some param is invalid | json with the error message.

### [POST] /login
Login with an account.

Body (JSON):

| param | type | is required | notes |
| ----- | ---- | ----------- | ----- |
| email | string | yes | the e-mail used for login.
| password | string | yes | the password for login.

Results:

| code | what happened? | result data |
| ---- | -------------- | ----------- |
| 200 | you are now logged | json with token for authentication header.
| 401 | email or password invalid | json with the error message.
| 403 | some param is invalid | json with the error message.

### [GET] /pokemon/{id}
Get a pokemon data by it's id.

Headers:

| header | is required | value you must provide |
| ------ | ----------- | ---------------------- |
| Authorization | yes | the `token` provided by `/login` endpoint |

Url Params:

| param | is required | value you must provide |
| ----- | ----------- | ---------------------- |
| {id} | yes | the `id` of a registered pokemon |

Results:

| code | what happened? | result data |
| ---- | -------------- | ----------- |
| 200 | the pokemon was found | json with pokemon data.
| 401 | token is invalid | json with the error message.
| 403 | some param is invalid | json with the error message.
| 404 | the pokemon doesn't exist | json with the error message.

### [GET] /pokemon/{id}/image
Get a pokemon image by it's id.

Headers:

| header | is required | value you must provide |
| ------ | ----------- | ---------------------- |
| Authorization | yes | the `token` provided by `/login` endpoint |

Url Params:

| param | is required | value you must provide |
| ----- | ----------- | ---------------------- |
| {id} | yes | the `id` of a registered pokemon |

Results:

| code | what happened? | result data |
| ---- | -------------- | ----------- |
| 200 | the pokemon was found | json with pokemon data.
| 401 | token is invalid | json with the error message.
| 403 | some param is invalid | json with the error message.
| 404 | the pokemon doesn't exist | json with the error message.
