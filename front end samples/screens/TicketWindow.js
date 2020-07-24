import React, { Component } from 'react';
import { 
    View, 
    SafeAreaView,
    Text, 
    TouchableOpacity,
} from 'react-native';

// Stripe
import stripe from 'tipsi-stripe';
stripe.setOptions({
    publishableKey: 'pk_test_xWFz7H9K49OgYM0sisVGLzt800abEvg59I'
});

// Firebase
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';

// Components
import CardFormSreen from '../../stripe-components/CardFormScreen';


export class TicketWindow extends Component {

    constructor(props) {
        super(props);

        if (__DEV__) {
        functions().useFunctionsEmulator('http://localhost:5000');
      }

        this.eventData = props.route.params.eventData;
        this.userContext = props.route.params.userContext;
        this.purchaseTicket = functions().httpsCallable('purchaseTicket');
    };

    

    handleTicketPurchase = () => {

        this.purchaseTicket({ eventData: this.eventData, userContext: this.userContext }).then(response => {
            console.log('ticket purchase successful: ', response)
        }).catch(error => {
            console.log('ticket purchase error: ', error)
        })
    };


    render() {
        return (
            <SafeAreaView>
                <View>
                <Text>
                    Ticket Window
                </Text>
                </View>
                <TouchableOpacity>
                    <Text>
                        Enter Venue
                    </Text>
                </TouchableOpacity>
                <View style={{marginTop: 100}}>
                    <CardFormSreen 
                        eventData={this.eventData}
                        userContext={this.userContext}
                    />
                </View>
            </SafeAreaView>
        )
    }
}

export default TicketWindow;
