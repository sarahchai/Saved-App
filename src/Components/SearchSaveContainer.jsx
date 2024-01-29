import React, { Component } from "react";
import withRouter from "../Components/RouterComponent";

class SearchSaveContainer extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            privateCheckbox: false,
            archiveBtn: false,
            sendBtn: false,
            saveBtn: false,
            showLikes: false,
            clickableLikes: false,
            archived: false,
            private: false,
            likedByUser: false,
            category: "",
            saved: false,
            showSearchFriend: false,
            friendUsername: "",
            friendId: 0,
            friendsFound: false,
            msg: "",
            sendToFriend: false,
            quitSend: false,
            postUsername: ""
        }
    }

    componentDidMount = async () => {
        if (this.props.page === "saves") {
            this.setState({
                privateCheckbox: true,
                archiveBtn: true,
                sendBtn: true,
                showLikes: true,
                category: this.props.save.category
            })
        } else if (this.props.page === "search") {
            this.setState({
                privateCheckbox: true,
                saveBtn: true,
                sendBtn: true,
                category: this.props.category
            })

        } else if (this.props.page === "feed") {
            this.setState({
                privateCheckbox: true,
                saveBtn: true,
                sendBtn: true,
                showLikes: true,
                category: this.props.save.category,
                clickableLikes: false
            })

            fetch('http://localhost:3000//api/get-user-id/' + this.props.save.userId)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                this.setState({
                    postUsername: result[0].username
                })
            })

        }

        if (this.props.save.private === 1) {
            this.setState({
                private: true,
            })
        }

        if (this.props.save.archived === 1) {
            this.setState({
                archived: true
            })
        }


    }

    save = () => {

        if (this.props.category === "book") {
            var apiId = "";
            var author = "";
            var title = "";

            if (this.props.page === "search") {
                apiId = this.props.save.id;
                author = this.props.save.volumeInfo.authors[0];
                title = this.props.save.volumeInfo.title
            } else {
                apiId = this.props.save.movieAPI;
                author = this.props.save.author;
                title = this.props.save.bookTitle;
            }

            const postReq = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',},
                body: JSON.stringify({ category: this.props.category, apiId: apiId, author: author, title: title }),
            };
    
            fetch('http://localhost:3000/api/save/' + this.props.id, postReq)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    this.setState({ saved: true })
            })
        } else if (this.props.category === "movie") {
            const postReq = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',},
                body: JSON.stringify({ category: this.props.category, apiId: this.props.save.id, author: this.props.save.volumeInfo.authors[0], title: this.props.save.volumeInfo.title }),
            };
    
            fetch('http://localhost:3000/api/save/' + this.props.id, postReq)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    this.setState({ saved: true})
            })

        } else if (this.props.category === "place") {

            var apiId = "";
            var address = "";
            var name = "";

            if (this.props.page === "search") {
                apiId = this.props.save.place_id;
                address = this.props.save.formatted_address;
                name = this.props.save.name;
            } else {
                apiId = this.props.save.placeAPI;
                address = this.props.save.address;
                name = this.props.save.name;
            }

            const postReq = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',},
                body: JSON.stringify({ category: this.props.category, apiId: apiId, address: address, name: name }),
            };
    
            fetch('http://localhost:3000/api/save/' + this.props.id, postReq)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    this.setState({ saved: true})
            })
        }

    }

    showFriendSearch = () => {
        this.setState({
            showSearchFriend: true
        })
    }

    searchFriend = async () => {

        console.log(this.state.friendUsername);

        fetch('http://localhost:3000/api/get-user/' + this.state.friendUsername)
        .then(response => response.json())
        .then(result => {
            if (result.message) {
                this.setState({
                    msg: result.message
                })
            } else {
                this.setState({
                    friendId: result[0].id
                })

                fetch('http://localhost:3000/api/get-friends/' + result[0].id)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    if (result.length > 0) {

                        const allFriendsId = result.map(friend => friend.id);
                        console.log(allFriendsId)
                        if (allFriendsId.includes(result[0].id)) {

                            this.setState({
                                friendsFound: true
                            })

                        } else {
                            this.setState({
                                msg: "You are not friends with the user"
                            })
                        }

                    } else {
                        this.setState({
                            msg: "You are not friends with the user"
                        })
                    }
                })
                
            }
        })


    }


    sendSave = () => {
        console.log('duh', this.props.category)

        if (this.props.category === "book") {
            var apiId = "";
            var author = "";
            var title = "";

            if (this.props.page === "search") {
                apiId = this.props.save.id;
                author = this.props.save.volumeInfo.authors[0];
                title = this.props.save.volumeInfo.title
            } else {
                apiId = this.props.save.movieAPI;
                author = this.props.save.author;
                title = this.props.save.bookTitle;
            }

            console.log(author, title)

            const postReq = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',},
                body: JSON.stringify({ category: this.props.category, apiId: apiId, author: author, title: title }),
            };
    
            fetch('http://localhost:3000/api/send-save/' + this.props.id + '/' + this.state.friendId, postReq)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    this.setState({ quitSend: true })
            })
        } else if (this.props.category === "movie") {
            const postReq = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',},
                body: JSON.stringify({ category: this.props.category, apiId: this.props.save.id, author: this.props.save.volumeInfo.authors[0], title: this.props.save.volumeInfo.title }),
            };
    
            fetch('http://localhost:3000/api/send-save/' + this.props.id + '/' + this.state.friendId, postReq)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    this.setState({ quitSend: true })
            })

        } else if (this.props.category === "place") {
            var apiId = "";
            var address = "";
            var name = "";

            if (this.props.page === "search") {
                apiId = this.props.save.place_id;
                address = this.props.save.formatted_address;
                name = this.props.save.name;
            } else {
                apiId = this.props.save.placeAPI;
                address = this.props.save.address;
                name = this.props.save.name;
            }

            console.log('hi')

            const postReq = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json',},
                body: JSON.stringify({ category: this.props.category, apiId: apiId, address: address, name: name }),
            };
    
            fetch('http://localhost:3000/api/send-save/' + this.props.id + '/' + this.state.friendId, postReq)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    this.setState({ quitSend: true })
            })
        }
    }

    toQuitSend = () => {
        this.setState({
            quitSend: true
        })
    }

    makeArchive = () => {

    }

    makePrivate = () => {

    }

    handleChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }


    render() {
        console.log(this.props.save)
        // console.log(this.state.msg);
        console.log(this.props.page)
        return (
            <div className="search-save-container">
                {/* <h3>save</h3> */}

                {this.props.page === "search" && this.props.category === "book" && 
                    <div className="each-container">
                        <h4>{this.props.save.volumeInfo.title}</h4>
                        <p>By {this.props.save.volumeInfo.authors[0]}</p>
                    </div>
                }

                {this.props.page === "search" && this.props.category === "place" && 
                    <div className="each-container">
                        <h4>{this.props.save.name}</h4>
                        <p>{this.props.save.formatted_address}</p>
                    </div>
                }

                {this.props.page === "search" && this.props.category === "movie" && 
                    <div className="each-container">
                        <h4>{this.props.save.title} {this.props.save.release_date}</h4>
                        <p>{this.props.save.formatted_address}</p>
                    </div>
                }

                {this.props.page !== "search" && this.props.save.category === "book" && 
                    <div className="each-container">
                        
                        {this.state.postUsername && <p>@{this.state.postUsername}</p>}
                        <h5 style={{textDecoration: 'underline'}}>{this.props.save.category}</h5>
                        <h4>{this.props.save.bookTitle}</h4>
                        <p>By {this.props.save.author}</p>
                    </div>
                }

                {this.props.page !== "search" && this.props.save.category === "place" && 
                    <div className="each-container">
                        {this.state.postUsername && <p>@{this.state.postUsername}</p>}
                        <h5 style={{textDecoration: 'underline'}}>{this.props.save.category}</h5>
                        <h4>{this.props.save.name}</h4>
                        <p>{this.props.save.address}</p>
                    </div>
                }

                {this.state.privateCheckbox && <div><label for="private">🔒</label><input type="checkbox" id="private" value="private" onChange={this.makePrivate}/></div>}
                {this.state.saveBtn && !this.state.saved&& <button onClick={this.save}>Save</button>}
                {this.state.saveBtn && this.state.saved && <button style={{ color: 'red' }}>Saved!</button>}
                {this.state.archiveBtn && <button onClick={this.makeArchive}>Archive</button>}
                {this.state.sendBtn && <button onClick={this.showFriendSearch}>Send</button>}
                {this.state.showSearchFriend && !this.state.friendsFound &&
                    <div>
                        <p>Search for a friend</p>
                        <input type="text" size="20" name="friendUsername" value={this.state.friendUsername} onChange={this.handleChange} /> &nbsp;
                        <input type="button" onClick={this.searchFriend} value="search" />
                        {this.state.msg && <p>{this.state.msg}</p>}
                    </div>
                }
                {this.state.friendsFound && !this.state.quitSend &&
                    <div>
                        <p>Do you want to send this to @{this.state.friendUsername}?</p>
                        <input type="button" onClick={this.sendSave} value="yes" />&nbsp;
                        <input type="button" onClick={this.toQuitSend} value="no" />
                    </div>
                }

            </div>
        )
    }
}

export default withRouter(SearchSaveContainer);