import React, { Component } from "react";
import InboxComponent from "../Components/InboxComponent";

export default class MessagePage extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            showInbox: true,
            showSentInbox: false,
            showAddFriends: false,
            messages: [],
            friendUsername: "",
            msg: "",
            userId: 0,
            friendId: 0,
            friendFound: false,
            quitSend: false
        }
    }

    componentDidMount = async () => {
        this.clickInbox()
    }

    clickInbox = async () => {
        this.setState({
            showInbox: true,
            showSentInbox: false,
            showAddFriends: false
        })

        const userInfoResponse = await fetch('/api/current-user', {
            method: 'GET',
            headers: {
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });

        const userInfoBody = await userInfoResponse.json();
        console.log(userInfoBody);

        fetch('/api/get-send-saved-received/' + userInfoBody[0].id)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            this.setState({ messages: result, userId: userInfoBody[0].id})
        })
    }

    clickSendInbox = async () => {
        this.setState({
            showInbox: false,
            showSentInbox: true,
            showAddFriends: false
        })

        const userInfoResponse = await fetch('/api/current-user', {
            method: 'GET',
            headers: {
                'jwt-token': localStorage.getItem('user-jwt')
            }
        });

        const userInfoBody = await userInfoResponse.json();
        console.log(userInfoBody);

        fetch('/api/get-send-saves-sent/' + userInfoBody[0].id)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            this.setState({ messages: result})
        })
    }

    clickAddFriends = () => {
        this.setState({
            showInbox: false,
            showSentInbox: false,
            showAddFriends: true
        })

    }

    handleChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }

    searchFriend = async () => {

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

                        if (allFriendsId.includes(this.state.friendId)) {
                            this.setState({
                                msg: "You are already friend with a user"
                            })

                        } else {
                            console.log('huh')
                            this.setState({
                                friendFound: true,
                            })
                        }

                    } else {
                        this.setState({
                            friendFound: true,
                        })
                    }
                })
                
            }
        })


    }

    sendFriendReq = () => {
        fetch('http://localhost:3000//api/add-friends/'+ this.state.userId + '/' + this.state.friendId, {method: 'POST'})
        .then(response => response.json())
        .then(result => {
            console.log(result);
            this.setState({
                friendFound: false,
                friendUsername: "",
                msg: ""
            })
        })
    }

    toQuitSend = () => {
        this.setState({
            friendFound: false,
            friendUsername: "",
            msg: ""
        })
    }


    render() {
        console.log(this.state.friendFound);
        return (
            <div className="message-page">
                <h3>Message Page</h3>
                <ul className="msg-menu-bar">
                    <li className="msg-nav"><button className="msg-menu-btn" onClick={this.clickInbox}>Inbox</button></li>
                    <li className="msg-nav"><button className="msg-menu-btn" onClick={this.clickSendInbox}>Sent Saves</button></li>
                    <li className="msg-nav"><button className="msg-menu-btn" onClick={this.clickAddFriends}>Add Friends</button></li>
                </ul>
                {this.state.messages && this.state.showInbox && this.state.messages.map((msg, i) => {
                    return (
                        <InboxComponent
                            key ={i}
                            msg={msg}
                            page = "received"
                        />
                    )
                })
                }

                {this.state.messages && this.state.showSentInbox && this.state.messages.map((msg, i) => {
                    return (
                        <InboxComponent
                            key ={i}
                            msg={msg}
                            page = "sent"
                        />
                    )
                })
                }
                {this.state.showAddFriends && !this.state.friendFound &&
                    <div>
                        <h5>Search for a friend</h5>
                        <input type="text" size="20" name="friendUsername" value={this.state.friendUsername} onChange={this.handleChange} /> &nbsp;
                        <input type="button" onClick={this.searchFriend} value="search" />
                        {this.state.msg && <p>{this.state.msg}</p>}
                    </div>
                }

                {this.state.friendFound &&
                    <div>
                        <p>Do you want to send this to @{this.state.friendUsername}?</p>
                        <input type="button" onClick={this.sendFriendReq} value="yes" />&nbsp;
                        <input type="button" onClick={this.toQuitSend} value="no" />
                    </div>
                }
            </div>
        )
    }
}