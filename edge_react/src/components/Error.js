import React from 'react';
import { NavLink } from 'react-router-dom';


export default class Error extends React.Component {
    render() {
        return(
            <div className="container">
                <div className="header">
                    <div className="navbar">
                        <NavLink to="/"><strong style={{ fontSize: 20, padding:5 }}>Home</strong></NavLink>
                        <NavLink to="/Login"><strong style={{ fontSize: 20, padding:5 }}>Login</strong></NavLink>
                    </div>
                </div>
                <div className="main">
                </div>
                <div className="footer">
                </div>
            </div>
        )
    }
}