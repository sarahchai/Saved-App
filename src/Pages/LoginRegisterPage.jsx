import React, { Component } from 'react';
import { redirect } from 'react-router-dom';


export default class LoginRegisterPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: '',
            email: '',
            registerForm: false,
            registeredOrLoggedIn: false,
            errorMessage: '',
            registeredOrloggedIn: false
        }
    }

    showRegisterForm = () => {
        this.setState({
            registerForm: true
        })
    };

    showLogInForm = () => {
        this.setState({
            registerForm: false,
        })
    }

    register = async () => {
        const body = JSON.stringify({
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
        });

        const registerUserResponse = await fetch('/api/register', {
            method: "POST",
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        const registerUserBody = await registerUserResponse.json();

        if (registerUserResponse.status === 409 || registerUserResponse.status === 400) {
            this.setState({
                errorMessage: registerUserBody.message
            })
        } else {

            localStorage.setItem('user-jwt', registerUserBody);

            this.setState({
                registeredOrLoggedIn: true
                
            })

            this.props.toLoggedIn();
        }
    };

    logIn = async () => {
        const body = JSON.stringify({
            username: this.state.username,
            password: this.state.password,
        });

        const logInUserResponse = await fetch('/api/login', {
            method: 'POST',
            body: body,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const logInUserBody = await logInUserResponse.json();

        if (logInUserResponse.status === 409 || logInUserResponse.status === 401 || logInUserResponse.status === 400) {
            this.setState({
                errorMessage: logInUserBody.message
            })
        } else {
            localStorage.setItem('user-jwt', logInUserBody);

            this.setState({
                registeredOrLoggedIn: true
            })

            this.props.toLoggedIn();
        }
    }

    
    onSubmit = (e) => {
        e.preventDefault();
    }

    onChange = evt => {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    render() {
        if (this.state.registeredOrLoggedIn) {
            return redirect("/search");
        }
        return (
            <div className="register-or-login-contatiner">
                <h3>Saved</h3>
                <h6>Login or register to use the app!</h6>
                {!this.state.registerForm && (
                    <div className="register-or-login login-container" >
                        <button className="register-or-login-button" onClick={this.showRegisterForm}>Register!</button>
                        <form className="login-form" onSubmit={this.onSubmit} >
                            <div className="register-or-login-form">
                                <div className="flex-element">
                                    <label className="register-or-login-label username-login">Username:</label>&nbsp;
                                    <input className="register-or-login-input username-login" type="text" name="username" value={this.state.username} onChange={this.onChange} />
                                </div>
                                <div className="flex-element">
                                    <label className="register-or-login-label password">Password:</label>&nbsp;
                                    <input className="register-or-login-input password" type="password" name="password" value={this.state.password} onChange={this.onChange} />
                                </div>
                            </div>
                            <button className="enter-button" onClick={this.logIn}>Login</button>
                        </form>
                    </div>
                )}
                {this.state.registerForm && (
                    <div className="register-or-login register-container">
                        <button className="register-or-login-button" onClick={this.showLogInForm}>Login!</button>
                        <form className="register-or-login-form register-form" onSubmit={this.onSubmit} >
                            <div className="register-or-login-form">
                                <div className="flex-element">
                                    <label className="register-or-login-label username-login">Username: </label>
                                    <input className="register-or-login-input username-login" type="text" name="username" value={this.state.username} onChange={this.onChange} />
                                </div>
                                <div className="flex-element">
                                    <label className="register-or-login-label password">Password: </label>
                                    <input className="register-or-login-input password" type="password" name="password" value={this.state.password} onChange={this.onChange} />
                                </div>
                                <div className="flex-element">
                                    <label className="register-or-login-label email">Email: </label>
                                    <input className="register-or-login-input email" type="text" name="email" value={this.state.email} onChange={this.onChange} />
                                </div>
                            </div>
                            <button className="enter-button" onClick={this.register}>Register</button>
                        </form>
                    </div>
                )}
            </div>
        )
    }
}