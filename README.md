# ReactiveForms III: Embrace the Power

This is the third part of the ReactiveForm series. Now that you know how to use ReactiveForms and techniques to make it accessible, it's time to do the real thing. We are gonna work on a multi step form, with validation that has to be accessible. If that wasn't enough we are going to use NgRx to keep in sync the multiple steps.

## Problem

In This Dot we are continuously growing and evolving. Hiring is key in our process and we empower developers through mentoring. That sounds good and all, but we receive a lot of developers. We needed to create a multi step form that developers looking to join This Dot can fill out.

Since we are an inclusive company we need to make sure everybody is able to use the form. So accessibility is a first class citizen here. We'll use the techniques exposed in Part II of this series to do so. But that's not it, we don't know who is going to apply so we need to make sure all the applications are valid.

There's a lot of information we require to start the process, personal information, address details and the experience. Meaning that if we make it a single page form it will be really hard to use or worst, will bore people so badly that they just forget about trying.

Now that you know the reasoning behind the design, let's get started.

## Solution

I believe that when you are motivated you work better, and crappy looking apps are super boring to work with. An app can be buggy but if it looks good, it will probably motivate you to fix it or improve it. Or at least that is my case being a visual person.

Since I'm leading this development and I want us to be motivated, let's start by making the multi step form look good. Once we feel comfortable with how it looks, we'll continue with its functionality.

The application will be built using Angular, instead of creating all the folders, files and configuration files, we'll rely on the Angular CLI. To do that follow the next steps:

- Open your favorite command line tool
- Install globally the Angular CLI by using the command `npm install -g @angular/cli`
- Go to where you want to create the app and run the command `ng new embrace-power`

At this point you have a freshly generated application. One thing I like to do is to create a variables.scss file storing all the variables I want to use, in this case I have only one `$base-color: #444` so I save it in `src/assets/styles/`. Then inside any scss file that wants to access it you can use `@import '~src/assets/styles/variables.scss';`.

> If you are like me, you must be wondering why is it there a _~_ at the beginning.
> _That way you tell webpack to use the base source_.

Replace the content of the app template with this:

```html
<!-- src/app/app.component.html  -->
<main>
  <router-outlet></router-outlet>
</main>
```

Now set the base styles for the app

```scss
// src/styles.scss
body,
html {
  margin: 0;
  background: #333;
  font-family: 'Roboto';
}
```

Finally add the Roboto font family and the material icons in the head tag

```html
<!-- /src/index.html -->
<link
  href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap"
  rel="stylesheet"
/>
<link
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
  rel="stylesheet"
/>
```

Web apps that look like native apps are awesome. So I'm gonna try to give it a mobile/desktop app look'n'feel.

### Steps Header

If you are building a multi step form you'll need a way to navigate through steps. Sometimes is useful to allow users to quickly jump to any step. In this case we'll need a header component that has a link to each step.

Since our application will only have a single instance of the header. We could argue that it's part of the core of the application. Let's first create the core module using the Angular CLI using the command `ng generate module core` inside the application folder. By now you have the core module, you'll need now the header component. Angular CLI again to the rescue, just run `ng generate component core/header`, this will create a new component in the core module.

For using this new component you'll need to add the component to the exports array of the core module declaration. Alternatively you can use the `--export=true` flag to tell the CLI to add the component to the exports array.

Now is time to write the actual template.

```html
<!-- src/app/core/header/header.component.html  -->
<header>
  <nav>
    <ul>
      <li><a href="#">Personal</a></li>
      <li><a href="#">Address</a></li>
      <li><a href="#">Experience</a></li>
    </ul>
  </nav>
</header>
```

If you generated the component following the above instructions, the header component is already part of the declarations and exports of the `CoreModule`. Sadly, you wont be able to use it in the app component until in import the the `CoreModule` in the `AppModule`. You will only import this module once. If you need to import it somewhere else for some reason, you should probably think on following the `SharedModule` strategy.

Import the CoreModule in the AppModule

```typescript
// src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, CoreModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Now you can use it like this in the app component template

```html
<app-header></app-header>

<main>
  <router-outlet></router-outlet>
</main>
```

But that looks awful right? Let's make it a little better by adding some CSS.

```scss
// src/app/core/header/header.component.scss
@import '~src/assets/styles/variables.scss';

:host {
  display: block;
}

header {
  background-color: darken($base-color, 20);
  min-height: 10vh;

  nav {
    height: 100%;

    ul {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      height: 100%;

      li {
        display: flex;
        margin: 0.5rem;
        list-style-type: none;
        justify-content: center;

        & > * {
          color: darken(white, 20);
          padding: 0.5rem;
          font-size: 1.5rem;
          letter-spacing: 0.1rem;
          line-height: 1.5;
        }

        a {
          text-decoration: none;

          &:visited {
            color: darken(white, 30);
          }

          &.active,
          &:active,
          &:hover,
          &:focus {
            text-decoration: underline;
            color: white;
          }

          &:hover,
          &:focus {
            outline: 1px white solid;
          }
        }
      }
    }
  }
}

@media all and (min-width: 768px) {
  header {
    nav {
      ul {
        flex-direction: row;
        justify-content: space-around;
      }
    }
  }
}
```

If you wonder why the media query, in my experience Mobile First Design will always take the prize. Here's how it goes, start by defining the mobile styles and when the viewport is greater or equal than 768px we adjust slightly the styles. We take advantage of the cascade nature of CSS.

### Step Component

Every step will be different. But they share some layout logic, they all have a title, a previous and next button. Before continuing we'll create a new component that will be used to wrap the step specific logic, that way we can ensure we have a consistent interface.

All the steps will be entirely separated into modules, we'll discuss that later on. For now lets focus on creating this reusable component. I like to store all the _reusable_ components into a shared module. Then I can import the shared module and use those reusable components as I require.

We'll fallback to the Angular CLI again:

- Open your favorite command line tool
- Change directory to the location of the project
- Run the command `ng generate module shared`
- Run the command `ng generate component shared/wizard-step --export=true`

Let's start by writing the template content.

```html
<!-- src/app/shared/wizard-step/wizard-step.component.html  -->
<section>
  <header>
    <h1>{{ title }}</h1>
  </header>

  <div>
    <button id="previous-button" (click)="goToPreviousStep()">
      <i class="material-icons">navigate_before</i> <span>Previous</span>
    </button>

    <ng-content></ng-content>

    <button id="next-button" (click)="goToNextStep()">
      <span>Next</span> <i class="material-icons">navigate_next</i>
    </button>
  </div>
</section>
```

By using content projection with `<ng-content>` we can use this new module to share all the markup logic of the step. As you can see there's a title property and two methods being executed through event binding in the buttons. Let's see how those look in the `.ts` file.

```typescript
// src/app/shared/wizard-step/wizard-step.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-wizard-step',
  templateUrl: './wizard-step.component.html',
  styleUrls: ['./wizard-step.component.scss']
})
export class WizardStepComponent implements OnInit {
  @Input() title: string;
  @Output() previousStepClicked = new EventEmitter();
  @Output() nextStepClicked = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  goToPreviousStep() {
    this.previousStepClicked.emit();
  }

  goToNextStep() {
    this.nextStepClicked.emit();
  }
}
```

And the styles, don't forget them.

```scss
// src/app/shared/wizard-step/wizard-step.component.scss
@import '~src/assets/styles/variables.scss';

header {
  background-color: darken($base-color, 15);
  height: 10vh;
  display: flex;
  align-items: center;
  justify-content: center;

  h1 {
    color: white;
    margin: 0;
    padding: 1rem;
    text-align: center;
    font-size: 2.8rem;
  }
}

section {
  height: 80vh;

  div {
    display: flex;
    justify-content: space-around;
    height: 100%;

    button {
      border: none;
      background: darken($base-color, 10);
      height: max-content;
      align-self: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      padding: 0.5rem 0;
      outline: 0.1rem darken(white, 30) solid;
      cursor: pointer;

      &#previous-button {
        padding-right: 1rem;
      }

      &#next-button {
        padding-left: 1rem;
      }

      span {
        display: none;
      }

      &:focus,
      &:hover {
        outline: 0.2rem white solid;
        background: darken($base-color, 20);
      }
    }
  }
}

@media all and (min-width: 768px) {
  section {
    div {
      button {
        span {
          display: block;
        }
      }
    }
  }
}
```

### Step Content

Now it's time to use everything together. We'll start by creating a new module dedicated to the _personal information_ step, this can be achieved by using the command you already know for generating a module `ng generate module personal`. But that's not enough right? Now we need a component to store the actual form, which can be done by using the command `ng generate component personal`.

Redirect the user to the personal page when the app boots.

```typescript
// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'embrace-power';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.navigate(['personal']);
  }
}
```

Import the SharedModule and the RouterModule to set the default route

```typescript
// src/app/personal/personal.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalComponent } from './personal.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PersonalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([{ path: '', component: PersonalComponent }]),
    ReactiveFormsModule
  ]
})
export class PersonalModule {}
```

> NOTE: Remember to import ReactiveFormsModule and SharedModule in your new module.

We still have a few more things to do, we'll need to wire the new module into the route structure in order to properly navigate.

```typescript
// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'personal',
    loadChildren: () =>
      import('./personal/personal.module').then(m => m.PersonalModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

Now update the link in the header, but first import the `RouterModule` in the `CoreModule`.

```typescript
// src/app/core/core.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, RouterModule.forChild([])],
  exports: [HeaderComponent]
})
export class CoreModule {}
```

Update the link to use `routerLink` and `routerLinkActive` from `RouterModule` in the header.

```html
<header>
  <nav>
    <ul>
      <li>
        <a [routerLink]="['/personal']" routerLinkActive="active">Personal</a>
      </li>
      <li><a href="#">Address</a></li>
      <li><a href="#">Experience</a></li>
    </ul>
  </nav>
</header>
```

Now is time to work on the component class declaration

```typescript
// src/app/personal/personal.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {
  title = 'Personal';
  personalForm = this.fb.group(
    {
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      age: [
        null,
        [Validators.required, Validators.min(18), Validators.max(120)]
      ],
      about: [null, [Validators.required]]
    },
    {
      updateOn: 'blur'
    }
  );
  firstNameCtrl = this.personalForm.get('firstName');
  lastNameCtrl = this.personalForm.get('lastName');
  ageCtrl = this.personalForm.get('age');
  aboutCtrl = this.personalForm.get('about');
  submitted = false;

  constructor(private fb: FormBuilder) {}

  goToNextStep() {
    this.submitted = true;
  }

  ngOnInit() {
    // this method comes from OnInit interface
  }
}
```

So what's going on here. We are declaring the title that will be passed as input to the WizardStepComponent and the ReactiveForm to handle form data in the PersonalComponent. If you have read the previous posts of this series you'll notice something new. The usage of Validators and the `{ updateOn: 'blur' }` configuration object.

The updateOn option is pretty self explanatory, it just makes the ReactiveForm register the changes only when the user goes out of the input. Validators are a bit more complicated, you can have an array of validators which are basically functions that return a boolean. All the validators used in this example are built-in in the library but you could write your own.

Now that we have validators in the form, whenever an error is found it will be added to the property error of it. That way using `ngIf` directive we can conditionally show the errors. One last trick that is really cool is to have a `submitted` property that defaults to false. It will be changed after submitting the form, that way the errors is displayed only if the form has been submitted.

This is how the template will look now:

```html
<!-- src/app/personal/personal.component.html -->
<app-wizard-step [title]="title" (nextStepClicked)="goToNextStep()">
  <form [formGroup]="personalForm" [attr.aria-label]="title">
    <label>
      <span>First name *</span>
      <input
        class="form-control"
        type="text"
        formControlName="firstName"
        required
      />
    </label>
    <span
      class="form-error"
      *ngIf="submitted && firstNameCtrl?.errors?.required"
    >
      First name is required
    </span>

    <label>
      <span>Last name *</span>
      <input
        class="form-control"
        type="text"
        formControlName="lastName"
        required
      />
    </label>
    <span
      class="form-error"
      *ngIf="submitted && lastNameCtrl?.errors?.required"
    >
      Last name is required
    </span>

    <label>
      <span>Age *</span>
      <input
        class="form-control"
        type="number"
        formControlName="age"
        required
      />
    </label>
    <span class="form-error" *ngIf="submitted && ageCtrl?.errors?.required">
      Age is required
    </span>
    <span class="form-error" *ngIf="submitted && ageCtrl?.errors?.min">
      Age has to be greater or equal than 18
    </span>
    <span class="form-error" *ngIf="submitted && ageCtrl?.errors?.max">
      Age has to be less or equal than 120
    </span>

    <label>
      <span>About *</span>
      <textarea
        class="form-control"
        rows="4"
        formControlName="about"
        required
      ></textarea>
    </label>
    <span class="form-error" *ngIf="submitted && aboutCtrl?.errors?.required">
      About is required
    </span>
  </form>
</app-wizard-step>
```

Don't forget about the styling, remember I told you I hate working with something I don't visually like? After some improvements, I got the next stylings.

```scss
// src/app/personal/personal.component.scss
@import '~src/assets/styles/variables.scss';

form {
  width: 100%;
  max-width: 700px;
  padding: 2rem;
  background: darken($base-color, 10);
  overflow-y: auto;
}

label {
  display: flex;
  justify-content: space-around;
  min-height: 2rem;
  padding: 1rem;

  flex-direction: column;

  span {
    color: white;
    font-size: 1.2rem;
    width: 100%;
  }

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  &:hover,
  &:focus-within {
    outline: 1px white solid;
  }
}

.form-control {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid white;
  color: white;
  font-size: 1.3rem;
  padding-bottom: 0.3rem;
  margin: 1rem 0;

  &:focus {
    outline: none;
  }
}

.form-error {
  display: block;
  color: red;
  margin: 0.5rem 0;
}

@media all and (min-width: 768px) {
  label {
    flex-direction: row;

    span {
      font-size: 1.5rem;
      width: 30%;
    }
  }

  .form-control {
    width: 60%;
    margin: 0;
  }
}
```

You'll find some good old mobile first design also in this stylesheet, feel free to take a look. I'll leave it as a homework.

### The other steps

Now that the first step is done, we can easily reuse all that logic for the others. We can have as many steps as we want, just remember to connect it through the Router and to add it to the header as one of the steps. I'm sure you can do that by yourself, so I'll just skip ahead.

### The State

If you created the new steps and all that. You maybe wondering what now? All these modules are separated and now is hard to keep track of the state of the whole form. You may have even noticed that if you jump between states you lose the values you entered. None of those are problems to us, because we know that NgRx is here to help. What you'll need to do now is:

- Create reducers for the steps in the form.
- Create selectors for each step.
- All the steps will hydrate the form with the selectors.
- Create a set of actions for each step.
- Everytime a value is changed in a form it will be patched into the store.

First of all we'll need to install NgRx Store, that can be easily done by running the command `npm install --save @ngrx/store` in the application directory.

> NOTE: I recommend you to install the StoreDevtools for testing by executing `npm install --save @ngrx/store-devtools`

Now let's create our reducers (I'll focus on the _personal_ step but it's the same strategy with all the others).
Create a folder called `state` under the `src/app/core` and put there `personal.reducer.ts` file with the following content:

```typescript
import { createReducer, on } from '@ngrx/store';
import { PersonalPageActions } from '../../personal/actions';
import { Personal } from '../interfaces/personal.interface';
import { PersonalGroup } from '../models/personal.model';

export interface State {
  data: Personal;
  isValid: boolean;
}

const initialState = new PersonalGroup();

const personalReducer = createReducer(
  initialState,
  on(
    PersonalPageActions.patch,
    (state: State, action: ReturnType<typeof PersonalPageActions.patch>) => ({
      ...state,
      data: { ...state.data, ...action.payload }
    })
  ),
  on(
    PersonalPageActions.changeValidationStatus,
    (
      state: State,
      { isValid }: ReturnType<typeof PersonalPageActions.changeValidationStatus>
    ) => ({
      ...state,
      isValid
    })
  )
);

export function reducer(state: State, action: PersonalPageActions.Union) {
  return personalReducer(state, action);
}

export const selectPersonalGroupData = (state: State) => state.data;
export const selectPersonalGroupIsValid = (state: State) => state.isValid;
```

There's an interface (`src/app/core/interfaces/personal.interface.ts`) and a model (`src/app/core/models/personal.model.ts`) that looks like this:

```typescript
export interface Personal {
  firstName: string;
  lastName: string;
  age: number;
  about: string;
}
```

```typescript
import { Personal } from '../interfaces/personal.interface';
export class PersonalGroup {
  data = {
    firstName: '',
    lastName: '',
    age: 18,
    about: ''
  } as Personal;
  isValid = false;
}
```

I'll start by using a barrel import in the reducer that will help you later with the other reducers (`src/app/core/state/index.ts`).

```typescript
import { ActionReducerMap, createSelector, MetaReducer } from '@ngrx/store';
import * as fromPersonal from './personal.reducer';
import { PersonalGroup } from '../models/personal.model';

export interface State {
  personal: PersonalGroup;
}

export const reducers: ActionReducerMap<State> = {
  personal: fromPersonal.reducer
};

export const metaReducers: MetaReducer<State>[] = [];

export const selectPersonalGroup = (state: State) => state.personal;
export const selectPersonalGroupData = createSelector(
  selectPersonalGroup,
  fromPersonal.selectPersonalGroupData
);
export const selectPersonalGroupIsValid = createSelector(
  selectPersonalGroup,
  fromPersonal.selectPersonalGroupIsValid
);
```

There's also some action related stuff. I simply created an action file for each page, that way actions are specific to a context and easier to think of in the future. The actions are stored directly in the module that can dispath them. For example, the "personal" actions are stored at `src/app/personal/actions/personal-page.actions.ts`.

```typescript
import { createAction, props } from '@ngrx/store';
import { Personal } from '../../core/interfaces/personal.interface';

export const patch = createAction(
  '[Personal Page] Patch Value',
  props<{ payload: Partial<Personal> }>()
);

export const changeValidationStatus = createAction(
  '[Personal Page] Change Validation Status',
  props<{ isValid: boolean }>()
);

export type Union = ReturnType<typeof patch | typeof changeValidationStatus>;
```

Also don't forget to create an index file for the actions (`src/app/personal/actions/index.ts`):

```typescript
import * as PersonalPageActions from './personal-page.actions';

export { PersonalPageActions };
```

The only thing missing now is to use all these new super powers. First we'll add the reducers to the AppModule and then we'll hook everything up in the respective component.

```typescript
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './core/state';

@NgModule({
  imports: [
    // ...
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    })
    // ...
  ]
  // ...
})
export class AppModule {}
```

> NOTE: I'm also injecting the StoreDevtools to enable the redux widget of the Chrome Devtools

Cool, we are almost there, is just a matter of hooking the step's component that can be found in `src/personal/personal.component.ts`.

```typescript
// 1) New imports
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../core/state';
import { PersonalPageActions } from './actions';
import { map, take, distinctUntilChanged } from 'rxjs/operators';
import { merge } from 'rxjs';
import { Personal } from '../core/interfaces/personal.interface';
// ...

export class PersonalComponent implements OnInit {
  // ...

  // 2) Inject the router and the store
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    // 3) Get the last state of the personal data and patch the form with it
    this.store
      .select(fromRoot.selectPersonalGroupData)
      .pipe(take(1))
      .subscribe((personal: Personal) =>
        this.personalForm.patchValue(personal, { emitEvent: false })
      );

    // 4) For each field create an observable that maps the change as a key value
    const firstName$ = this.firstNameCtrl.valueChanges.pipe(
      map((firstName: string) => ({ firstName } as Partial<Personal>))
    );
    const lastName$ = this.lastNameCtrl.valueChanges.pipe(
      map((lastName: string) => ({ lastName } as Partial<Personal>))
    );
    const age$ = this.ageCtrl.valueChanges.pipe(
      map((age: number) => ({ age } as Partial<Personal>))
    );
    const about$ = this.aboutCtrl.valueChanges.pipe(
      map((about: string) => ({ about } as Partial<Personal>))
    );

    // 5) For each change trigger an action to update the store
    merge(firstName$, lastName$, age$, about$).subscribe(
      (payload: Partial<Personal>) => {
        this.store.dispatch(PersonalPageActions.patch({ payload }));
      }
    );

    // 6) If the validaty status of the form changes dispatch an action to the store
    this.personalForm.valueChanges
      .pipe(
        map(() => this.personalForm.valid),
        distinctUntilChanged()
      )
      .subscribe((isValid: boolean) =>
        this.store.dispatch(
          PersonalPageActions.changeValidationStatus({ isValid })
        )
      );
  }

  // 7) Add method to go to next step through navigation if the form is valid
  goToNextStep() {
    if (this.personalForm.invalid) {
      this.submitted = true;
      return;
    }

    this.router.navigate(['address']);
  }
}
```

What we are doing here is simply getting the latest state from the store and patching it in the form. Then we are creating a stream that emits an action every time an input has changed.

If you repeat this for each step, you'll have a full multi step form with validation that is also accessible and with an optimized bundle.

## Conclusion

ReactiveForms are incredibly powerful. In previous parts we talked about some of the core concepts but now we have unleash the real power of it. If you use all the concepts mentioned here you prolly will be able to do any complex form. In case you wonder about testing, this article is long enough by itself so I'm planning to write one specific for testing ReactiveForms.
