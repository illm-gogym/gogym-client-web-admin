import React from 'react';
import classNames from 'classnames';
import {Icon} from "asset/js/icon";
import axios from "axios";
// axios.defaults.withCredentials = true;

class Join extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalOpen: false,
			userInfo: {
				gym_id: 1800,
				name: "헬로89",
				password: "8989",
				phone: "0108989",
				role: "ROLE_ADMIN",
				trainer_id: "helloGym898"
			}
		}
	}

	setUserInfoApi = async () => {
		try{
			let userInfo = JSON.parse(JSON.stringify(this.state.userInfo));
			const requestOption ={
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache',
					'Accept': 'application/json'
				},
				// withCredentials: true
			};

			await axios.post("http://3.35.226.16:8080/api/auth/trainer/signup" ,
				JSON.stringify(userInfo), requestOption )

				.then(res =>{
					const resData = JSON.parse(JSON.stringify(res.data));
					const { accessToken } = res.data;
					// console.log(res.data.ACCE);
					localStorage.setItem('access-token', accessToken);
					localStorage.setItem('login-token', res.data.access_token);
					// API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
					axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
				})
				.catch(ex=>{
					console.log("login requset fail : " + ex);
				})
				.finally(()=>{console.log("login request end")});
		}catch(e){
			console.log(e);
		}
	}

	render() {
		return (
			<div id={'wrap'} className={classNames('join_wrap')}>
				<h1 className={'title'}>
					<span className="blind">GoGym</span>
					{ <Icon.logoGo/>}
					{ <Icon.logoGym/>}
					{ <Icon.logoAdmin className={'logo_admin'}/>}
				</h1>
				<p className={'description'}>PT 회원 예약 서비스 (관리자용)</p>
				
				<div className={'form'}>
					<label htmlFor="form_email">이메일</label>
					<input id={'form_email'} type="text" placeholder={'이메일 주소를 입력해 주세요'}/>
				</div>

				<div className={'form'}>
					<label htmlFor="form_pwd">비밀번호</label>
					<input id={'form_pwd'} type="text" placeholder={'비밀번호를 입력해 주세요'}/>
				</div>

				<button type={'submit'} className={'btn_login'} onClick={this.setUserInfoApi}>로그인</button>
			</div>
		);
	}
}

export default Join;

