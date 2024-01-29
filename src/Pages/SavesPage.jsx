import React, { Component } from "react";
import withRouter from "../Components/RouterComponent";
import SearchSaveContainer from "../Components/SearchSaveContainer";

class SavesPage extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            saves: [],
            userId: 0,
        }
    }

    componentDidMount = async () => {
        // console.log(localStorage.getItem('user-jwt'));

        const userInfoResponse = await fetch('/api/current-user', {
            method: 'GET',
            headers: {
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });

        const userInfoBody = await userInfoResponse.json();

        console.log(userInfoResponse);

        this.setState({
            userId: userInfoBody[0].id
        })

        fetch('http://localhost:3000/api/all-saves/' + userInfoBody[0].id)
            .then(response => response.json())
            .then(result => {
                this.setState({ saves: result})
            })
    }

    render() {
        console.log(this.state.saves);
        return (
            <div className="saves-page">
                <h3>Your Saves</h3>
                {this.state.saves && this.state.saves.map((save, i) => {
                    return (
                        <SearchSaveContainer 
                            key ={i}
                            save={save}
                            page = "saves"
                            id = {this.state.userId}
                            category={save.category}
                        />
                    )
                })
                }
            </div>
        )
    }
}

export default withRouter(SavesPage);