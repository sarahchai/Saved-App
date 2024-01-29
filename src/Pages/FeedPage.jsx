import React, { Component } from "react";
import withRouter from "../Components/RouterComponent";
import SearchSaveContainer from "../Components/SearchSaveContainer";

class FeedPage extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            feedResults: [],
            userId: 0
        }
    }

    componentDidMount = async () => {
        const userInfoResponse = await fetch('/api/current-user', {
            method: 'GET',
            headers: {
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });

        const userInfoBody = await userInfoResponse.json();
        console.log(userInfoBody);

        fetch('http://localhost:3000/api/get-feed/' + userInfoBody[0].id)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            this.setState({ feedResults: result, userId: userInfoBody[0].id})
        })
    }

    render() {
        return (
            <div className="feed-page">
                <h3>Feed Page</h3>
                {this.state.feedResults && this.state.feedResults.map((save, i) => {
                    return (
                        <SearchSaveContainer 
                            key ={i}
                            save={save}
                            page = "feed"
                        />
                    )
                })
                }
            </div>
        )
    }
}

export default withRouter(FeedPage);