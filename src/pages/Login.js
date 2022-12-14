import React from 'react';
import classNames from 'classnames';
import {Icon} from "asset/js/icon";
import axios from "axios";
import { useParams, Navigate } from 'react-router-dom';
import {getAuthToken, getAuthTrainerId, getLoginType} from 'Util/Authentication';

function withParams(Component) {
	return props => <Component {...props} params={useParams()} />;
}

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			modalOpen: false,
			loginInfo: {
				password: '',
				trainer_id: ''
			},
			userLoginInfo: {
				password: '',
				user_phone: ''
			}
		}
	}

	sendLogin = () => {
		this.state.personalType === 'user' ? this.userLoginApi() : this.loginApi();
	}

	userLoginApi = async () =>  {
		try{
			console.log('사용 로그인');
			let userLoginInfo = {
				password: this.state.loginInfo.password,
				user_phone: this.state.loginInfo.trainer_id,
			}
			const requestOption ={
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache',
					'Accept': 'application/json'
				}
			};

			await axios.post("http://13.125.53.84:8080/api/authenticate/login/user" ,
				JSON.stringify(userLoginInfo), requestOption )

				.then(res =>{
					const accessToken = JSON.parse(JSON.stringify(res.data));
					console.log(res.data);
					// API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
					// axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
					// localStorage.setItem('login-id', loginInfo.trainer_id);
					const myObject = {
						token : accessToken.token,
						user_id : accessToken.user.user_phone,
						user_name : accessToken.user.name,
					};
					localStorage.setItem('access-info', JSON.stringify(myObject));
					// console.log(localStorage.getItem('access-info'));
					window.location.reload('/login');
				})
				.catch(ex=>{
					console.log("login requset fail : " + ex);
					alert('로그인 정보를 확인해주세요.')
				})
				.finally(()=>{console.log("login request end")});
		}catch(e){
			console.log(e);
		}
	}


	loginApi = async () => {
		console.log('관리자 로그인');
		try{
			let loginInfo = JSON.parse(JSON.stringify(this.state.loginInfo));
			const requestOption ={
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache',
					'Accept': 'application/json'
				}
			};

			await axios.post("http://13.125.53.84:8080/api/authenticate/login/trainer" ,
				JSON.stringify(loginInfo), requestOption )

				.then(res =>{
					const accessToken = JSON.parse(JSON.stringify(res.data));
					console.log(res.data);
					const myObject = {
						token : accessToken.token,
						trainer_id : loginInfo.trainer_id
					};
					localStorage.setItem('access-info', JSON.stringify(myObject));
					// console.log(localStorage.getItem('access-info'));
					// API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
					// axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
					// localStorage.setItem('login-id', loginInfo.trainer_id);
					window.location.reload('/login');
					// alert('로그인 되었습니다.');
				})
				.catch(ex=>{
					console.log("login requset fail : " + ex);
					alert('로그인 정보를 확인해주세요.')
				})
				.finally(()=>{console.log("login request end")});
		}catch(e){
			console.log(e);
		}
	}

	onInputChange = (e) => {
		var target = e.target;

		this.setState({
			loginInfo: {
				...this.state.loginInfo,
				[target.name]: target.value,
			},
		});
	}

	componentDidMount() {
		const { personalType } = this.props.params;
		this.setState({
			personalType: personalType,
		});
	}

	render() {
		const { loginInfo, personalType } = this.state;
		if(getAuthToken()) {
			if(getAuthTrainerId()) {
				return <Navigate replace to="/" />;
			} else {
				return <Navigate replace to="/user" />;
			}
		}
		return (
			<div id={'wrap'} className={classNames('join_wrap')}>
				<h1 className={'title'}>
					<span className="blind">GoGym</span>
					{ <Icon.logoGo/>}
					{ <Icon.logoGym/>}
					{ personalType === 'user' ? null : <Icon.logoAdmin className={'logo_admin'}/>}
				</h1>
				<p className={'description'}>
					PT 회원 예약 서비스 {personalType === 'user' ? '' : '(관리자용)'}
				</p>
				
				<div className={'form'}>
					<label htmlFor="form_email">아이디</label>
					<input id={'form_email'} type="text" placeholder={'아이디를 입력해 주세요'} name={'trainer_id'} value={loginInfo.trainer_id || ''} onChange={(e) =>this.onInputChange(e)}/>
				</div>

				<div className={'form'}>
					<label htmlFor="form_pwd">비밀번호</label>
					<input id={'form_pwd'} type="password" placeholder={'비밀번호를 입력해 주세요'} name={'password'} value={loginInfo.password || ''} onChange={(e) =>this.onInputChange(e)} />
				</div>

				<button type={'submit'} className={'btn_login'} onClick={this.sendLogin}>로그인</button>
			</div>
		);
	}
}

export default withParams(Login);
