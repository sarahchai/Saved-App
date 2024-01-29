import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Link, Redirect, Switch } from 'react-router-dom';
import SearchPage from "./SearchPage";

export default class MainPage extends Component {
    constructor(props) {
        super(props)
    
        this.state = {

        }
    }

    render() {
        return (
            <div className="main-page">
                <SearchPage />
            </div>
        )
    }
}