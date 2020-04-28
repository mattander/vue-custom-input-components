<template>
    <ValidationProvider
        :rules="rules"
        v-slot="{ errors, failed, passed }"
        :mode="mode"
        :vid="name"
        slim
    >
        <div
            class="form-group"
            :class="{
                'input-group-focus': focused,
                'has-error': failed,
                'has-success': passed,
                'with-icon': failed || passed
            }"
        >
            <slot name="label">
                <label :for="cbId" v-if="label" class="control-label">
                    <span v-if="false == true" class="input-required">*</span>
                    {{ label }}
                </label>
            </slot>
            <div class="row align-items-center justify-content-start">
                <div class="col-11 position-relative">
                    <input
                        v-if="mask"
                        v-mask="mask"
                        v-model="currentData"
                        :name="name"
                        :type="currentType"
                        :disabled="disabled"
                        :maxlength="maxLength"
                        class="form-control"
                        :id="cbId"
                        ref="input"
                    />
                    <input
                        v-else
                        v-model="currentData"
                        :name="name"
                        :type="currentType"
                        :disabled="disabled"
                        :maxlength="maxLength"
                        class="form-control"
                        :id="cbId"
                        ref="input"
                    />
                    <slot name="addonRight"></slot>
                    <button
                        type="button"
                        v-if="initialType === 'password'"
                        class="input-eye"
                        @click="seeText = !seeText"
                    >
                        <SvgIconOpenEye v-if="currentType === 'text'" />
                        <SvgIconClosedEye v-else />
                    </button>
                </div>

                <SvgIconValidSign v-if="passed" class="input-svg" />
                <SvgIconError v-if="errors[0]" class="input-svg" />
            </div>

            <p class="text-red mt-3 mb-0" v-if="failed">
                {{ errors[0] }}
            </p>
        </div>
    </ValidationProvider>
</template>

<script>
import SvgIconError from '@/components/Svg/SvgIconError.vue';
import SvgIconValidSign from '@/components/Svg/SvgIconValidSign.vue';
import SvgIconOpenEye from '@/components/Svg/SvgIconOpenEye.vue';
import SvgIconClosedEye from '@/components/Svg/SvgIconClosedEye.vue';
import { mask } from 'vue-the-mask';
import { ValidationProvider } from 'vee-validate';

export default {
    directives: { mask },
    components: {
        SvgIconError,
        SvgIconValidSign,
        SvgIconOpenEye,
        SvgIconClosedEye,
        ValidationProvider
    },
    inheritAttrs: false,
    props: {
        initialType: {
            type: String,
            default: 'text'
        },
        label: {
            type: String,
            description: 'Input label'
        },
        value: {
            type: [String, Number],
            description: 'Input value'
        },
        name: {
            type: String,
            description: 'Input name attribute'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        maxLength: {
            type: Number,
            description: 'Max length of characters allowed'
        },
        mask: {
            type: [String, Boolean],
            default: false
        },
        rules: {
            type: [String, Object],
            required: false
        },
        mode: {
            type: String,
            default: 'eager'
        }
    },
    model: {
        prop: 'value',
        event: 'input'
    },
    data() {
        return {
            focused: false,
            iId: '',
            isDataInvalid: false,
            currentData: '',
            seeText: false
        };
    },
    computed: {
        currentType() {
            if (this.initialType === 'password') {
                return this.seeText ? 'text' : 'password';
            }
            return this.initialType;
        }
    },
    methods: {
        focus() {
            this.$refs.input.focus();
        },
        reset() {
            this.focused = false;
            this.isDataInvalid = false;
        }
    },
    created() {
        this.cbId = Math.random()
            .toString(16)
            .slice(2);
    },
    mounted() {
        this.currentData = this.value;
    },
    watch: {
        value(newVal) {
            if (newVal !== undefined) {
                this.currentData = newVal;
                this.reset();
            }
        },
        currentData(newVal) {
            this.$emit('input', newVal);
        }
    }
};
</script>
