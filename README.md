# React / Express App

This application is an all-in-one application that contains react-client app and and express server.
The application is made for demo purposes only,

The following is a step-by-step manual for forking and deploying this app in Heroku cloud provider.

## Step by Step Manual

### Fork Skeleton App
1. Login to your github account
2. Goto to https://github.com/yavivi/react-express-app
3. Fork the project to your github account by clicking on the "Fork" button in the upper right corner.
Wait for the project to appear in your account
4. In the project settings, rename the repository name to your application name

### Project Structure:
```
react-express-app             <-- server project root (nodejs/express)
   \__ client                 <-- client project root (react)
          \__ package.json
   package.json
```

### Clone and Install project libraries

On you PC terminal (or Git Bash):
```
$ git clone https://github.com/<your-github-user>/<your-repo-name>

Install server dependencies:
$ cd <your-app-name>
$ npm install

Install client dependencies:
$ cd client
$ npm install
```

### Run both Client and Server Locally
While developing, you can start both react and nodejs servers in the following way:

First, you need to add a local ENV file that points the client to the server domain in development.

Create a file called **.env.development.local** under the client directory and add the following property:
```
REACT_APP_DOMAIN=localhost:3001
```
**NOTE:** The file must start with a dot (.)


Then, go back to the root directory of the project:
```
$ cd ..
```

Start both server and client concurrently:
```
$ npm run all
```
* Client (React App) is at http://localhost:3000
* Server (Express/NodeJS) is at http://localhost:3001

If you wish to start server only:
```
$ npm start
```
If you wish to start client only:
```
$ npm run client
```

Client and Server should refresh when you change you code

## Creating the Application in Heroku
1. Create an account in Heroku Cloud (https://signup.heroku.com)
You should verify the account by the provided email and set a new password.
You should reach the Heroku Welcome Screen at: https://dashboard.heroku.com/apps
2. Create your own Application and give it a name
3. In Deployment Method, choose "Connect to GitHub"
4. Click the "Connect to GitHub" button at the bottom
5. Authorize Heroku to access your repositories
6. Search your application repo among your GitHub repository list and click "Connect"

## Setting up you Application FQDN
Whan the applicatin starts it "fetches" a list of users from the backend (this is a fake hard-coded list just for demo purposes).
In order for the application be able to "fetch" the list from the server, you should set the application FQDN in the .env file located under the client directory:
```
REACT_APP_DOMAIN=<my-heroku-application-name>.herokuapp.com
```
After you change the .env file, commit and push your changes:
```
$ git commit -a -m "set application FQDN in env file"
$ git push
```

## Deploying the Application
1. In the application dashboard (Deploy Tab) Click "Deploy Branch" button.
2. Wait for the application to deploy successfully.
3. Click the "View" button to access it on the web.
4. If you see the list of users: "John Doe" and "Jane Doe" on the screen, your are all set!

## VS Code
Recommended Plugins:
* install eslint plugin - find problems in your code enforces proper formatting 
* install code spell checker - finds spelling error




