import React from 'react';
import { NavLink } from 'react-router-dom';

export default class Login extends React.Component {
    
    login = async (e) =>{
        e.preventDefault();
        console.log('login called');
        var body = {
            username : e.target.elements.username.value,
            password : e.target.elements.password.value
        }
        if(!e.target.elements.username.value || !e.target.elements.password.value){
            console.log('username or password can not be blank');
            alert('username or password can not be blank');
        }
        try{
            const api_call = await fetch(`http://localhost:5000/login`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                  "Content-type": "application/json; charset=UTF-8"
                }
                });
                const status = await api_call.status;
                const data = await api_call.json();
                if(status === 200) {
                    console.log(data);
                    localStorage.setItem('jwtToken', data.access_token);
                    localStorage.setItem('username', body.username);
                    console.log(localStorage);
                    alert('Login Successful');
                    window.location = '/';
                }
                else {
                    console.log('username password not valid');
                    alert('Username or Password not valid');
                    window.location = '/login';
                }
        }
        catch(err) {
            console.log('user not valid');
            console.log(err);
        }
    }
    render() {
        return (
            <div className="main" style= {{margin : 5}}> 
            <div className="header">
                <div className="navbar">
                    <NavLink to="/"><strong style={{ fontSize: 20, padding:5 }}>Home</strong></NavLink>
                </div>
            </div>
                <div className="body">
                    <form onSubmit={this.login} style={{ fontSize: 20, padding:5 }}>
                        <input type="text" name="username" placeholder="username"></input><br></br>
                        <input type="text" name="password" placeholder="password"></input><br></br>
                        <button>Login</button>
                    </form> 
                </div>
            </div>
        )
    }
}
