import React, { Component } from "react";

export default class InboxComponent extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            receivedPost: false,
            senderUsername: "",
            msgAnswered: false
        }
    }

    componentDidMount = async () => {
        if (this.props.page === "received") {
            fetch('http://localhost:3000/api/get-user-id/' + this.props.msg.userId1)
            .then(response => response.json())
            .then(result => {
                // console.log(result);
                this.setState({ receivedPost: true, senderUsername: result[0].username})
            })

        }
        
        if (this.props.page === "sent") {

            console.log(this.props.msg.userId2)

            fetch('http://localhost:3000/api/get-user-id/' + this.props.msg.userId2)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                this.setState({ senderUsername: result[0].username})
            })
        }

    }

    acceptSave = async () => {

        console.log(this.props.msg.id)

        const updateRes = await fetch('/api/saved-accepted/' + this.props.msg.id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'}
        });

        // const updateResBody = await updateRes.json();
        // console.log(updateResBody);

        this.setState({
            msgAnswered: true
        })
        
    }

    declineSave = async () => {
        const updateRes = await fetch('/api/saved-declined/' + this.props.msg.id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'}
        });

        // const updateResBody = await updateRes.json();
        // console.log(updateResBody);
        this.setState({
            msgAnswered: true
        })
    }

    render() {
        console.log(this.props.msg);
        console.log(this.state.msgAnswered)
        return (
            <div className="inbox-component">
                {this.props.page === "received" &&
                    <div className="recieving container">
                        <p>From: {this.state.senderUsername}</p>
                        {this.props.msg.category === "book" && 
                            <div className="each-container">
                                <h5 style={{textDecoration: 'underline'}}>{this.props.msg.category}</h5>
                                <h4>{this.props.msg.bookTitle}</h4>
                                <p>By {this.props.msg.author}</p>
                            </div>
                        }
                        {this.props.msg.category === "place" && 
                            <div className="each-container">
                                <h5 style={{textDecoration: 'underline'}}>{this.props.msg.category}</h5>
                                <h4>{this.props.msg.name}</h4>
                                <p>By {this.props.msg.address}</p>
                            </div>
                        }
                        {!this.state.msgAnswered && 
                            <div>
                                <button onClick={this.acceptSave}>Accept</button>
                                <button onClick={this.declineSave}>Decline</button>
                            </div>
                        }
                        
                        {this.state.msgAnswered && <p>Recommendation Answered!</p>}
                    </div>
                }
                {this.props.page === "sent" && 
                    <div className="sent container">
                        <p>To: {this.state.senderUsername}</p>
                        {this.props.msg.category === "book" && 
                            <div className="each-container">
                                <h5 style={{textDecoration: 'underline'}}>{this.props.msg.category}</h5>
                                <h4>{this.props.msg.bookTitle}</h4>
                                <p>By {this.props.msg.author}</p>
                            </div>
                        }
                        {this.props.msg.category === "place" && 
                            <div className="each-container">
                                <h5 style={{textDecoration: 'underline'}}>{this.props.msg.category}</h5>
                                <h4>{this.props.msg.name}</h4>
                                <p>By {this.props.msg.address}</p>
                            </div>
                        }
                        {this.props.msg.status === 1 && <p>Recommendation Pending</p>}
                        {this.props.msg.status === 2 && <p>Recommendation Accepted</p>}
                        {this.props.msg.status === 3 && <p>Recommendation Declined</p>}
                    </div>
                }
            </div>
        )
    }
}