import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Link, Redirect, useNavigate, useLocation } from 'react-router-dom';
import SearchResultsComponent from "../Components/SearchResultsComponent";
import withRouter from "../Components/RouterComponent";

class SearchPage extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          category: '',
          inputObject: {},
          bookTitle: '',
          bookAuthor: '',
          movieTitle: '',
          movieDirector: '',
          movieCast: '',
          placeName: '',
          placeAddress: '',
          placeGeneral: '',
          searchClicked: false,
          warningMessage: '',
        }
    }


    changeCategory = (event) => {
        this.setState({
            category: event.target.value,
        })
    }

    handleChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    // sendProps = () => {
    //     withRouter.navigate('/search-results', {state:{category: this.state.category}});
    //     nav('/search-results', {state:{category: this.state.category}});
        
    // }

    handleSubmit = async (evt) => {
        evt.preventDefault();


        if (this.state.category === "book") {

            this.setState({
                inputObject: {
                    bookTitle: this.state.bookTitle, 
                    bookAuthor: this.state.bookAuthor},
                    searchClicked: true
            })

        } else if (this.state.category === "movie") {

            if ((this.state.movieTitle && !this.state.movieDirector && !this.state.movieCast) ||
            (!this.state.movieTitle && this.state.movieDirector && !this.state.movieCast) ||
            (!this.state.movieTitle && !this.state.movieDirector && this.state.movieCast)) {

                this.setState({
                    inputObject: {
                        movieTitle: this.state.movieTitle, 
                        movieDirector: this.state.movieDirector, 
                        movieCast: this.state.movieCast},
                    searchClicked: true
                })

            } else {
                this.setState({
                    warningMessage: 'Only one input should be filled.'
                })
                
            }


        } else if (this.state.category === "place") {
            if ((this.state.placeName && !this.state.placeAddress && !this.state.placeGeneral) ||
            (!this.state.placeName && this.state.placeAddress && !this.state.placeGeneral) ||
            (!this.state.placeName && !this.state.placeAddress && this.state.placeGeneral)) {
                this.setState({
                    inputObject: {
                        placeName: this.state.placeName, 
                        placeAddress: this.state.placeAddress, 
                        placeGeneral: this.state.placeGeneral},
                    searchClicked: true
                    
                })
            } else {
                this.setState({
                    warningMessage: 'Only one input should be filled.'
                })
            }
        }

    }

    render() {
        return (
            <div>
                {!this.state.searchClicked && 
                <div className="search-page">
                    <h3>Search!</h3>
                    <label>Choose a category.  </label>
                    <select name="category" value={this.state.category} onChange={this.changeCategory}>
                        <option value="">-------</option>
                        <option value="book">Book</option>
                        <option value="movie">Movie</option>
                        <option value="place">Place</option>
                    </select>
                    {this.state.category === 'book' && 
                        <div className="book-form">
                            <h3>Search the book.</h3>
                            <form onSubmit={this.handleSubmit}>
                                <label>
                                    Book title:
                                    <input type="text" size="50" name="bookTitle" value={this.state.bookTitle} onChange={this.handleChange}/>
                                </label>
                                <br></br>
                                <br></br>
                                <label>
                                    Book author:
                                    <input type="text" size="50" name="bookAuthor" value={this.state.bookAuthor} onChange={this.handleChange} />
                                </label>
                                <br></br>
                                <br></br>
                                    {/* <Link to="/search-results"><input type="submit" value="search" /></Link> */}
                                    <input type="submit" value="search" />
                            </form>
                        </div>
                    }
                    {this.state.category === 'movie' && 
                        <div className="book-form">
                            <h3>Search the movie. Please type in only one input to search.</h3>
                            <form onSubmit={this.handleSubmit}>
                                <label>
                                    Movie title:
                                    <input type="text" size="50" name="movieTitle" value={this.state.movieTitle} onChange={this.handleChange} />
                                </label><br/>
                                <label>
                                    Movie director:
                                    <input type="text" size="50" name="movieDirector" value={this.state.movieDirector} onChange={this.handleChange} />
                                </label><br/>
                                <label>
                                    Movie cast:
                                    <input type="text" size="50" name="movieCast" value={this.state.movieCast} onChange={this.handleChange} />
                                </label><br/>
                                    <input type="submit" value="search" />
                            </form>
                            {this.state.warningMessage && <p>{this.state.warningMessage}</p>}
                        </div>
                    }
                    {this.state.category === 'place' && 
                        <div className="book-form">
                            <h3>Search the place.</h3>
                            <form onSubmit={this.handleSubmit}>
                                <label>
                                    Place name:
                                    <input type="text" size="50" name="placeName" value={this.state.placeName} onChange={this.handleChange} />
                                </label><br/>
                                <br></br>
                                <label>
                                    Place address:
                                    <input type="text" size="50" name="placeAddress" value={this.state.placeAddress} onChange={this.handleChange} />
                                </label><br/>
                                <br></br>
                                <label>
                                    Place general search:
                                    <input type="text" size="50" name="placeGeneral" value={this.state.placeGeneral} onChange={this.handleChange} />
                                </label><br/>
                                    <p>ex.: 'art museums in nyc'</p>
                                    <input type="submit" value="search" />
                            </form>
                            {this.state.warningMessage && <p>{this.state.warningMessage}</p>}
                        </div>
                    }
                </div>
                }
                {this.state.searchClicked &&
                    <SearchResultsComponent 
                        category = {this.state.category}
                        input = {this.state.inputObject}
                    />
                }
            </div>
        )
    }
}

export default withRouter(SearchPage);