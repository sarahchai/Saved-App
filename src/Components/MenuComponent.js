import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Link, Redirect, Switch } from 'react-router-dom';

class MenuComponent extends Component {
    constructor(props) {
        super(props)
    
        this.state = {

        }
    }

    // toLogout = () => {
    //     this.props.logout();
    // }

    render() {
        return(
            <div className="menu">
                <ul className="corner">
                    <li className="corner-li"><p>Logged In </p></li>
                    <li className="corner-li"><input type="button" onClick={this.props.logout} value="Logout" /></li>
                </ul>
                <h1>Saved</h1>
                <p className="msg-icon"><Link to={'/message'}>📬</Link></p>
                <ul className="menu-bar">
                    <li className="nav"><Link to={'/feed'}>Feed</Link></li>
                    <li className="nav"><Link to={'/search'}>Search</Link></li>
                    <li className="nav"><Link to={'/saves'}>Saves</Link></li>  
                </ul>
            </div>
        )
    }
}

export default MenuComponent;