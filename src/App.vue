<template>
    <div class="container">
        <h1>Vue custom input components</h1>
        <form>
            <div class="form-row">
                <TextInput
                    :wrapperClasses="['col-md-6']"
                    inputId="password1"
                    labelText="Password"
                    v-model="formData.password1"
                    :validation="[{type:'min',value:8,msg:'Password must be longer than eight characters.'}]"
                    :submitted="submitted"
                    @error="catchError"
                    @clean="clean"
                />
                <TextInput
                    :wrapperClasses="['col-md-6']"
                    inputId="password2"
                    labelText="Confirm password"
                    v-model="formData.password2"
                    :validation="[{type:'match', value: String(formData.password1), msg:'Passwords must match'}]"
                    :submitted="submitted"
                    @error="catchError"
                    @clean="clean"
                />
            </div>
            <div class="form-row">
                <TextInput
                    inputId="testText"
                    v-model="formData.testText"
                    labelText="Optional text input"
                    :isRequired="false"
                    :submitted="submitted"
                    @error="catchError"
                    @clean="clean"
                />
            </div>
            <div class="form-row">
                <NumberInput
                    inputId="testNumber"
                    v-model="formData.testNumber"
                    labelText="Number input"
                    helpText="Max of 10"
                    :submitted="submitted"
                    :validation="[{type:'max',value:10,msg:'The max number allowed is 10.'}]"
                    @error="catchError"
                    @clean="clean"
                />
            </div>
            <div class="form-row">
                <CheckboxInput
                    inputId="testCheck"
                    v-model="formData.testCheck"
                    labelText="Checkbox input"
                    :submitted="submitted"
                    @error="catchError"
                    @clean="clean"
                />
            </div>
            <div class="form-row">
                <DateTimeInput
                    :wrapperClasses="['col-auto']"
                    inputId="testDateTime"
                    labelText="Datetime"
                    v-model="formData.testDateTime"
                    @error="catchError"
                    @clean="clean"
                    :submitted="submitted"
                />
            </div>
            <div class="form-row">
                <SelectInput
                    :wrapperClasses="['col-auto']"
                    inputId="testSelect"
                    labelText="Select"
                    :options="testSelectOptions"
                    v-model="formData.testSelect"
                    @error="catchError"
                    @clean="clean"
                    :submitted="submitted"
                />
            </div>
            <div class="form-row">
                <TextAreaInput
                    inputId="testTextArea"
                    labelText="Textarea"
                    v-model="formData.testTextArea"
                    @error="catchError"
                    @clean="clean"
                    :submitted="submitted"
                    :rows="4"
                    :wrapperClasses="['col-md-6']"
                />
            </div>
            <div class="form-row">
                <RadioInput
                    inputId="testRadio"
                    v-model="formData.testRadio"
                    name="testRadios"
                    :options="testRadios"
                    :submitted="submitted"
                    @error="catchError"
                    @clean="clean"
                />
            </div>
            <div class="form-row">
                <CustomTypeahead
                    inputId="testTypeahead2"
                    labelText="Typeahead"
                    :options="testTypeaheadOptions"
                    :wrapperClasses="['col-md-6']"
                    v-model="formData.testTypeahead2"
                    @error="catchError"
                    @clean="clean"
                    :submitted="submitted"
                />
            </div>
        </form>
        <div
            class="alert alert-danger"
            v-if="error && submitted"
        >Whoops! Please check that you've filled out all fields correctly.</div>
        <button class="btn btn-primary mt-4" @click="submit">Submit</button>
    </div>
</template>

<script>
import TextInput from "@/components/TextInput.vue";
import CheckboxInput from "@/components/CheckboxInput.vue";
import NumberInput from "@/components/NumberInput.vue";
import DateTimeInput from "@/components/DateTimeInput.vue";
import SelectInput from "@/components/SelectInput.vue";
import TextAreaInput from "@/components/TextAreaInput.vue";
import RadioInput from "@/components/RadioInput.vue";
import CustomTypeahead from "@/components/CustomTypeahead.vue";

export default {
    name: "app",
    components: {
        TextInput,
        CheckboxInput,
        NumberInput,
        DateTimeInput,
        SelectInput,
        TextAreaInput,
        RadioInput,
        CustomTypeahead
    },
    data() {
        return {
            formData: {
                password1: "",
                password2: "",
                testText: "",
                testNumber: "",
                testCheck: false,
                testDateTime: "",
                testSelect: "",
                testTextArea: "",
                testRadio: "",
                testTypeahead: "",
                testTypeahead2: ""
            },
            errors: [],
            submitted: false,
            testSelectOptions: [
                { value: 1, text: "one" },
                { value: 2, text: "two" },
                { value: 3, text: "three" },
                { value: 4, text: "four" }
            ],
            testRadios: [
                { value: "yes", labelText: "Yes" },
                { value: "no", labelText: "No" }
            ],
            testTypeaheadOptions: [
                {
                    name: "Test 1",
                    location: "test 1 location",
                    description: "test 1 description"
                },
                {
                    name: "Test 2 a",
                    location: "test 2 location",
                    description: "test 2 description"
                },
                {
                    name: "Ttest 2 a",
                    location: "test 2 location",
                    description: "test 2 description"
                },
                {
                    name: "Tttest 2 a",
                    location: "test 2 location",
                    description: "test 2 description"
                },
                {
                    name: "Test 3",
                    location: "test 3 location",
                    description: "test 3 description"
                },
                {
                    name: "Test 4 a",
                    location: "test 4 location",
                    description: "test 4 description"
                },
                {
                    name: "Test B",
                    location: "test 4 location",
                    description: "test 4 description"
                },
                {
                    name: "Test C",
                    location: "test 4 location",
                    description: "test 4 description"
                },
                {
                    name: "Test D",
                    location: "test 4 location",
                    description: "test 4 description"
                },
                {
                    name: "Test E",
                    location: "test 4 location",
                    description: "test 4 description"
                },
                {
                    name: "Test F",
                    location: "test 4 location",
                    description: "test 4 description"
                }
            ]
        };
    },
    computed: {
        error() {
            // are there trues in the error list
            const errors = this.errors.filter(error => {
                return error.hasError == true;
            });
            const error = errors.length > 0 ? true : false;
            return error;
        },
        testTypeaheadList() {
            return this.testTypeaheadOptions.map(item => item.name);
        },
        testTypeaheadSelectedOption() {
            return this.testTypeaheadOptions.filter(item => {
                return item.name == this.formData.testTypeahead;
            })[0];
        }
    },
    methods: {
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
        clean() {
            this.submitted = false;
        },
        submit() {
            this.submitted = true;
            if (!this.error) {
                alert("success!");
            }
        }
    }
};
</script>

<style lang="scss">
</style>
