import React, { Component } from 'react';

// Firebase
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Context Object
import UserContext from './UserContext';

export class StateProvider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            userObject: {}
        };

        this.currentUser = auth().currentUser;
    };

    setUserObject = () => {

        const currentUser = auth().currentUser;
        const userEmail = currentUser.email;
        const userID = currentUser.uid;
        
        this.unsubscribe = firestore().collection('users').where('email', '==', userEmail)
            .onSnapshot(snapshot => {
                if(snapshot._docs.length > 0) {
                    const docID = snapshot._docs[0]._ref._documentPath._parts[1];
                    const data = snapshot._docs[0]._data;
                    const  userObject = {
                        uid: userID,
                        userDocumentID: docID,
                        email: data.email,
                        displayName: this.currentUser.displayName || 'User',
                        streamID: data.streamID,
                        playbackID: data.playbackID,
                        streamInitialized: data.streamInitialized,
                        tickets: data.tickets
                    };
                    this.setState({
                        userObject
                    }, () => {
                    })
                };
            });
    
    };

    componentDidMount() {
        this.setUserObject();
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    

    render() {
        return (
            <UserContext.Provider value={this.state.userObject}>
                {this.props.children}
            </UserContext.Provider>
        )
    }
};

export default StateProvider;