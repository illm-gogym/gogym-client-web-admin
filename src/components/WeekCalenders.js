import React from "react";

import {Icon} from "asset/js/icon";
import classNames from 'classnames';
import {nanoid} from "nanoid";

class WeekCalenders extends React.Component {
	constructor(props) {
		super(props);

		this.props = {
			...props,
		}

		this.state = {
			date: null,
			week: null,
			weekList: []
		}

	}

	makeCalender = () => {
		let now = new Date();
		let date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		let day = date.getDay();
		let week = [];
		for (let i = 0; i < 7; i++) {
			let newDate = new Date(date.valueOf() + 86400000 * (i - day));
			week.push([i, newDate]);
		}

		this.setState({
			date, week
		});
	}

	makeWeekArr = date => {
		let day = date.getDay();
		let week = [];
		for (let i = 0; i < 7; i++) {
			let newDate = new Date(date.valueOf() + 86400000 * (i - day));
			week.push([i, newDate]);
		}
		return week;
	};

	onPressArrowLeft = () => {
		let newDate = new Date(this.state.date.valueOf() - 86400000 * 7);
		let newWeek = this.makeWeekArr(newDate);
		this.setState({
			date: newDate,
			week: newWeek
		})
	};

	onPressArrowRight = () => {
		let newDate = new Date(this.state.date.valueOf() + 86400000 * 7);
		let newWeek = this.makeWeekArr(newDate);
		this.setState({
			date: newDate,
			week: newWeek
		})
	};

	onClickDay = (e) => {
		alert(e.target.value);
	}

	makeNewDate = (now) => {
		return new Date(now.getFullYear(), now.getMonth(), now.getDate())
	}

	timeOneBase = (date) => {
		let tempList = [];
		for(let i=0; i<24; i++) {
			tempList.push({date: new Date(date.setHours(date.getHours() + 1)), info: null});
		}
		const timeButton = tempList.map((value, index) =>
			<div className={'base_day'}></div>
		)
		return <div className={'base_area'} key={nanoid()}>{timeButton}</div>
	}

	timeOneDay = (date) => {
		const taskList = this.props.taskList;
		let newTaskList = [];
		taskList.map((value, index) => {
			let newDate = this.makeNewDate(new Date(value.date)),
				valueDate = this.makeNewDate(date);
			if(newDate.getTime() === valueDate.getTime()) {
				const timeDate = new Date(value.date);
				newTaskList.push({date: newDate, hour: timeDate.getHours(), time: timeDate.getMinutes(), name: value.name});
			}
		});

		const timeButton = newTaskList.map((value, index) =>
			<button type={'button'} className={classNames('btn_task', `time_${value.hour}`, {'half': value.time >= 30})}
					onClick={(e) => this.onClickDay(e)}
					value={`${value.date.toLocaleDateString()} ${value.hour} ${value.time}`}>
				{value.name} <br/>
				({value.hour}:{value.time})
			</button>
		)

		return <div className={'task_area'} key={nanoid()}>{timeButton}</div>
	}

	timeLeftDay = () => {
		let tempList = [];
		for(let i=1; i<=24; i++) {
			tempList.push({time: i});
		}
		const timeButton = tempList.map((value, index) =>
			<span className={'time'}>
				{value.time/12 < 1 || value.time/12 >= 2  ? '오전' : '오후'} {value.time%12 === 0 ? '12' : value.time%12}시
			</span>
		)
		return <div className={'time_area'} key={nanoid()}>{timeButton}</div>
	}

	componentDidMount = () => {
		this.makeCalender();
	};

	componentDidUpdate(prevProps, prevState) {
		if (this.state.week === prevState.week) {
			this.makeCalender();
		}
	}

	render() {
		const {week} = this.state;
		const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];
		return (
			<div className={'WeekCalender_wrap'}>
				<div className={'week_header'}>
					<button className={'btn_prev'} onClick={this.onPressArrowLeft}><Icon.ic20BulletArrow/></button>
					<em className={'period'}>{week !== null && `${(week[0][1]).toLocaleDateString('ko-kr')} - ${(week[6][1]).toLocaleDateString('ko-kr')}`}</em>
					<button className={'btn_next'} onClick={this.onPressArrowRight}><Icon.ic20BulletArrow/></button>
				</div>
				<div className={'week_content'}>
					{this.timeLeftDay()}
					{week !== null && week.map((value, index) => {
						return (
							<div className={'day'} key={nanoid()}>
								<div className={'main'}>
									<span className={'text'}>{WEEKDAY[(value[1]).getDay()]}</span>
									<em className={'num'}>{(value[1]).getDate()}</em>
								</div>
								{this.timeOneDay(value[1])}
								{this.timeOneBase(value[1])}
							</div>
						)
					})}
				</div>
			</div>
		)
	}
}

export default WeekCalenders;