import React, { useState } from 'react';
import axios from "axios";
import signins from './signIn.module.scss'
import { useHistory } from "react-router-dom";
import { useSpring, animated } from 'react-spring'


function SignIn() {
    const history = useHistory(); //페이지가 이동 되어서 useState 값을 저장하기 위해서 사용
    const [on, set] = useState(true);
    const prop = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });
    const prop2 = useSpring({ to: { opacity: 1, marginBottom: 0 }, from: { opacity: 0, marginBottom: -300 } });
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false)

    //변환이 일어날 때 useState 값 변환
    const menuToggleHandler = () => {
        set((p) => !p);
        history.push("#")
    };

    const onChangeUsername = (e) => {
        setUsername(e.target.value)
        console.log(e.target.value)
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value)
    };

    const onChangeEmail = (e) => {
        setEmail(e.target.value)
    };

    const onSubmit1 = async (e) => {
        e.preventDefault();
        setError(false)
        try {
            const res = await axios.post("http://localhost:3000/api/auth/register", {
                username,
                email,
                password,
            })
            res.data && window.location.replace("/login")
        } catch (err) {
            setError(true)
        }
        // const user = {
        //     headers,
        //     username: username,
        //     password: password,
        //     email: email

        // }


        // console.log(user);

        // axios.post('http://localhost:5000/users/add', user)
        //     .then(res => {
        //         console.log(res.data)
        //         alert("회원가입이 완료되었습니다.");
        //         window.location.href = "/";
        //     })

    }
    const onSumbit2 = (e) => {
        e.preventDefault();

        // const user = {
        //     headers,
        //     username: username,
        //     password: password,

        // }
        // console.log(user);

        // axios.post('http://localhost:5000/users/signin', user)
        //     .then(res => {
        //         // console.log(res.data.message)
        //         // console.log(res.data.username)
        //         if (res.data.message) {
        //             $.cookie("login_cookie", res.data.username);
        //             console.log($.cookie("login_cookie"))
        //             window.location.href = "/";
        //         }
        //         else {
        //             alert("아이디와 패스워드를 확인해주세요.");
        //         }
        //     }
        //     );
    }
    return (

        <div className={signins.loginPage}>
            <div className={signins.loginPage__form} >
                {/* 회원가입 창 */}
                <animated.form style={prop} onSubmit={onSubmit1} className={on ? signins.loginPage__form__registerForm : ''}>
                    <input type="text" onChange={onChangeUsername} placeholder="name" />
                    <input type="password" onChange={onChangePassword} placeholder="password" />
                    <input type="text" onChange={onChangeEmail} placeholder="email address" />
                    <button type="submit" >Create User</button>
                    <p className={signins.message}>Already registered? <a href="#" onClick={menuToggleHandler} >Sign In</a></p>
                </animated.form>
                {/* 로그인 창 */}
                <animated.form style={prop2} onSubmit={onSumbit2} className={on ? '' : signins.loginPage__form__registerForm}>

                    <input type="text" onChange={onChangeUsername} placeholder="username" />
                    <input type="password" onChange={onChangePassword} placeholder="password" />
                    <button type="submit" >login</button>
                    <p className={signins.message}>Not registered? <a href="#" onClick={menuToggleHandler}>회원 가입</a></p>

                </animated.form>



            </div>
        </div>

    )
};

export default SignIn;