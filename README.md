# UI Developer Assessment


This project is a fork of [Todo MVC](http://todomvc.com/)

Your mission, should you choose to accept it, is to download this repo and make the app functionally equivalent to: [http://todomvc.com/examples/vanillajs/](http://todomvc.com/examples/vanillajs/).

Please **do not fork this repo** as your code will not be accepted from a fork.

The previous developer left the project half-finshed, but quite a bit of infrastructure is in place and we'd like to see how you would finish it out.

- Scenario: All of the styling for the app is complete and almost all of the HTML markup you'll need is present in the [app.component.html](https://github.com/labcorp-clinical-development/coding-assessment/blob/master/src/app/app.component.html) file.
- In order to complete this project, you're going to have to have knowledge of [Angular](https://angular.io), [Ngrx](https://ngrx.io/), [Rxjs](https://rxjs-dev.firebaseapp.com/), inter-component communication and how to make components re-usable.
- You may **not** use Ngrx/Data or Ngrx/Entities to complete this project.
- It isn't necessary to write end-to-end tests for your work, but if you choose to write unit tests for your reducer or components, it would be a big plus.
- Your code *must* pass AOT compilation when running: `ng build`
- Neatness and organization count - **a lot**.


## Notes:
- Original Tasks
  - All new Todos are entered at descending, newest to oldest. New Todos are entered at the top.
  - Editing reflects the designs
  - Messages are in place when there are no Todos. Since none were supplied, I proffered my own snarky comments.
- Additional Features and Points of order
  - The service should never dispatch actions. This violates the basic design pattern of Redux. I reconfigured everything to match [the basic Ngrx design paradigm](JDillon522/cors-anywhere)
  - I implemented [Dexie.js](https://dexie.org/) to save Todos to [IndexDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). Whats the point in a Todo app if you cant save your tasks for latter? :)
  - I implemented a basic skeleton loading with an 800ms delay to simulate slow network connections or API lag.
  - The page routes based off the current filter.
  - I moved everything from `app.component` to `todos/pages/todos.component`. Now the Todos app is a feature module.
  - I wrote a handful of tests for the whole state management side of things. I dont have the time to finish tests for the components or the service.
  - I tried to make things as reactive as possible and avoid subscriptions. I lost the battle in a few spots.
  - I like to organize all my streams in routable components and then pass those streams into "dumb" child components. Thats why all my state streams are in `todos/pages/todos.component`.
