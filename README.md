# vue-inputs

I made these components while working on a project that needed me to make a multi-step, validated form. I started off with each step component housing all the field validation and ended up with an absolute mess of ternary statements and insane if/else logic.

My first attempt at a fix was equally bad. I made a single component that could be any of the different input types. This turned out to be TOO dynamic and basically created the same validation rat's nest.

Attempt three was the winner. I made a flexible component for each input type I needed. The components hold their own validation logic and validate themselves. They work with the v-model directive and emit their own errors. It's not perfect yet, I haven't had a lot of time to continue refining this into a standalone plugin, but these are super powerful for quickly making forms.

## Test page

You can try these out in Github pages: https://mattander.github.io/vue-custom-input-components/

## What do they do?
Each input has it's own set of features alonside standard features.

Standard features are:
- All fields default to required, pass isRequired as a prop with the value false to set as optional (it'll flag it with an optional label too)
- Customized label text with prop 'labelText'
- Customized help text if you want it with the prop 'helpText'
- Pass wrapper classes to override the default (working on improving this to just use the default vue funcitonality) using the "wrapperClasses" prop and passing an array of strings
- v-model to a value in the parent
- Emitting their own errors
- Smart enough to not throw errors for untouched fields and other edge cases
- Use a unique id, passed with the inputId prop as a string.

Special features are:
- Text and number both support min/max using the "validation" prop and passing your validation options following this format in an array of objects:
```javascript
[
    {
        type:"max",
        value:10,
        msg:"Can't be longer than ten characters." //This is the error message pushed into help text on error
    }
]
```
You can add your own validations by just adding the logic to the switch statement in the input component you want to add that validation to.
- Text supports the match validation, just pass a string typed data value as the value property in the validation object (see my password example in this repo, String(formData.password1)). Only add this validation to second field that will be filled out.

## What's next?
I definitely have bigger plans for these. Here's what I'd like to do:
- Clean up how they work and make it minimal to setup all their requirements inside a component
- Clean up this documentation and provide a guide for each input type
- Try to make these into a vue plugin (no idea what that entails)
- Write these as native web components so they can be used in other frameworks and applications
- Maybe dump the bootstrap side and make them barebones, that way you can theme them however you want. Not sure, because it's nice to have them work and look good out of the box and if you want to modify them, you can just go in and remove the classes/styles you don't want.
- For text area, I want to implement a small character count that will also check to see if there's a max/min validation and change colour/behaviour accordingly. This would be fun and not too hard.

## Things to fix
- Change typeahead input to accept an array of strings only for the options. Use a computed property on the parent component to convert your object to that and another computed to grab the matching object from your JSON, this is more flexible for now so that people can do their own logic in terms of what they pass to the input

## Included inputs
- DateTime (uses vue-datetime-picker, fontawesome and bootstrap)
- Text
- TextArea
- Number
- Radio
- Checkbox
- Select

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```
