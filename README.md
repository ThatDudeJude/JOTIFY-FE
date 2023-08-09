# Jotify-Frontend

The frontend application for Jotify, a simple online productivity app for saving notes and to-do lists.

## Project Description

This is the Jotify frontend, an app that let's registered users save categorized notes and to-do tasks based on priority. The frontend is built using the React library and makes use of the framer-motion animation library and Material UI styling library. The app's inteface authenticates users and allows them to create, view, update, and delete tasks and notes. Key features include allowing users to view notes according to their categories and letting tasks be prioritized and viewed according to their due dates. The app uses Token-based authentication to access the Jotify backend. The backend for the Jotify app can be viewed [here](https://github.com/ThatDudeJude/Jotify-BE).

### Technology used
| Technology  |       Version    |      Utility    |
|-------------|------------------|-----------------|
|    React   |  v18.2.0            | Javascript-based Front-end library for building user interfaces|
|  Framer Motion Animation | v10.10.0    | A motion animation library for React|
|   Material UI  | v5            | A component library for customizing and designing UIs based on Google's Material Design|

## Running the project locally


1. Launch your terminal.
2.  Ensure that [node](https://www.nodejs.org/download/) version v16+ is installed in your computer and you have [npm](https://www.npmjs.com) or [yarn](https://www.yarnpkg.com) package managers installed.
3. Clone this github repository : ```git clone https://github.com/ThatDudeJude/Jotify-FE.git```. Navigate to Jotify-FE, i.e. ```cd Jotify-FE```  
4. For npm users, run :
```    
    npm install
    npm start    
```

For yarn users, run :
```    
    yarn add
    yarn start    
```

To view the project you need to navigate to the generated url, http://localhost:3000


## Tests

For unit and integration tests,  
npm users:
``` 
npm test
```
yarn users:
```
yarn test
```
For end-to-end tests using [Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress),
npm users:
```
npm run e2e-test
``` 
yarn users:
```
yarn run e2e-test
```

## Visuals and Demos

* Welcome Page and User Authentication
![Welcome, Registration and Login](/demo_images/Register_and_Login.gif)

* Create New Note and Filter Notes
![Create Note and Filter Note Category](/demo_images/Create_New_Note_FIlter_Category.gif)
* Create New Task
![Create New Task](/demo_images/Create_New_Task.gif)
* View Tasks By Priority
![View Tasks By Priority](/demo_images/View_Tasks_By_Priority.gif)
* View Tasks By Time Due
![View Tasks By Time Due](/demo_images/View_Tasks_According_To_Time_Due.gif)
* Update Task
![Update Task](/demo_images/Update_Task.gif)

## Contributing
Want to contribute? See contributing guidelines [here](/CONTRIBUTING.md).

## Codebeat

[![codebeat badge](https://codebeat.co/badges/f49762c5-7506-446a-b738-fe7f9fb8bc28)](https://codebeat.co/a/thatdudejude/projects/github-com-thatdudejude-bibliophiliac-profile_branch_final)

## License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENCE.txt)