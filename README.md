# Tryouts

This is a project to manage auditions using the following technologies:

- [React](https://facebook.github.io/react/) and [React Router](https://reacttraining.com/react-router/) for the frontend
- [Express](http://expressjs.com/) and [Mongoose](http://mongoosejs.com/) for the backend
- [Sass](http://sass-lang.com/) for styles (using the SCSS syntax)
- [Webpack](https://webpack.github.io/) for compilation

## Requirements

- [Node.js](https://nodejs.org/en/) 6+

```shell
npm install
```

## Running

**Make sure to add a `config.js` file in the `config` folder. See the example there for more details.**

Production mode:

```shell
npm start
```

Development (Webpack dev server) mode:

```shell
npm run start:dev
```

### Notes about development

- The way I do persistance with user login (keep users logged in even after a refresh) is every time they login, I generate a new UserSession object on the DB that holds the \_id corresponding to the user in the users collection as well as a timestamp of when they logged in. I store the \_id of this usersession object in the localStorage and grab it again when they reload the page to check in the database. When they logout, I set the isDeleted property of the usersession object to true.

### Todo

- [ ] Validate emails, usernames (alphanumerical),
- [ ] Change login to be username, password (for later)
- [ ] Add email verification (for later)
- [ ] Setup 'forgot my password' on sign in page

### License

- [MIT](/LICENSE)
