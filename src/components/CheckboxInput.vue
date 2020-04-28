<template>
    <div
        :class="[wrapperClasses, errors.length > 0  && (!isClean || submitted) ? 'form-group--error' : '']"
    >
        <div :class="[inline ? 'form-check-inline' : '', 'form-check']">
            <label
                :for="inputId"
                :class="[labelClasses ? labelClasses : null, 'form-check-label','mr-2']"
                v-if="!labelAfter && !srOnly"
            >
                {{labelText}}
                <span
                    class="text-muted"
                    v-if="isRequired == false && optionalFlag"
                >(optional)</span>
            </label>
            <input
                type="checkbox"
                class="form-check-input"
                :id="inputId"
                :placeholder="placeholder"
                :checked="value"
                @change="isClean = false; $emit('input', $event.target.checked)"
                :disabled="disabled"
            />
            <label
                :for="inputId"
                :class="[labelClasses ? labelClasses : null, 'form-check-label']"
                v-if="labelAfter && !srOnly"
            >
                {{labelText}}
                <span
                    class="text-muted"
                    v-if="isRequired == false && optionalFlag"
                >(optional)</span>
            </label>
        </div>
        <div class="invalid-feedback d-block" v-if="errors.length > 0 && (!isClean || submitted)">
            <div v-for="(error, index) in errors" :key="index">{{error}}</div>
        </div>
        <small class="form-text text-muted d-block" v-else-if="helpText">{{helpText}}</small>
    </div>
</template>

<script>
export default {
    name: "checkboxInput",
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
        labelAfter: {
            type: Boolean,
            default: true
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
    },
    data() {
        return {
            isClean: true
        };
    },
    computed: {
        errors() {
            var errors = [];

            // Required and empty - error
            if (this.isRequired && this.value == "") {
                this.customError
                    ? errors.push(this.customError)
                    : errors.push("This field is required");
            }

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
