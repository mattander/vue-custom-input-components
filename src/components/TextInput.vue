<template>
    <div
        :class="[wrapperClasses, errors.length > 0  && (!isClean || submitted) ? 'form-group--error' : '', 'form-group']"
    >
        <label
            :for="inputId"
            :class="[labelClasses ? labelClasses : null, 'form-label']"
            v-if="!srOnly"
        >
            {{labelText}}
            <span class="text-muted" v-if="!isRequired && optionalFlag">(optional)</span>
        </label>
        <input
            :type="password ? 'password' : 'text'"
            :name="inputId"
            :class="['form-control', errors.length > 0 && (!isClean || submitted) ? 'is-invalid' : errors.length == 0 && (!isClean || submitted) ? 'is-valid' : '']"
            :id="inputId"
            :placeholder="placeholder"
            :value="value"
            @input="handleInput"
            @blur="isClean = false; validateEmail ? checkEmail() : null; $emit('blur')"
            @focus="$emit('focus')"
            :disabled="disabled"
            :autocomplete="autocomplete"
        />
        <div class="invalid-feedback" v-if="errors.length > 0 && (!isClean || submitted)">
            <div v-for="(error, index) in errors" :key="index">{{error}}</div>
        </div>
        <small class="form-text text-muted d-block" v-else-if="helpText">{{helpText}}</small>
    </div>
</template>

<script>
import axios from "axios";
import { CHECK_EMAIL } from "@/constants/api.js";
export default {
    name: "textInput",
    props: {
        wrapperClasses: {
            type: Array,
            default: () => {
                return ["col-auto"];
            }
        },
        labelClasses: Array,
        inputId: String,
        labelText: String,
        placeholder: String,
        isRequired: {
            default: true
        },
        validation: {
            type: Array,
            default: () => {
                return [];
            }
        },
        helpText: String,
        srOnly: {
            type: Boolean,
            default: false
        },
        value: String,
        disabled: {
            type: Boolean,
            default: false
        },
        optionalFlag: {
            type: Boolean,
            default: true
        },
        password: {
            type: Boolean,
            default: false
        },
        autocomplete: {
            type: String,
            default: ""
        },
        validateEmail: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isClean: true,
            emailAvailable: false,
            emailStatus: ""
        };
    },
    methods: {
        handleInput(e) {
            this.validateEmail ? this.checkEmail() : null;
            let val = e.target.value;
            // Temp disabling postal code auto formatting
            // if (
            //     this.validation.some(item => {
            //         item.rule == "postalCode";
            //     })
            // ) {
            //     let tempVal = val.toUpperCase().replace(" ", "");
            //     tempVal = tempVal.split("");
            //     if (tempVal.length > 3) tempVal.splice(3, 0, " ");
            //     tempVal = tempVal.join("");
            //     val = tempVal;
            // }

            if (this.inputId.toLowerCase().indexOf("phone") !== -1) {
                let tempVal = val.toUpperCase().replace(/[()\- ]/gi, "");
                tempVal = tempVal.split("");
                if (tempVal.length > 3) tempVal.splice(3, 0, "-");
                if (tempVal.length > 7) tempVal.splice(7, 0, "-");
                if (tempVal.length > 12) tempVal.splice(12);
                tempVal = tempVal.join("");
                val = tempVal;
            }

            this.$emit("input", val);
        },
        checkEmail() {
            this.emailStatus = "";
            // don't do an XHR if the email isn't even valid
            if (
                this.value.indexOf("@") !== -1 &&
                this.value.lastIndexOf(".") > this.value.indexOf("@")
            ) {
                const data = JSON.stringify(this.value.toLowerCase());
                this.emailStatus = "loading";
                this.$store.commit("LOADING", true);
                axios({
                    url: CHECK_EMAIL,
                    data: data,
                    method: "post",
                    headers: {
                        "content-type": "application/json"
                    }
                })
                    .then(resp => {
                        switch (resp.data) {
                            case "email_is_existed": {
                                this.emailStatus = "unavailable";
                                break;
                            }

                            case "available": {
                                this.emailStatus = "available";
                                break;
                            }

                            case "email_is_invalid": {
                                this.emailStatus = "invalid";
                                break;
                            }
                            default: {
                                this.emailStatus = "";
                                break;
                            }
                        }
                        resp.data == "available"
                            ? (this.emailAvailable = true)
                            : (this.emailAvailable = false);
                        this.$store.commit("LOADING", false);
                    })
                    .catch(err => {
                        this.$store.commit("LOADING", false);
                        throw ("err", err);
                    });
            }
        }
    },
    computed: {
        errors() {
            // Validation Three: Errors and Me
            var reqErrors = [];

            // Required and empty - error
            if (this.isRequired && this.value == "") {
                reqErrors.push("This field is required");
            }

            // Spaces are not a valid input without other characters - error]
            if (this.value.length > 0 && this.value.trim().length == 0) {
                reqErrors.push(
                    "You can't use spaces as the only input for this field"
                );
            }

            /* Check the array of validations and check the field value against each one. To add a new rule simple put it in the array in the parent component and then add a case for it and put the logic in the case. The array needs the rule type (string), rule value (depends on the rule), and a rule error message (string). Check the rule value against the field value, if it's an error return the rule message.*/
            const validationErrors = this.validation
                .filter(rule => {
                    switch (rule.type) {
                        case "min": {
                            if (
                                this.value.length < rule.value &&
                                this.value.length > 0
                            ) {
                                return rule.msg;
                            }
                            break;
                        }
                        case "max": {
                            if (
                                this.value.length > rule.value &&
                                !this.isClean
                            ) {
                                return rule.msg;
                            }
                            break;
                        }
                        case "match": {
                            // If the value is an array and the array is not empty, check against all items
                            if (
                                Array.isArray(rule.value) &&
                                rule.value.length != 0
                            ) {
                                if (
                                    !rule.value.some(item => item == this.value)
                                )
                                    return rule.msg;
                            } else {
                                if (this.value != rule.value) {
                                    return rule.msg;
                                }
                            }

                            break;
                        }
                        case "mustContain": {
                            let valueArr = this.value.split("");
                            if (
                                rule.value.every(
                                    item => valueArr.indexOf(item) === -1
                                )
                            ) {
                                return rule.msg;
                            }
                            break;
                        }
                        case "cantContain": {
                            let valueArr = this.value.split("");
                            if (
                                rule.value.every(
                                    item => valueArr.indexOf(item) >= 0
                                )
                            ) {
                                return rule.msg;
                            }
                            break;
                        }
                        case "email": {
                            // if (this.value.indexOf("@") === -1) {
                            //     return rule.msg;
                            // }

                            // if (
                            //     this.value.lastIndexOf(".") <
                            //     this.value.indexOf("@")
                            // ) {
                            //     return rule.msg;
                            // }

                            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/ig;
                            if (!emailRegex.test(this.value)) {
                                return rule.msg;
                            }

                            break;
                        }
                        case "passwordComplexity": {
                            /* regular expression for checking:
								- at least 8 character lenght
								- lowercase letters
								- uppercase letters
								- numbers
								- special characters
							*/
                            const pwRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])^\S{8,}$/g;

                            if (!pwRegex.test(this.value)) {
                                return rule.msg;
                            }
                            break;
                        }
                        case "phone": {
                            /* regular expression for checking if the phone number is valid */
                            const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

                            if (!regex.test(this.value)) {
                                return rule.msg;
                            }
                            break;
                        }
                        case "postalCode": {
                            /* regular expression for checking if the phone number is valid */
                            const regex = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/;

                            if (!regex.test(this.value.toUpperCase())) {
                                return rule.msg;
                            }
                            break;
                        }
                        case "and": {
                            if (!rule.value) return rule.msg;
                            break;
                        }
                        default:
                            return null;
                    }
                })
                .map(item => item.msg);

            if (
                this.emailStatus == "unavailable" &&
                this.validateEmail &&
                !this.loading
            ) {
                validationErrors.push("This email has already been registered");
            }

            if (
                this.emailStatus == "invalid" &&
                this.validateEmail &&
                !this.loading
            ) {
                validationErrors.push(
                    "This email is invalid. Please check it again to be sure it doesn't have any invalid characters like spaces"
                );
            }

            if (this.value && this.password) {
                const lowerRegex = /[a-z]/g;
                const upperRegex = /[A-Z]/g;
                const numberRegex = /[0-9]/g;
                const symbolRegex = /[!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]/g;
                const spacesRegex = /\s/g;

                if (!lowerRegex.test(this.value)) {
                    validationErrors.push(
                        "Your password needs at least one lowercase letter"
                    );
                }

                if (!upperRegex.test(this.value)) {
                    validationErrors.push(
                        "Your password needs at least one uppercase letter"
                    );
                }

                if (!numberRegex.test(this.value)) {
                    validationErrors.push(
                        "Your password needs at least one number"
                    );
                }

                if (!symbolRegex.test(this.value)) {
                    validationErrors.push(
                        "Your password needs at least one special character"
                    );
                }

                if (spacesRegex.test(this.value)) {
                    validationErrors.push("Your password can't contain spaces");
                }

                if (this.value.length < 8) {
                    validationErrors.push(
                        "Your password must be at least 8 characters long"
                    );
                }
            }

            const errors = [...reqErrors, ...validationErrors];

            // Unnecessary after input refactor, uncomment if you want errors emitted
            // if (errors.length > 0) {
            //     this.$emit("error", { id: this.inputId, error: true });
            // } else {
            //     this.$emit("error", { id: this.inputId, error: false });
            // }
            return errors;
        },
        hasError() {
            return this.errors.length > 0;
        },
        submitted() {
            return (
                this.$parent.submitted || this.$parent.cardSubmitted || false
            );
        },
        loading() {
            return this.$store.getters.loading;
        }
    },
    beforeMount() {
        // Unnecessary after input refactor, uncomment if you want errors emitted
        // this.$emit("error", {
        //     id: this.inputId,
        //     error: this.isRequired
        // });

        // If there's a value on mount, it means the field was filled previously so mark it as dirty
        if (this.value) this.isClean = false;
    }
};
</script>

<style lang="scss" scoped>
.form-group--error {
    input,
    textarea {
        border-color: #dc3545 !important;

        &:focus {
            box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
    }
}

.invalid-feedback {
    display: block !important;
}
</style>