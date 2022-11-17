import React from 'react';
import classNames from 'classnames';
import {Icon} from "asset/js/icon";
import 'react-calendar/dist/Calendar.css';

import Aside from 'components/Aside';
import Modal from "components/Modal";
import Calenders from 'components/Calendars';

import { useParams } from "react-router-dom";

function withParams(Component) {
	return props => <Component {...props} params={useParams()} />;
}

class Schedule extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			modalOpen: false,
			trainerList: [
				{id:'10101', name: '김동수'},
				{id:'10102', name: '김문수'},
				{id:'10103', name: '라강민'},
				{id:'10104', name: '이선아'},
				{id:'10105', name: '조영은'},
			],
			memberList: [
				{id:'20101', name: '한예슬'},
				{id:'20102', name: '김태희'},
				{id:'20103', name: '한가인'},
				{id:'20104', name: '비'},
				{id:'20105', name: '전지현'},
			],
			originTaskList: [
				{'date': '2022. 11. 01 09:20', 'member': '한예슬'},
				{'date': '2022. 11. 01 12:20', 'member': '김태희'},
				{'date': '2022. 11. 16 17:20', 'member': '비'},
				{'date': '2022. 11. 25 06:20', 'member': '한가인'},
				{'date': '2022. 11. 27 20:20', 'member': '전지현'},
				{'date': '2022. 11. 28 06:20', 'member': '한가인'},
			],
			taskList: [
				{'date': '2022. 11. 01 09:20', 'member': '한예슬'},
				{'date': '2022. 11. 01 12:20', 'member': '김태희'},
				{'date': '2022. 11. 16 17:20', 'member': '비'},
				{'date': '2022. 11. 25 06:20', 'member': '한가인'},
				{'date': '2022. 11. 27 20:20', 'member': '전지현'},
				{'date': '2022. 11. 28 06:20', 'member': '한가인'},
			],
			addScheduleList: [],
			addSchedule: {
				name: null,
				date: null,
				startTime: null,
				endTime: null,
				description: null
			},
		};
	}

	openModal = () => {
		this.setState({
			modalOpen: true
		});
	};

	closeModal = () => {
		this.setState({
			modalOpen: false
		});


		this.setState({
			addScheduleList : []
		})
	};

	componentDidMount() {
		const { personalType } = this.props.params;
		console.log(personalType);
		this.setState({
			personalType: personalType,
		});
	}

	onSelectMember = (e) => {
		var name = e.target.innerText;
		var list = [];
		this.state.originTaskList.map((value, index) => {
			if(name === value.member )
				list.push(value);
		})
		this.setState({
			...this.state,
			taskList: list,
		})
	}

	onAddSchedule = (e) => {
		this.openModal();
	}

	onInputChange = (e) => {
		var target = e.target;

		this.setState({
			addSchedule : {
				...this.state.addSchedule,
				[target.name]: target.value
			}
		})
	}

	onSubmit = () => {
		this.setState({
			addScheduleList: [
				...this.state.addScheduleList,
				this.state.addSchedule,
			],
			addSchedule: {
				name: '',
				date: '',
				startTime: '',
				endTime: '',
				description: ''
			},
		})
	}

	render() {
		const { modalOpen, trainerList, memberList, taskList, addScheduleList, addSchedule} = this.state;
		const { personalType } = this.props.params;
		var personalList = personalType === 'member' ? memberList : trainerList;
		return (
			<div id={'wrap'} className={classNames('schedule_wrap')}>
				<Aside link={'/schedule'}/>
				<div className="container">
					<div className={'notify_area'}>
						<h2>스케줄 관리</h2>
					</div>

					<div className={'section'}>
						<div className={'tab_area'}>
							<div className={'tab'}>
								<strong className={'text'}>{personalType === 'member' ? '내 회원' : '트레이너'}</strong>
								<button className={'btn_menu'}><Icon.ic20BulletArrow/></button>
							</div>
							<div className={'list_area'}>
								<ul className={'person_list'}>
									{personalList.map((value, index) =>
										<li className={'item'}>
											<input type="radio" id={`${value.id}--${index}`} className={'input_check'} name={'trainer'}/>
											<label htmlFor={`${value.id}--${index}`} className={'input_label'} onClick={(e) => this.onSelectMember(e)}>
												<span className={'text'}>{value.name}</span>
											</label>
										</li>
									)}
								</ul>
							</div>
						</div>

						<div className={'calender_wrap'}>
							{personalType === 'member' && <button type={'button'} className={'btn_add'} onClick={(e) => this.onAddSchedule(e)}>일정 추가</button> }
							<Calenders taskList={taskList} />
						</div>
					</div>
				</div>

				<Modal open={modalOpen} close={this.closeModal} header="일정 추가하기" submit={`일정 ${addScheduleList.length}개 추가하기`}>
					<div className="schedule_add_area">
						<div className={'plus_area'}>
							<button type={'button'} className={'btn_plus'}><Icon.ic24Plus/></button>
							<ul className={'plus_list'}>
								{addScheduleList.map((value, index) =>
									<li className={'item'}>
										<div className={'text'}>{value.date}</div>
										<div className={'text'}>
											{value.startTime}~{value.endTime}
										</div>
										<div className={'text'}>{value.name}</div>
										<button> </button>
									</li>
								)}
							</ul>
						</div>
						<div className={'plus_input_area'}>
							<label htmlFor="plus_date">날짜</label> <input type="date" id={'plus_date'} onChange={(e) =>this.onInputChange(e)} className={'input'} name={'date'} value={addSchedule.date}/>
						</div>
						<div className={'plus_input_area'}>
							<label htmlFor="plus_time">시간</label>
							<input type="time" id={'plus_time'} className={'input'} onChange={(e) =>this.onInputChange(e)} name={'startTime'} value={addSchedule.startTime}/>
							<span className={'dash'}>-</span>
							<input type="time"  id={'plus_time'} className={'input'} onChange={(e) =>this.onInputChange(e)} name={'endTime'} value={addSchedule.endTime}/>
						</div>
						<div className={'plus_input_area'}>
							<label htmlFor="plus_member">회원</label> <input type="text" id={'plus_member'} className={'input'} onChange={(e) =>this.onInputChange(e)} name={'name'} value={addSchedule.name}/>
						</div>
						<div className={'plus_input_area'}>
							<label htmlFor="plus_description">설명</label> <textarea id={'plus_description'} className={'input'} rows={'4'} onChange={(e) =>this.onInputChange(e)} name={'description'} value={addSchedule.description}/>
						</div>
						<button className={'btn_add'} type={'button'} onClick={this.onSubmit}>등록하기</button>
					</div>
				</Modal>
			</div>
		);
	}
}

export default withParams(Schedule);