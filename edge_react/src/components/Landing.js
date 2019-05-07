import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';


class Landing extends Component {
    state = {
        urls: []
    }
    logout = async (e) => {
        e.preventDefault();
        localStorage.removeItem("jwtToken");
        alert('you have been logged out');
        window.location = '/';
    }

    getURLs = async (e) => {
        e.preventDefault();
        try {
            const api_call = await fetch(`http://localhost:5000/images`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.jwtToken
                }
            });
            const status = await api_call.status;
            console.log(status);
            if (status === 200) {
                const data = await api_call.json();
                this.setState({
                    urls: data
                });
                console.log(data);
            }
            else if(status === 403 || status === 422 || status === 401) {
                console.log('not authenticated please login');
                alert('not authenticated please login');
                window.location = '/Login';    
            }
            else {
                console.log('could not addd the pic to database');
                alert('could not addd the pic to database');
            }
        }
        catch (err) {
            console.log(err);
            alert('data server is not responding');
        }

    }

    render() {
        return (
            <div className="container">
                <div className="header-logo">
                </div>
                <div className="header">
                    <div className="navbar">
                        <NavLink to="/"><strong style={{ fontSize: 20, padding: 5 }}>Home</strong></NavLink>
                        <NavLink to="/Frames"><strong style={{ fontSize: 20, padding: 5 }}>Capture Frames</strong></NavLink>
                        <NavLink to="/Login"><strong style={{ fontSize: 20, padding: 5 }}>Login</strong></NavLink>
                        <NavLink to="/" onClick={this.logout} ><strong style={{ fontSize: 20, padding: 5 }}>Logout</strong></NavLink>
                    </div>
                </div>
                <div className="main-landing">
                    <br></br>
                    <form onSubmit={this.getURLs}>
                        <button>Get Images</button>
                    </form><br></br>
                    {this.state.urls && this.state.urls.map((image) => {
                        return (
                            <div className="body-item">
                                <div key={image}>
                                    <img src={image} alt="" style={{ width: 300}}></img>
                                </div><br></br>
                            </div>
                        );
                    })}
                </div>
                <div className="footer">
                </div>
            </div>
        )
    }
}

export default Landing;