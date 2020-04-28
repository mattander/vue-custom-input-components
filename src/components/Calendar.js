import dayjs from 'dayjs';

export default {
	name: 'Calendar',
	props: {
		start: Number,
		end: Number,
		month: [Number, String],
		year: [Number, String],
		today: [Object],
		startDate: [Object, String, Boolean],
		hovered: [String]
	},
	render(h) {
		let els = [];
		let hoverDay = this.hovered;

		const todayDate = new Date(this.today.year, this.today.month, this.today.day);
		const monthDayOne = new Date(this.year, this.month, 1);

		['Sun', 'Mon', "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(weekday => {
			let day = h('div', { class: 'day weekday' }, weekday);

			els.push(h('div', { class: 'calendar-day' }, [day]));
		});

		for (let i = 0 - this.start; i < this.end; i++) {
			let classes = ['day'];
			let wrapperClasses = ['calendar-day'];

			if (i < 0) {
				classes.push('days-prev-month')
			}

			// if day is today, add today class for stylign
			if (i + 1 == this.today.day && this.today.month == this.month && this.today.year == this.year) {
				classes.push('today')
			}

			// if date is in the past, grey it out and disable it
			if (dayjs(monthDayOne).add(i, 'days').isBefore(dayjs(todayDate)) || dayjs(monthDayOne).add(i, 'days').isSame(dayjs(todayDate))) {
				classes.push('past', 'disabled');
				wrapperClasses.push('past', 'disabled');
			}

			// highlight span of days if it's between start date and hovered date
			if (this.startDate && dayjs() && dayjs([this.year, this.month + 1, i + 1]).isAfter(dayjs(this.startDate)) && i < hoverDay) {
				wrapperClasses.push('timespan');
				if (i + 1 == hoverDay) wrapperClasses.push('endspan');
			}

			if (dayjs(this.startDate).isSame(dayjs([this.year, this.month + 1, i + 1]), 'date')) {
				wrapperClasses.push('start-day');

				if (i + 1 >= hoverDay || !hoverDay) wrapperClasses.push('endspan');
			}

			const day = h('div', {
				class: classes
			}, dayjs(monthDayOne).add(i, 'days').format('D'));

			els.push(h('div', {
				class: wrapperClasses,
				on: {
					click: () => {
						const selectedDay = dayjs(monthDayOne).add(i, 'days');
						if (selectedDay.isAfter(dayjs(todayDate))) {
							this.$emit('date-change', selectedDay);
						}
					},
					mouseenter: e => {
						this.$emit('dayHover', e.target.textContent);
					}
				}
			}, [day]));
		}

		return h('div', {
			class: ['date-picker__calendar-container']
		}, els);
	}
}