import React, { useEffect, useState } from 'react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import './Login.css';
import { DbLogger } from './DbLogger';

function Login() {
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    
    const handleLogin = async (event) => {
        event.preventDefault();
        const apiUrl = process.env.REACT_APP_URL_CREDITLOAN_LOGIN;
        
        try {
            setLoginMessage('Login...');
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, password: userPassword })
            });

            if (response.ok) {                
                const data = await response.json();
                sessionStorage.setItem('token', data['data'].token);
                sessionStorage.setItem('userName', data['data'].name);
                sessionStorage.setItem('userId', data['data'].userId);
                setLoginMessage('Login success! Redirecting...');
                setTimeout(() => { navigate('/') }, 2000);
                /** start log **/
                //DbLogger('user_login', 'LOGIN', 'User email: '+userEmail+' succesfully login', '-', response.status);

            } else {                
                const data = await response.json();                
                setLoginMessage(data.message);
                //DbLogger('user_login_failed', 'LOGIN', 'User email: ' + userEmail + ' login failed!', data['message'], data['status_code']);
                setToken('');
            }
        } catch (e) {
            console.log(e.message);
            setLoginMessage('An error occurred while logging in.');
            setToken('');
        }
    };

    const handleSignup = (event) => {
        navigate('/customer');
    };

    const handleUserEmailChange = (event) => {
        setUserEmail(event.target.value);
    };

    const handleUserPasswordChange = (event) => {
        setUserPassword(event.target.value);
    };

    return (
        <div>
            <div className="div-center">
                <div className="content">
                    <h3>Login</h3>
                    <hr />
                    <form>
                        <div className="form-group">
                            <label htmlFor="txtInputEmail">Email</label>
                            <input type="email" required className="form-control" id="txtInputEmail" placeholder="Email"
                                value={userEmail} onChange={handleUserEmailChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="txtInputPassword">Password</label>
                            <input type="password" required className="form-control" id="txtInputPassword" placeholder="Password" value={userPassword} onChange={handleUserPasswordChange} />
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-9">
                                <button type="submit" className="btn btn-primary" onClick={handleLogin}><i className="fa fa-sign-in"></i>&nbsp;Login</button>
                            </div>
                            <div className="col-3 text-right">
                                <button type="button" className="btn btn-link" title="Create new user" onClick={handleSignup}>Register</button>
                            </div>
                        </div>                        
                        <hr />
                        {/*<button type="button" className="btn btn-link">Reset Password</button>*/}
                    </form>
                    {loginMessage && (
                        <div className="alert alert-info mt-3 text-center" role="alert">
                            {loginMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;