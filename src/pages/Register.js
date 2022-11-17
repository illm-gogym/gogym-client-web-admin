import React from 'react';
import classNames from 'classnames';

import Aside from 'components/Aside';
import Modal from "components/Modal";

import axios from 'axios';

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			modalOpen: false,
			userInfo: {
				birth: '',
				gender: 'Man',
				gym_id: 1001,
				name: '',
				password: 'test1234',
				phone: '',
				role: 'ROLE_USER',
				remaining: 0,
				total: '',
				trainerId: 'bellgym',
				until: "2022-12-31"
			},
			submitDisabled: true,
		}
	}

	componentDidMount() {
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
	};

	onInputChange = (e) => {
		var target = e.target;

		this.setState({
			...this.state,
			userInfo: {
				...this.state.userInfo,
				[target.name]: target.value
			}
		});
	}

	onSubmit = () => {
		this.setUserinfoApi();
	}

	getUserinfoApi = async () => {
		try{
			const requestOption ={
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache',
					'Accept': 'application/json'
				}
			};
			await axios.post("http://146.56.45.3:8080/api/auth/user/all" , requestOption )
				.then(res =>{
					const resData = JSON.parse(JSON.stringify(res.data));
					console.log(resData);
					this.openModal();
				})
				.catch(ex=>{
					console.log("login requset fail : " + ex);
				})
				.finally(()=>{console.log("login request end")});
		}catch(e){
			console.log(e);
		}
	}

	setUserinfoApi = async () => {
		try{
			console.log(this.state.userInfo);
			let userInfo = JSON.parse(JSON.stringify(this.state.userInfo));
			const requestOption ={
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache',
					'Accept': 'application/json'
				}
			};

			await axios.post("http://146.56.45.3:8080/api/auth/user/signup" ,
				JSON.stringify(userInfo), requestOption )
				.then(res =>{
					const resData = JSON.parse(JSON.stringify(res.data));
					console.log(resData);
					console.log("res.data.accessToken : " + resData.data);
					this.openModal();
				})
				.catch(ex=>{
					console.log("login requset fail : " + ex);
					alert('입력 값을 확인해주세요.');
				})
				.finally(()=>{console.log("login request end")});
		}catch(e){
			console.log(e);
		}
	}

	validate = () => {
		var objArr = Object.values(this.state.userInfo);
		if(objArr.indexOf('') === -1) {
			this.setState({
				...this.state,
				submitDisabled: false,
			});
		}
	}

	render() {
		const {modalOpen, userInfo, submitDisabled} = this.state;

		return (
			<div id={'wrap'} className={classNames('register_wrap')}>
				<Aside link={'register'}/>
				<div className="container">
					<div className={'notify_area'}>
						<h2 onClick={this.getUserinfoApi}>회원 등록</h2>
					</div>

					<form className="form_area" autoComplete={'on'}>
						<div className={'form_box'}>
							<input type="text" className={'form_input'} placeholder={'이름을 입력해 주세요'} required={true} onChange={(e) =>this.onInputChange(e)} onKeyUp={this.validate}  name={'name'}/>
							<label className={'form_label'}>이름</label>
						</div>
						<div className={'form_box'}>
							<input type="text" className={'form_input'} placeholder={'생년월일을 입력해 주세요'} required={true} onChange={(e) =>this.onInputChange(e)} onKeyUp={this.validate} name={'birth'}/>
							<label className={'form_label'}>생년월일</label>
							<p className={'form_detail'}>예) 1992.02.28</p>
						</div>
						<div className={'form_box'}>
							<input type="text" className={'form_input'} placeholder={'01012345678'} required={true} onChange={(e) =>this.onInputChange(e)} onKeyUp={this.validate} name={'phone'}/>
							<label className={'form_label'}>전화번호</label>
							<p className={'form_detail'}>‘-’ 없이 입력해 주세요 </p>
						</div>
						<div className={'form_box'}>
							<input type="text" className={'form_input'} placeholder={'주소를 입력해 주세요'} required={true} name={'address'}/>
							<label className={'form_label'}>주소</label>
						</div>
						<div className={'form_box'}>
							<input type="text" className={'form_input'} placeholder={'0'} required={true} onChange={(e) =>this.onInputChange(e)} onKeyUp={this.validate}  name={'total'}/>
							<label className={'form_label'}>수강권 (횟수)</label>
							<p className={'form_detail'}>안내문구 작성하기</p>
						</div>
					</form>

					<div className={'register_area'}>
						<button type={'submit'} className={'btn_register'} disabled={submitDisabled} onClick={this.onSubmit} >등록 완료</button>
					</div>
				</div>

				<Modal open={modalOpen} close={this.closeModal} header=" ">
					<div className={'title'}><strong>{userInfo.name}</strong> 님의 ID와 PW가 생성되었습니다.</div>
					<p className={'description'}>
						회원전용 앱을 설치한 후 아래 아이디와 비밀번호를 입력할 수 있습니다. <br/>
						아이디는 휴대폰 번호이며 비밀번호는 휴대폰 번호 뒷 4자리 입니다.
					</p>
					<ul className={'user_information'}>
						<li className={'row'}>
							<span className={'cell'}>ID</span>
							<span className={'cell'}>{userInfo.phone}</span>
						</li>
						<li className={'row'}>
							<span className={'cell'}>PW</span>
							<span className={'cell'}>{userInfo.phone.substr(userInfo.phone.length -4, userInfo.phone.length)}</span>
						</li>
					</ul>
				</Modal>
			</div>
		);
	}
}

export default Home;
