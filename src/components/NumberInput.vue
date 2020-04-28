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
            <span class="text-muted" v-if="isRequired == false">(optional)</span>
        </label>
        <input
            type="number"
            :class="['form-control', errors.length > 0 && (!isClean || submitted) ? 'is-invalid' : errors.length == 0 && (!isClean || submitted) ? 'is-valid' : '']"
            :id="inputId"
            :placeholder="placeholder"
            :value="value"
            min="0"
            @input="handleInput($event)"
            :disabled="disabled"
        />
        <div class="invalid-feedback" v-if="errors.length > 0 && (!isClean || submitted)">
            <div v-for="(error, index) in errors" :key="index">{{error}}</div>
        </div>
        <small class="form-text text-muted d-block" v-else-if="helpText">{{helpText}}</small>
    </div>
</template>

<script>
export default {
    name: "numberInput",
    props: {
        wrapperClasses: {
            type: Array,
            default: () => {
                return ["col-12 col-sm-6 col-md-4"];
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
        value: [String, Number],
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isClean: true
        };
    },
    methods: {
        handleInput(e) {
            this.isClean = false;
            const val = Number(String(e.target.value).replace(/-/gi, ""));
            this.$emit("input", val);
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
                        case "min":
                            if (
                                this.value < rule.value &&
                                this.value.length > 0
                            ) {
                                return rule.msg;
                            }
                            break;
                        case "max":
                            if (this.value > rule.value && !this.isClean) {
                                return rule.msg;
                            }
                            break;
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

            // Unnecessary after input refactor, uncomment if you want errors emitted
            // if (errors.length > 0) {
            //     this.$emit("error", { id: this.inputId, error: true });
            // } else {
            //     this.$emit("error", { id: this.inputId, error: false });
            // }
            return errors;
        },
        submitted() {
            return (
                this.$parent.submitted || this.$parent.cardSubmitted || false
            );
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
