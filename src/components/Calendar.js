import dayjs from 'dayjs';

export default {
	name: 'Calendar',
	props: {
		start: Number,
		end: Number,
		month: [Number, String],
		year: [Number, String],
		today: [Object]
	},
	render(h) {
		let els = [];
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

			if (i + 1 == this.today.day && this.today.month == this.month && this.today.year == this.year) {
				classes.push('today')
			}
			if (dayjs(monthDayOne).add(i, 'days').isBefore(dayjs(todayDate)) || dayjs(monthDayOne).add(i, 'days').isSame(dayjs(todayDate))) {
				classes.push('past', 'disabled');
				wrapperClasses.push('past', 'disabled');
			}

			const day = h('div', {
				class: classes,
			}, dayjs(monthDayOne).add(i, 'days').format('D'));
			els.push(h('div', {
				class: wrapperClasses,
				on: {
					click: () => {
						const selectedDay = dayjs(monthDayOne).add(i, 'days');
						if (selectedDay.isAfter(dayjs(todayDate))) {
							this.$emit('date-change', selectedDay);
						}
					}
				}
			}, [day]));
		}

		return h('div', { class: ['date-picker__calendar-container'] }, els);
	}
}