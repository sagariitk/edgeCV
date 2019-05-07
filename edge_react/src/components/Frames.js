import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';


class Frames extends Component {
    logout = async (e) =>{
        e.preventDefault();
        localStorage.removeItem("jwtToken");
        alert('you have been logged out');
        window.location = '/';
    }

    start = async (e) =>{
        e.preventDefault();
        const body = {
            total_duration : e.target.elements.total_duration.value,
            split_time : e.target.elements.split_time.value,
            color : e.target.elements.color.value
        }
        if(!e.target.elements.total_duration.value){
            console.log('total_durationcan not be blank');
            alert('total_duration can not be blank');
            window.location = '/Frames';
        }
        else if(!e.target.elements.split_time.value) {
            console.log('split_timecan not be blank');
            alert('split_time can not be blank');
            window.location = '/Frames';
        }

        else {
            try{
                const api_call = await fetch(`http://localhost:5000/start`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.jwtToken
                }
                });
                const status = await api_call.status;
                console.log(status);
                if(status === 200) {
                    alert('Pictures Captured');
                    window.location = '/';
                }
                else if(status === 403 || status === 401) {
                    console.log('not authenticated please login');
                    alert('not authenticated please login');
                    window.location = '/Login';    
                }
                else {
                    console.log('Error from server');
                    alert('Error from server');
                    window.location = '/';
                }
            }
            catch(err){
                console.log('Error from server');
                alert('Error from server');
                window.location = '/';
            }
        }
    }
  
    render() {
    return(
        <div className="container">
            <div className="header-logo">
            </div>
            <div className="header">
                <div className="navbar">
                    <NavLink to="/"><strong style={{ fontSize: 20, padding:5 }}>Home</strong></NavLink>
                    <NavLink to="/Frames"><strong style={{ fontSize: 20, padding:5 }}>Capture Frames</strong></NavLink>
                    <NavLink to="/Login"><strong style={{ fontSize: 20, padding:5 }}>Login</strong></NavLink>
                    <NavLink to="/Register"><strong style={{ fontSize: 20, padding:5 }}>Register</strong></NavLink>
                    <NavLink to="/" onClick= {this.logout} ><strong style={{ fontSize: 20, padding:5 }}>Logout</strong></NavLink>
                </div>
            </div>
            <div className="main-landing">
                <form onSubmit={this.start} style={{ fontSize: 20, padding:5 }}>
                    <input type="text" name="total_duration" placeholder="Total Duration"></input><br></br>
                    <input type="text" name="split_time" placeholder="Split Time"></input><br></br>
                    <select name="color">
                        <option value="Color">Colored</option>
                        <option value="gray">GreyScale</option>
                    </select><br></br>
                    <button>Start Capturing</button>
                </form>
            </div>
            <div className="footer">
            </div>
        </div>
    )
  }
}

export default Frames;