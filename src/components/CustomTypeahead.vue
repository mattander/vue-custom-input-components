<template>
  <div :class="[wrapperClasses, errors.length > 0  && (!isClean || submitted) ? 'form-group--error' : '', 'form-group', 'my-3']">
    <label
      :for="inputId"
      :class="[labelClasses ? labelClasses : null, 'form-label']"
      v-if="!srOnly"
    >
      {{labelText}}
      <span
        class="text-muted"
        v-if="isRequired == false"
      >(optional)</span>
    </label>
    <input
      type="text"
      class="form-control"
      :id="inputId"
      :placeholder="placeholder"
      :value="value"
      :disabled="disabled"
      @input="isClean = false; $emit('input', $event.target.value);"
      @focus="isFocused = true"
      @blur="isFocused = false"
      autocomplete="off"
    >
    <div
      class="typeahead-options"
      v-if="isFocused"
    >
      <div
        class="typeahead-options--item"
        v-if="noMatch"
      >No matching results found.</div>
      <div
        class="typeahead-options--item"
        v-for="(option,index) in options"
        :key="index"
        v-show="value.length > 0 && option.name.toLowerCase().indexOf(value.toLowerCase()) != -1"
        @mousedown.prevent
        @click="handleClick(option.name)"
        @focus="isFocused = true"
        v-html="boldMatch(option.name, value)"
      ></div>
    </div>
    <div
      class="invalid-feedback"
      v-if="errors.length > 0 && (!isClean || submitted)"
    >
      <div
        v-for="(error, index) in errors"
        :key="index"
      >{{error}}</div>
    </div>
    <small
      class="form-text text-muted d-block"
      v-else-if="helpText"
    >{{helpText}}</small>
  </div>
</template>

<script>
export default {
  name: "customTypeaheadInput",
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
    value: String,
    disabled: {
      type: Boolean,
      default: false
    },
    options: Array
  },
  methods: {
    handleClick(option) {
      this.$emit("input", option);
      this.isHit = true;
      this.isFocused = false;
    },
    boldMatch(string, query) {
      return string.replace(query, "<strong>" + query + "</strong>");
    }
  },
  data() {
    return {
      isClean: true,
      isHit: false,
      isFocused: false
    };
  },
  mounted() {
    // on mount emit an error event to populate the error list and trigger errors for any values that are current required
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
    hit() {
      return this.isHit && this.value;
    },
    noMatch() {
      return (
        this.options.filter(item => {
          return item.name.indexOf(this.value) != -1;
        }).length == 0
      );
    },
    errors() {
      // Validation Three: Errors and Me
      var reqErrors = [];

      // Required and empty (no hit) - error
      if (this.isRequired && !this.hit && !this.isFocused) {
        reqErrors.push("This field is required");
      }

      /* Check the array of validations and check the field value against each one. To add a new rule simple put it in the array in the parent component and then add a case for it and put the logic in the case. The array needs the rule type (string), rule value (depends on the rule), and a rule error message (string). Check the rule value against the field value, if it's an error return the rule message.*/
      const validationErrors = this.validation
        .filter(rule => {
          switch (rule.type) {
            case "min":
              if (this.value.length < rule.value && this.value.length > 0) {
                return rule.msg;
              }
              break;
            case "max":
              if (this.value.length > rule.value && !this.isClean) {
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

.typeahead-options {
  display: block;
  border-radius: 0 0 3.4px 3.4px;
  border: 1px solid #ced4da;
  position: absolute;
  width: 98%;
  background-color: #fff;
  margin-bottom: 2rem;

  .typeahead-options--item {
    width: 100%;
    padding: 0.25rem 1rem;
    border-bottom: 1px solid #ced4da;
    cursor: pointer;

    &:hover {
      background-color: #f4f4f4;
    }

    &:last-child {
      border-bottom: 0;
      margin-bottom: 0;
    }
  }
}
</style>