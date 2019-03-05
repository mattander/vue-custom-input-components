<template>
    <div
        :class="[wrapperClasses, errors.length > 0  && (!isClean || submitted) ? 'form-group--error' : '']"
    >
        <div
            :class="[inline ? 'form-check-inline' : '', 'form-check']"
            v-for="(option, index) in options"
            :key="inputId + (index+1)"
        >
            <label
                :for="inputId + (index+1)"
                :class="[labelClasses ? labelClasses : null, 'form-check-label']"
                v-if="!labelAfter && !srOnly"
            >
                {{option.labelText}}
                <span class="text-muted" v-if="isRequired == false">(optional)</span>
            </label>
            <input
                type="radio"
                class="form-check-input"
                :name="name"
                :id="inputId + (index+1)"
                :checked="option.value == value"
                @change="isClean = false; $emit('input', option.value)"
                :disabled="option.disabled"
            >
            <label
                :for="inputId + (index+1)"
                :class="[labelClasses ? labelClasses : null, 'form-check-label']"
                v-if="labelAfter && !srOnly"
            >
                {{option.labelText}}
                <span class="text-muted" v-if="isRequired == false">(optional)</span>
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
    name: "radioInput",
    props: {
        wrapperClasses: {
            type: Array,
            default: () => {
                return ["col-auto"];
            }
        },
        labelClasses: Array,
        inputId: String,
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
        name: String,
        options: Array
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
            var errors = [];

            // Required and empty - error
            if (this.isRequired && this.value == "") {
                errors.push("This field is required");
            }

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
