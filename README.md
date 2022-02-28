# Node.js Authentication Handling

This repo contains node js authentication handling using JWT.
This shows the common module for Authentication which will be called as middleware while calling any webservice(API).

- This method checks if the token provided by front-end is valid in JWT and has not expired yet.

- If it is not valid then it shows session expires error.

- If it is valid then checked for user profile.

- If user profile is suspended or de-activated then throws error.

- if profile is activated then let's user to enter in the app with success message.
