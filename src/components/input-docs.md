# How to use the input components

*These instructions are for how to use the custom input components. For anything else related to the Film Permits Application, [go back to the Film Permits Application docs](/FilmPermit.Web/FilmPermit.ClientApp/README.md).*

This folder contains components for each standard type of html input. These inputs have contained validation and will return values and error state.

---

## Contents

1. [Events](#events)
2. [Validation](#validation)
3. [Custom input validation](#custom-input-validation-rules)
3. [Required props for a field to work](#required-props-for-a-field-to-work)

---

## Events
All the inputs emit an 'input' event when their value changes. For inputs that normally use the 'change' event for updates, I've handled this inside the component. I did this in order to make it easier to drop them into a file and reduce potential errors.

## Validation

All fields have built-in, per-field validation. This means that the field validates as the user types and will throw errors as needed. No need to wait for form submit. Each field has the standard validation for required fields and a standardized method for adding custom validation rules to any of the inputs.

## Custom input validation rules

Each input uses a standardized way to check against user-defined validation rules. Each component has it's own set of custom rules built in. These rules are listed after the instructions for adding a new rule.

### Adding a new rule to an input

Open the input component file and scroll to the computed property called 'errors'. Find the definition for the constant validationErrors. This runs a filter on the array of custom rules applied for that field and returns the error message for anything that breaks a rule. These errors are then spread into the final error array, which is then returned as the value of this computed property.

**Adding a new rule**
Here's how to add a new rule to an input component:

```javascript
// This constant is in all of the input component files.
// To add a new rule, simply add a case with the name of that rule.
// We're going to add a rule to check if the text matches a specified value.

const validationErrors = this.validation.filter(rule => {
	switch (rule.type) {
		case "match":
			// Define a rule where the text must match a specified value
			// Every item in the rule array is an object with three
			// properties: type, msg, value.
			// We go over these in the 'Using a rule' section

			// If the current input value doesn't match the value
			// passed by the rule, we return the error message defined
			// in the rule.
			if (this.value != rule.value) {
				return  rule.msg;
				break;
			}
	}
	default:
			return null;
})
```

**Using a rule**
Here's how to use that new rule by adding it to the validation prop in the template:

```html
<!-- Input has all the standard custom input props -->
<!-- Validation is not a required prop -->
<!-- Only add it if you need to use custom validation rules -->
<!-- Make sure you've added the logic for this rule to the input, as shown above. -->

<TextInput
	inputId="passwordConfirm"
	v-model="RetypeUserPassword"

	:srOnly="true"
	:validation="[{type:'match',value:password,msg:'Your password does not match'}]"


/>
```

Let's take a closer look at the array:

```javascript
[{
	// Type is the name of the rule.
	// This must match what you called it in the rules switch statement.
	type: 'match',
	// This is the value you'll check against.
	// It can be defined here, "exampleText" or bound to a property
	// on the instance like it is here (the password value in data).
	value: password,
	// This is the message that gets displayed if the rule criteria isn't met.
	msg: 'Your password doesn\'t match'
}]
```

You can have as many of these as you want, as long as you've defined the logic for your rules in that input's component. Remember that not all inputs share the same custom rules. A min or max rules may make sense for a number input or a text input, but it is useless for a checkbox.

Let's look at each input type and the default rules provided by them. I'll just cover the name of the rule and what it expects for the value. To learn how these rules function, dig into the source code.

### Default rules

Here's a list of existing rules and which components have them by available:

**Minimum length**
type: 'min'
value: Number

Available in: text, textarea, number

**Maxmimum length**
type: 'max'
value: Number

Available in: text, textarea, number

**Match**
type: 'match'
value: String

Available in: text, textarea, number, select

**Must contain**
type: 'mustContain'
value: Array of characters as strings


Available in: text

**Can't contain**
type: 'cantContain'
value: Array of characters as strings

Available in: text

**Is a valid email**
type: 'email'
value: null (not used)

Available in: text

**Password complexity**
type: 'passwordComplexity'
value: null (not used, see component for the complexity rules)

Available in: text

**Is a valid phone number**
type: 'phone'
value: null (not used, see component for the regex)

Available in: text

**Is a valid postal code**
type: 'postalCode'
value: null (not used, see component for the regex)

Available in: text

**Is before date**
type: 'before'
value: Valid dayjs() date (see their docs for details)

Available in: datetime


## Required props for a field to work

### All fields
inputId=""
labelText=""
v-model="formData."




### Select and typeahead inputs
Select and typeahead inputs need an array of options to function correctly

```javascript
const exampleOptions = [
	{value:"test", text:"Test option"}
]
```

### Datetime inputs
You can provide a default time for datetime inputs.
```html
<DateTimeInput
	inputId="startTIme"
	v-model="startTIme"

	:srOnly="true"
	:defaultTime="{hour:7,minute:0}"


/>
```

### All props and their defaults
You'll need the following methods for the above required props.

```javascript
data() {
	return {
		// used to check if the form is dirty
		submitted: false,
		// auto populates with all the fields and their status on mount
		errors: []
	}
},
computed: {
	// returns a bool for if the error list has errors in it
	error() {
		const errors = this.errors.filter(error => {
			return error.hasError == true;
		});
		const error = errors.length > 0 ? true : false;
		return error;
	}
},
methods: {
	// pushes fields into the errors list with info on if they have an error, updates on error event
	catchError(e) {
		const match = this.errors.findIndex(error => error.id == e.id);
		if (match != -1) {
			this.errors[match] = Object.assign(this.errors[match], {
				hasError: e.error,
				id: e.id
			});
		} else {
			this.errors.push({
				hasError: e.error,
				id: e.id
		});
		}
	},
	// cleans the form on the clean event
	clean() {
		this.submitted = false;
	}
}
```

## Input props and their defaults
```javascript
	// These are the classes for the wrapping element. Leave it to default (col-auto) unless something really isn't fitting.
	wrapperClasses: {
		type: Array,
		default: () => {
			return ["col-auto"];
		}
	},
	// Classes for the label in case you need to customize them. Leave these empty if you can for best performance.
	labelClasses: Array,
	// Input ID, used to target this field
	inputId: String,
	// Text for the input label
	labelText: String,
	// Placeholder text (try not to use this, bad for accessibility)
	placeholder: String,
	// Required, defaults to true. Bind this to a logical expression for conditional requirements
	// Example - :isRequired="otherInputFieldHasSomeValue"
	isRequired: {
		default: true
	},
	/* This is critical. Check the Validation section. */
	validation: {
		type: Array,
		default: () => {
			return [];
		}
	},
	helpText: String,
	labelAfter: {
		type: Boolean,
		default: true
	},
	submitted: {
		default: false
	},
	srOnly: {
		type: Boolean,
		default: false
	},
	value: {
		default: false
	},
	inline: {
		default: false,
		type: Boolean
	},
	disabled: {
		type: Boolean,
		default: false
	},
	customError: {
		type: String,
		default: ""
	},
	optionalFlag: {
		type: Boolean,
		default: true
	}
```