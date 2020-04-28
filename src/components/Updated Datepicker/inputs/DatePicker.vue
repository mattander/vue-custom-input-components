<template>
    <div
        :class="['datepicker-modal', ...wrapperClasses]"
        @mouseenter="pickerHover = true"
        @mouseleave.self="pickerHover = false"
    >
        <slot name="header">
            <div class="modal-header">
                <h5>Pick a date</h5>
                <button class="modal-close">
                    Close
                </button>
            </div>
        </slot>

        <div class="modal-body">
            <fieldset class="date-picker__monthyear">
                <div class="picker-row">
                    <button
                        @click.self.prevent="month--"
                        class="btn-change-month prev"
                    >
                        &blacktriangleleft;
                    </button>
                    <div class="form-group">
                        <select
                            name="months"
                            class="date-picker__month form-control"
                            id="pickerMonth"
                            v-model="month"
                        >
                            <option
                                v-for="n in 12"
                                :key="'month-' + n"
                                :value="n - 1"
                            >
                                {{
                                    dayjs()
                                        .month(n - 1)
                                        .format('MMMM')
                                }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <select
                            name="year"
                            class="date-picker__year form-control"
                            id="pickerYear"
                            v-model="year"
                        >
                            <option
                                v-for="year in years"
                                :key="'year-' + year"
                                :value="year"
                                >{{ year }}</option
                            >
                        </select>
                    </div>
                    <button
                        @click.self.prevent="month++"
                        class="btn-change-month next"
                    >
                        &blacktriangleright;
                    </button>
                </div>
            </fieldset>
            <div class="calendar-container">
                <div
                    class="calendar-day"
                    v-for="day in calendarHeaders"
                    :key="'header-' + day"
                >
                    <div class="day weekday">{{ day }}</div>
                </div>
                <button
                    v-for="(dayObj, index) in days"
                    :key="'calendar-day-' + index"
                    :class="{
                        'calendar-day': true,
                        'in-past': dayObj.isBefore(dayjs(), 'day'),
                        'prev-month': dayObj.isBefore(dayjs(), 'month'),
                        today: dayObj.isSame(dayjs(), 'date'),
                        'start-day': dayObj.isSame(startDate, 'date'),
                        selected: value
                            ? dayObj.isSame(dayjs(value), 'date')
                            : false
                    }"
                    @focus="
                        day = dayObj.date();
                        month = dayObj.month();
                        year = dayObj.year();
                    "
                    @mouseenter="dayHover"
                    @keyup.self.prevent.left="
                        selectedDay = dayObj.subtract(1, 'day')
                    "
                    @keyup.self.prevent.right="
                        selectedDay = dayObj.add(1, 'day')
                    "
                    @keyup.self.prevent.up="
                        selectedDay = dayObj.subtract(7, 'day')
                    "
                    @keyup.self.prevent.down="
                        selectedDay = dayObj.add(7, 'day')
                    "
                    @click="
                        selectedDay = dayObj;
                        $emit('input', dayObj.format('YYYY-MM-DD'));
                        $emit('close');
                    "
                    :aria-label="'Select ' + dayObj.format('MMMM D, YYYY')"
                    :data-day="dayObj.format('YYYY-MM-DD')"
                >
                    <div class="day">{{ dayObj.date() }}</div>
                </button>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" @click="$emit('close')">
                Done
            </button>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
    name: 'datePicker',
    props: {
        wrapperClasses: {
            type: Array,
            description: 'Classes added to the root element of the component.'
        },
        startDate: {
            type: [Object, String, Boolean],
            default: null
        },
        value: {
            type: [Object, String],
            default: null
        },
        numYearsPastToShow: {
            type: Number,
            default: 0
        },
        numYearsFutureToShow: {
            type: Number,
            default: 5
        },
        calendarHeaders: {
            type: Array,
            default: () => {
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            },
            description: 'The headers row values for the calendar.'
        }
    },
    data() {
        return {
            day: null,
            month: null,
            year: null,
            pickerHover: null
        };
    },
    computed: {
        years() {
            let years = [];
            const thisYear = dayjs().year();
            for (
                let i = 0 - this.numYearsPastToShow;
                i <= this.numYearsFutureToShow;
                i++
            ) {
                years.push(thisYear + i);
            }
            return years;
        },
        days() {
            // const rootDate = dayjs(`${this.month + 1} 1, ${this.year}`);
            const rootDate = dayjs(new Date([this.year, this.month, 1]));
            console.log(new Date([this.year, this.month + 1, 1]));
            let daysArr = [];

            for (let i = 0 - rootDate.day(); i < rootDate.daysInMonth(); i++) {
                daysArr.push(rootDate.add(i, 'day'));
            }
            return daysArr;
        },
        selectedDay: {
            get: function() {
                return dayjs(`${this.month + 1} ${this.day}, ${this.year}`);
            },
            set: function(newDay) {
                const dateStamp = newDay.format('YYYY-MM-DD');

                this.day = newDay.date();
                this.month = newDay.month();
                this.year = newDay.year();

                const newFocusedDay = document.querySelector(
                    'button[data-day="' + dateStamp + '"'
                );

                if (newFocusedDay) newFocusedDay.focus();
            }
        },
        triggerButton() {
            return this.$parent.$el.querySelector('input + button');
        },
        parentInput() {
            return this.$parent.$el.querySelector('input');
        }
    },
    methods: {
        dayjs: dayjs,
        dayHover(e) {
            e.target.focus();
        },
        positionPicker(relativeEl) {
            const el = this.$el;
            el.classList.remove('picker-top');
            el.classList.remove('picker-bottom');

            const { height: pickerHeight } = el.getBoundingClientRect();
            const {
                height: inputHeight,
                top: inputTop
            } = relativeEl.getBoundingClientRect();
            const roomAbove = inputTop > pickerHeight ? true : false;
            if (roomAbove) {
                el.classList.add('picker-top');
                el.style.top = `-${pickerHeight + 16}px`;
            } else {
                el.classList.add('picker-bottom');
                el.style.top = `${inputHeight + 16}px`;
            }
        },
        pickerKeyNavListener(e) {
            switch (e.keyCode) {
                case 37:
                case 38:
                case 39:
                case 40: {
                    e.preventDefault();
                    break;
                }
                case 27: {
                    this.$emit('close');
                    break;
                }
                default: {
                    return;
                }
            }
        }
    },
    beforeMount: function() {
        // set the picker info to either the values in the field or, if it's empty, the values of today

        this.day =
            dayjs(this.value).date() ||
            dayjs(this.startDate).date() ||
            dayjs().date();

        this.month =
            dayjs(this.value).month() ||
            dayjs(this.startDate).month() ||
            dayjs().month();
        this.year =
            dayjs(this.value).year() ||
            dayjs(this.startDate).year() ||
            dayjs().year();

        window.addEventListener('keydown', this.pickerKeyNavListener);
    },
    mounted: function() {
        this.positionPicker(this.triggerButton);
    },
    beforeDestroy: function() {
        window.removeEventListener('keydown', this.pickerKeyNavListener);
    }
};
</script>

<style lang="scss">
.input-button-cluster {
    display: flex;
    .datepicker-input {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        margin-right: -1px;

        + .calendar-trigger {
            border-radius: 0 3.5px 3.5px 0;
            margin-left: 0;
        }
    }
}

.datepicker-modal {
    box-sizing: border-box;
    display: flex;
    flex-flow: column nowrap;
    position: absolute;
    width: 100%;
    max-width: 350px;
    margin: 40px;
    border: solid 1px black;

    .modal-header {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 20px;
        border-bottom: 1px solid #b9b9b9;

        h5 {
            margin: 0;
            padding: 0;
            font-weight: 300;
        }

        .modal-close {
            display: inline-flex;
            flex-flow: row nowrap;
            align-items: center;
            padding: 5px;
            margin: 0;
            line-height: 0;
            background: white;
            border: none;
            border-radius: 3.5px;
            font-size: 16px;
            line-height: 15px;

            &:hover {
                background: #e2e2e2;
            }

            &:after {
                content: '\2715';
                display: inline-block;
                font-size: 18px;
                height: 15px;
                width: 15px;
                margin: 0;
                margin-left: 10px;
                padding: 0;
            }
        }
    }

    .modal-body {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: flex-start;
        padding: 20px;

        label {
            align-self: flex-start;
        }
    }

    .modal-footer {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        align-items: center;
        margin: 0;
        padding: 15px 20px;
        border-top: 1px solid #b9b9b9;

        button {
            margin-left: 10px;
        }
    }
}

.picker-row {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 300px;

    select,
    button {
        margin: 0 2px;
    }
}

.calendar-wrapper {
    background-color: #fff;
    width: 300px;
    display: block;
    padding-bottom: 5px;

    &:before {
        content: '';
        height: 0;
        width: 0;
        display: block;
        position: absolute;
    }

    &:after {
        content: '';
        height: 0;
        width: 0;
        display: block;
        position: absolute;
    }

    &.picker-top {
        &:before {
            border-left: 15px solid #f7f7f7;
            border-right: 15px solid #f7f7f7;
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
            border-left: 15px solid #f7f7f7;
            border-right: 15px solid #f7f7f7;
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
}

.btn-change-month {
    background-color: #fff;
    -webkit-appearance: none;
    border: none;
    font-size: 16px;
    color: rgb(52, 52, 52);
}

.date-picker__calendar-container,
.calendar-container {
    margin: 5px 10px;

    .calendar-day {
        display: inline-flex;
        width: 14.2857%;
        justify-content: center;
        align-items: center;
        padding: 15px;
        cursor: pointer;
        border: 1px solid transparent;
        background-color: transparent;

        &:hover,
        &:focus {
            background-color: #f0f0f0;
            border-radius: 25px;
            border-color: #6e6e6e;
            box-shadow: none;
            outline: none;
        }

        &:hover .day,
        &:focus .day {
            box-shadow: none;
            outline: none;
        }

        .day {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            line-height: 16px;
            width: 10px;
            height: 10px;
            border: none;
            padding: 0;
            background-color: transparent;

            &.weekday {
                text-align: center;
            }
        }

        &.prev-month {
            color: #7f7f7f;
        }

        &.today {
            font-weight: bold;
        }

        &.start-day {
            // border-radius: 25px 0 0 25px;
            border-radius: 25px;
            background: rgba(0, 128, 0, 0.605);

            &:hover,
            &:focus {
                background-color: rgba(0, 175, 0, 0.308);
                box-shadow: none;
                outline: none;
            }
        }

        &.selected {
            background: #5bc2e7;
        }

        &.timespan {
            background: rgba(0, 128, 0, 0.605);

            &.endspan {
                border-radius: 0 25px 25px 0;
            }
        }
    }
}
</style>
