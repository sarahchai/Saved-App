import React, { Component } from "react";
import { useParams, useLocation } from "react-router-dom";
import SearchSaveContainer from "./SearchSaveContainer";

export default class SearchResultsComponent extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
          results: [],
          searchFinished: false,
          userId: 0
        }
        
    }

    componentDidMount = async () => {

        if (this.props.category === "book") {
            if ((this.props.input.bookTitle && this.props.input.bookAuthor) ||
            (this.props.input.bookTitle && !this.props.input.bookAuthor)) {
                fetch('https://www.googleapis.com/books/v1/volumes?q='+ this.props.input.bookTitle + this.props.input.bookAuthor + '&key=AIzaSyBqzNIM1nd4ziug7PaBKLFYTJzrkLrWNdc')
                    .then(response => response.json())
                    .then(result => {
                    this.setState({ results: result.items})
                })

            } else if (!this.props.input.bookTitle && this.props.input.bookAuthor) {
                fetch('https://www.googleapis.com/books/v1/volumes?q=inauthor:'+ this.props.input.bookAuthor + '&key=AIzaSyBqzNIM1nd4ziug7PaBKLFYTJzrkLrWNdc')
                    .then(response => response.json())
                    .then(result => {
                        this.setState({ results: result.items})
                })
            }

    
        } else if (this.props.category === "movie") {
            if (this.props.input.movieTitle) {
                fetch('https://api.themoviedb.org/3/search/movie?query='+ this.props.input.movieTitle +'&api_key=6c91045c4aecfe995c551518cedda01f')
                    .then(response => response.json())
                    .then(result => {
                    console.log(result);
                        this.setState({ results: result.results})
                })

            } else if (this.props.input.movieDirector) {


            } else if (this.props.input.movieCast) {

            }

        } else if (this.props.category === "place") {
            if (!this.props.input.placeName && !this.props.input.placeGeneral && this.props.input.placeAddress) {

            } else {
                console.log(this.props.input);
                const getReq = {
                    method: 'GET',
                    // headers: {
                    // "Access-Control-Allow-Origin": "*"},
                }
                
                fetch('https://maps.googleapis.com/maps/api/place/textsearch/json?query='+ this.props.input.placeName + 
                this.props.input.placeAddress + this.props.input.placeGeneral + '&key=AIzaSyBBrxoP_Sjqz0i1trZRSk7BGl-kj7TSCLM', getReq)
                    .then(response => response.json())
                    .then(result => {
                    console.log(result);
                        this.setState({ results: result.results})
                    })
                    .catch(err => {
                        console.log('error', err);
                    })
            }
        }

        const userInfoResponse = await fetch('/api/current-user', {
            method: 'GET',
            headers: {
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });

        const userInfoBody = await userInfoResponse.json();
        console.log(userInfoBody[0].id);

        this.setState({
            userId: userInfoBody[0].id
        })
    }


    locationComponent = props => {
        // const location = useLocation();
        // return location.state.category;
    }

    render() {
        // const category = this.locationComponent();
        console.log(this.state.results);

        // I need to have something when there is no result 
        // When there might be a typo?????????

        return (
            <div className="search-results-component">
                <h3>Search Reasults</h3>
                {this.state.results && 
                this.state.results.map((result, i) => {
                    return (
                        <SearchSaveContainer 
                            key ={i}
                            save ={result}
                            page = "search"
                            category = {this.props.category}
                            id = {this.state.userId}
                        />
                    )
                })
                    
                }
            </div>
        )
    }

}