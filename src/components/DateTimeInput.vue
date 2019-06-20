<template>
    <div class="form-row">
        <div
            :class="[errors.length > 0  && (!isClean || submitted) ? 'form-group--error' : '', 'form-group', 'col-12 col-md-4']"
        >
            <label :for="inputId" class="sr-only">
                {{labelText}}
                <span class="text-muted" v-if="isRequired == false">(optional)</span>
            </label>
            <div
                class="datepicker-popup"
                v-if="inputFocus"
                @mouseenter="pickerHover = true"
                @mouseleave.self="pickerHover = false"
            >
                <div :class="['calendar-wrapper']" v-popupcalc="inputId">
                    <div class="calendar-header">
                        <h4>Pick a date</h4>
                        <button @click.prevent="inputFocus = false" class="calendar-close">Close</button>
                    </div>
                    <fieldset class="form-inline date-picker__monthyear">
                        <div class="form-row justify-content-center align-items-center">
                            <button
                                @click.prevent="datepickerparams.month--"
                                class="btn-change-month prev"
                            >&larr;</button>
                            <div class="form-group col-auto">
                                <select
                                    name="months"
                                    class="date-picker__month form-control"
                                    id="pickerMonth"
                                    v-model="datepickerparams.month"
                                >
                                    <option
                                        v-for="n in 12"
                                        :key="'month-'+n"
                                        :value="n-1"
                                    >{{dayjs().month(n-1).format('MMMM')}}</option>
                                </select>
                            </div>
                            <div class="form-group col-auto">
                                <select
                                    name="year"
                                    class="date-picker__year form-control"
                                    id="pickerYear"
                                    v-model="datepickerparams.year"
                                >
                                    <option
                                        v-for="n in 6"
                                        :key="'year-' + today.year + (n-1)"
                                        :value="today.year + (n-1)"
                                    >{{today.year + (n-1)}}</option>
                                </select>
                            </div>
                            <button
                                @click.prevent="datepickerparams.month++"
                                class="btn-change-month next"
                            >&rarr;</button>
                        </div>
                    </fieldset>
                    <Calendar
                        :start="datepicker.firstDayIndex"
                        :end="datepicker.daysInPickerMonth"
                        :month="datepickerparams.month"
                        :year="datepickerparams.year"
                        :today="today"
                        @date-change="parseDate($event, 'date');"
                    />
                </div>
            </div>
            <input
                type="text"
                :name="inputId"
                :class="['form-control', errors.length > 0 && (!isClean || submitted) ? 'is-invalid' : errors.length == 0 && (!isClean || submitted) ? 'is-valid' : '']"
                :id="inputId"
                :placeholder="placeholder"
                :value="dateFields.date"
                @change="parseDate($event.target.value, 'date');"
                @blur.self="isClean = false; $emit('blur'); hidePicker($event)"
                @focus="$emit('focus'); inputFocus = true;"
                :disabled="disabled"
            >
            <div class="invalid-feedback" v-if="errors.length > 0 && (!isClean || submitted)">
                <div v-for="(error, index) in errors" :key="index">{{error}}</div>
            </div>
            <small class="form-text text-muted d-block" v-else-if="helpText">{{helpText}}</small>
            <small class="form-text text-muted d-block">Example: July 2, 2019</small>
        </div>
        <div
            :class="[errors.length > 0  && (!isClean || submitted) ? 'form-group--error' : '', 'form-group', 'col-auto']"
            v-if="value"
        >
            <label :for="inputId+'hour'" class="form-label sr-only">
                Time
                <span class="text-muted" v-if="isRequired == false">(optional)</span>
            </label>
            <select
                :class="['form-control', errors.length > 0 && (!isClean || submitted) ? 'is-invalid' : errors.length == 0 && (!isClean || submitted) ? 'is-valid' : '']"
                :name="inputId+'hour'"
                :id="inputId+'hour'"
                :disabled="!value"
                @change="parseDate($event.target.value,'hour')"
                :value="dateFields.hour"
            >
                <option value>-</option>
                <option value="01">1</option>
                <option value="02">2</option>
                <option value="03">3</option>
                <option value="04">4</option>
                <option value="05">5</option>
                <option value="06">6</option>
                <option value="07">7</option>
                <option value="08">8</option>
                <option value="09">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
            </select>
        </div>
        <div
            :class="[errors.length > 0  && (!isClean || submitted) ? 'form-group--error' : '', 'form-group', 'col-auto']"
            v-if="value"
        >
            <label :for="inputId+'minute'" class="form-label sr-only">
                Minute
                <span class="text-muted" v-if="isRequired == false">(optional)</span>
            </label>
            <select
                :class="['form-control', errors.length > 0 && (!isClean || submitted) ? 'is-invalid' : errors.length == 0 && (!isClean || submitted) ? 'is-valid' : '']"
                :name="inputId+'minute'"
                :id="inputId+'minute'"
                :disabled="!value"
                @change="parseDate($event.target.value,'minute')"
                :value="dateFields.minute"
            >
                <option value>-</option>
                <option value="00">00</option>
                <option value="05">05</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="35">35</option>
                <option value="40">40</option>
                <option value="45">45</option>
                <option value="50">50</option>
                <option value="50">50</option>
                <option value="55">55</option>
            </select>
        </div>
        <div
            :class="[errors.length > 0  && (!isClean || submitted) ? 'form-group--error' : '', 'form-group', 'col-auto']"
            v-if="value"
        >
            <label :for="inputId+'timeofday'" class="form-label sr-only">
                AM/PM
                <span class="text-muted" v-if="isRequired == false">(optional)</span>
            </label>
            <select
                :class="['form-control', errors.length > 0 && (!isClean || submitted) ? 'is-invalid' : errors.length == 0 && (!isClean || submitted) ? 'is-valid' : '']"
                :name="inputId+'timeofday'"
                :id="inputId+'timeofday'"
                :disabled="!value"
                @change="parseDate($event.target.value,'timeofday')"
                :value="dateFields.timeOfDay"
            >
                <option value>-</option>
                <option value="AM">AM</option>
                <option value="PM">PM</option>
            </select>
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs";
import Calendar from "@/components/Calendar.js";

export default {
    name: "dateTimeInput",
    components: { Calendar },
    props: {
        wrapperClasses: {
            type: Array,
            default: () => {
                return ["col-auto"];
            }
        },
        defaultTime: {
            type: Object,
            default: () => {
                return {
                    hour: 12,
                    minute: 0
                };
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
        value: [Object, String],
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isClean: true,
            invalidDate: false,
            inputFocus: false,
            datepickerparams: {
                month: "",
                selectedDay: "",
                year: ""
            },
            today: {
                day: dayjs().date(),
                month: dayjs().month(),
                year: dayjs().year()
            },
            pickerHover: false
        };
    },
    computed: {
        dateFields() {
            return {
                date: this.value
                    ? dayjs(this.value).format("MMMM D, YYYY")
                    : "",
                hour: this.value ? dayjs(this.value).format("hh") : "",
                minute: this.value ? dayjs(this.value).format("mm") : "",
                timeOfDay: this.value
                    ? dayjs(this.value).get("hour") < 12
                        ? "AM"
                        : "PM"
                    : ""
            };
        },
        datepicker() {
            let datepickerobj = {
                daysInPickerMonth: dayjs(
                    this.datepickerparams.dateObj
                ).daysInMonth(),
                weeksInPickerMonth:
                    Math.floor(
                        dayjs(this.datepickerparams.dateObj).daysInMonth() / 7
                    ) + 1,
                firstDayIndex: dayjs(
                    new Date(
                        this.datepickerparams.year,
                        this.datepickerparams.month,
                        1
                    )
                ).day()
            };

            // datepickerobj.daysInPickerMonth = dayjs(this.datepickerparams.dateObj).daysInMonth();
            // datepickerobj.weeksInPickerMonth =
            //     Math.floor(dayjs(this.datepickerparams.dateObj).daysInMonth() / 7) + 1;
            // datepickerobj.firstDayIndex = dayjs(
            //     new Date(
            //         this.datepickerparams.year,
            //         this.datepickerparams.month,
            //         1
            //     )
            // ).day();
            return datepickerobj;
        },
        errors() {
            // Validation Three: Errors and Me
            var reqErrors = [];

            // Required and empty - error
            if (this.isRequired && this.value == "" && !this.invalidDate) {
                reqErrors.push("This field is required");
            }

            // Must be a valid date
            if (this.invalidDate) {
                reqErrors.push(
                    "The date you entered is not valid. \nTry using a format like MM/DD/YYYY"
                );
            }

            /* Check the array of validations and check the field value against each one. To add a new rule simple put it in the array in the parent component and then add a case for it and put the logic in the case. The array needs the rule type (string), rule value (depends on the rule), and a rule error message (string). Check the rule value against the field value, if it's an error return the rule message.*/

            // Adding in a default validation
            const valRules = [
                ...this.validation,
                {
                    type: "notInThePast",
                    value: "",
                    msg: "This date can't be in the past."
                }
            ];

            const validationErrors = valRules
                .filter(({ type, value, msg }) => {
                    switch (type) {
                        case "before": {
                            if (dayjs(this.value).isBefore(value)) return msg;
                            break;
                        }
                        case "notInThePast": {
                            if (dayjs(this.value).isBefore(dayjs())) return msg;
                            break;
                        }
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
    },
    watch: {
        isRequired() {
            this.value.length == 0 ? (this.isClean = true) : null;
            this.$emit("clean");
        }
    },
    methods: {
        hidePicker() {
            this.pickerHover ? null : (this.inputFocus = false);
        },
        parseDate(val, type) {
            console.log("parseDate", val, type);
            switch (type) {
                case "date": {
                    if (String(dayjs(val)) == "Invalid date") {
                        this.invalidDate = true;
                        break;
                    }

                    if (String(dayjs(val)) !== "Invalid date") {
                        console.log("value: ", this.value, "val: ", val);
                        const currentDate = this.value
                            ? dayjs(this.value)
                            : dayjs(val, [
                                  "MM DD YY",
                                  "MM DD YYYY",
                                  "MM DD",
                                  "MMMM DD, YYYY",
                                  "MMM DD, YYYY"
                              ])
                                  .set("hour", this.defaultTime.hour)
                                  .set("minute", this.defaultTime.minute);
                        this.invalidDate = false;

                        this.$emit(
                            "input",
                            dayjs(val, [
                                "MM DD YY",
                                "MM DD YYYY",
                                "MM DD",
                                "MMMM DD, YYYY",
                                "MMM DD, YYYY"
                            ])
                                .set("hour", currentDate.hour())
                                .set("minute", currentDate.minute())
                                .format("YYYY-MM-DD HH:mm:ss")
                        );
                    }

                    this.inputFocus = false;
                    break;
                }
                case "hour": {
                    let hour =
                        this.dateFields.timeOfDay == "AM"
                            ? val
                            : Number(val) + 12;

                    // If the time is 12 am set it to 0
                    if (val == 12 && this.dateFields.timeOfDay == "AM")
                        hour = 0;

                    // If the time is noon set it to 12
                    if (val == 12 && this.dateFields.timeOfDay == "PM")
                        hour = 12;

                    console.log(
                        "time ",
                        dayjs(this.value)
                            .hour(hour)
                            .format("YYYY-MM-DD HH:mm:ss")
                    );
                    this.$emit(
                        "input",
                        dayjs(this.value)
                            .hour(hour)
                            .format("YYYY-MM-DD HH:mm:ss")
                    );
                    break;
                }
                case "minute": {
                    console.log(
                        "time minute ",
                        dayjs(this.value)
                            .minute(val)
                            .format("YYYY-MM-DD HH:mm:ss")
                    );
                    this.$emit(
                        "input",
                        dayjs(this.value)
                            .minute(val)
                            .format("YYYY-MM-DD HH:mm:ss")
                    );
                    break;
                }
                case "timeofday": {
                    const currentHour = Number(this.dateFields.hour);

                    let hour = val == "AM" ? currentHour : currentHour + 12;

                    if (val == "AM" && currentHour == 12) hour = 0;
                    if (val == "PM" && currentHour == 12) hour = 12;

                    console.log(
                        "timeofday ",
                        dayjs(this.value)
                            .hour(hour)
                            .format("YYYY-MM-DD HH:mm:ss")
                    );

                    this.$emit(
                        "input",
                        dayjs(this.value)
                            .hour(hour)
                            .format("YYYY-MM-DD HH:mm:ss")
                    );
                    break;
                }
                default: {
                    return;
                }
            }
        }
    },
    mounted() {
        // set the picker info to either the values in the field or, if it's empty, the values of today
        let values = {
            selectedDay: this.value ? dayjs(this.value).date() : dayjs().date(),
            month: this.value ? dayjs(this.value).month() : dayjs().month(),
            year: this.value ? dayjs(this.value).year() : dayjs().year()
        };

        values.dateObj = new Date(
            values.year,
            values.month,
            values.selectedDay
        );

        this.datepickerparams = values;
        // on mount emit an input event to populate the error list and trigger errors for any values that are current required
        this.$emit("error", {
            id: this.inputId,
            error: this.isRequired
        });
    }
};
</script>

<style lang="scss">
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

.datepicker-popup {
    position: absolute;
    height: 0;
    width: 0;
    z-index: 990;
}

.calendar-wrapper {
    background-color: #fff;
    z-index: 999;
    width: 300px;
    display: block;
    border: 1px solid black;
    border-radius: 3.5px;
    position: relative;

    .calendar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px 15px;

        h4 {
            font-size: 1.25rem;
            display: inline-flex;
            margin-bottom: 0;
        }

        .calendar-close {
            background-color: #fff;
            -webkit-appearance: none;
            border: none;
            font-size: 16px;
            color: #0069af;
        }
    }

    &.picker-top {
        &:before {
            border-left: 15px solid white;
            border-right: 15px solid white;
            border-top: 15px solid black;
            left: 125px;
            bottom: -15px;
        }

        &:after {
            border-left: 14px solid transparent;
            border-right: 14px solid transparent;
            border-top: 14px solid white;
            left: 126px;
            bottom: -13px;
        }
    }

    &.picker-bottom {
        &:before {
            border-left: 15px solid white;
            border-right: 15px solid white;
            border-bottom: 15px solid black;
            left: 125px;
            top: -15px;
        }

        &:after {
            border-left: 14px solid transparent;
            border-right: 14px solid transparent;
            border-bottom: 14px solid white;
            left: 126px;
            top: -13px;
        }
    }

    &:before {
        content: "";
        height: 0;
        width: 0;
        display: block;
        position: absolute;
    }

    &:after {
        content: "";
        height: 0;
        width: 0;
        display: block;
        position: absolute;
    }
}

.btn-change-month {
    background-color: #fff;
    -webkit-appearance: none;
    border: none;
    font-size: 20px;
    color: rgb(52, 52, 52);

    &.prev {
        margin-right: 0.5rem;
    }

    &.next {
        margin-left: 0.5rem;
    }
}

.date-picker__calendar-container {
    margin: 5px 10px;

    .calendar-day {
        display: inline-flex;
        width: 14.2857%;
        justify-content: center;
        align-items: center;
        padding: 15px;
        cursor: pointer;

        &:hover {
            background-color: #f0f0f0;
        }

        .day {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            width: 10px;
            height: 10px;

            &.weekday {
                text-align: center;
            }
        }

        .days-prev-month {
            color: #7f7f7f;
        }

        .today {
            font-weight: bold;
        }

        &.past {
            cursor: default !important;

            .past {
                color: #a5a5a5 !important;
            }
        }
    }
}
</style>
