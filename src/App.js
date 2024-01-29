import React, { Component } from "react";
import './App.css';
import { BrowserRouter, Routes, Route, Link, redirect, Switch } from 'react-router-dom';
import MainPage from "./Pages/MainPage";
import SearchPage from "./Pages/SearchPage";
import SearchResultsComponent from "./Components/SearchResultsComponent";
import FeedPage from "./Pages/FeedPage";
import SavesPage from "./Pages/SavesPage";
import withRouter from "./Components/RouterComponent";
import MenuComponent from "./Components/MenuComponent";
import LoginRegisterPage from "./Pages/LoginRegisterPage";
import MessagePage from "./Pages/MessagePage";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loggedIn: Boolean(localStorage.getItem('user-jwt')) || false,
      username: "",
    }
  }

  toLoggedIn = () => {
    this.setState({
      loggedIn: true
    })
  }

  logout = () => {
    
    localStorage.clear();
    window.location.reload();
    return redirect('/');
  }


  render() {
    return (

      <BrowserRouter>
        <div className="App">
          {this.state.loggedIn && 
            <MenuComponent 
              userId={this.state.userId}
              logout={this.logout}
            />
          }

          {!this.state.loggedIn && 
            <LoginRegisterPage
              toLoggedIn={this.toLoggedIn}
              user={this.state.username}
            />
          }
  
        </div>
        <Routes>

          <Route
            path="/login"
            element={<LoginRegisterPage/>}
          />

          <Route
            path="/search"
            element={<SearchPage/>}
          />

          <Route
            path="/search-results/:id"
            element={<SearchResultsComponent/>}
          />

          <Route
            path="/feed"
            element={<FeedPage/>}
          />

          <Route
            path="/saves"
            element={<SavesPage/>}
          />

          <Route
            path="/message"
            element={<MessagePage/>}
          />



        </Routes>
        
      </BrowserRouter>
    );
  }
}

export default App;
