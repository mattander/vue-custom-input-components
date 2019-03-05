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
            <span class="text-muted" v-if="!isRequired && !hideOptional">(optional)</span>
        </label>
        <select
            class="form-control"
            :id="inputId"
            :value="value"
            @change="isClean = false; $emit('input', $event.target.value)"
            :disabled="disabled"
        >
            <option
                v-for="option in options"
                :value="option.value"
                :key="option.value"
                :disabled="isRequired && option.value == ''"
            >{{option.text}}</option>
        </select>
        <div class="invalid-feedback" v-if="errors.length > 0 && (!isClean || submitted)">
            <div v-for="(error, index) in errors" :key="index">{{error}}</div>
        </div>
        <small class="form-text text-muted d-block" v-else-if="helpText">{{helpText}}</small>
    </div>
</template>

<script>
export default {
    name: "selectInput",
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
        submitted: {
            default: false
        },
        srOnly: {
            type: Boolean,
            default: false
        },
        value: [String, Number],
        options: Array,
        disabled: {
            type: Boolean,
            default: false
        },
        hideOptional: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isClean: true
        };
    },
    mounted() {
        // on mount emit an input event to populate the error list and trigger errors for any values that are current required
        this.$emit("error", {
            id: this.inputId,
            error: this.isRequired
        });
    },
    watch: {
        isRequired() {
            this.value.length == 0 ? (this.isClean = true) : null;
            this.$emit("clean");
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

            /* Check the array of validations and check the field value against each one. To add a new rule simple put it in the array in the parent component and then add a case for it and put the logic in the case. The array needs the rule type (string), rule value (depends on the rule), and a rule error message (string). Check the rule value against the field value, if it's an error return the rule message.*/
            const validationErrors = this.validation
                .filter(rule => {
                    switch (rule.type) {
                        case "match":
                            if (this.value != rule.value) {
                                return rule.msg;
                            }
                            break;
                        default:
                            return null;
                    }
                })
                .map(item => item.msg);

            const errors = [...reqErrors, ...validationErrors];

            if (errors.length > 0) {
                this.$emit("error", { id: this.inputId, error: true });
            } else {
                this.$emit("error", { id: this.inputId, error: false });
            }
            return errors;
        }
    }
};
</script>

<style lang="scss" scoped>
.form-group--error {
    select {
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
