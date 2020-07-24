import React, { useState, useContext } from 'react';
import { 
    View,
    Text, 
    StyleSheet, 
    TouchableOpacity 
} from 'react-native';

// User Context
import UserContext from '../context/UserContext';

// Stripe
import stripe from 'tipsi-stripe';
stripe.setOptions({
    publishableKey: 'pk_test_xWFz7H9K49OgYM0sisVGLzt800abEvg59I'
});

// Components
import CardFormSreen from '../stripe-components/CardFormScreen';
import EventDetails from '../components/EventDetails';

// Style Variables
import  { colorPalette } from '../styles/ColorPalette';


function UserEvent(props) {

    const userContext = useContext(UserContext);
    const [ userHasTicket, setUserHasTicket] = useState(true);
    const eventData = props.eventData;

    return (
        <View style={styles.eventContainer}>
            <EventDetails 
                eventData={eventData}
            />
            { userHasTicket ? 
                <View style={[styles.optionContainer]}>
                    <View style={styles.buttonContainer}>
                    <CardFormSreen 
                        eventData={eventData}
                        userContext={userContext}
                    />
                    </View>
                </View>
                :
                <View style={[styles.optionContainer]}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>
                                Enter Event
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }    
        </View>
    );
};

const styles = StyleSheet.create({
    eventContainer: {
        flex: 1,
        backgroundColor: colorPalette.primaryColor,
    },
    container: {
        // height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    eventInfoContainer: {
        flex: 1,    
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        marginTop: 50,
        justifyContent: 'center',
        alignContent: 'center'
    }, 
    image: {
        height: 200,
        resizeMode: 'center',
    },
    titleContainer: {
        // flex: 1
    },
    descContainer: {
        // flex: 1
    },
    dateContainer: {
        flexDirection: 'row'
    },  
    ticketContainer: {
        // flex: 1
    },
    optionContainer:  {
        // flex: 1,
        marginBottom: 50
    },
    eventText: {
        marginHorizontal: 30,
        color: colorPalette.tertiaryColor
    },  
    buttonContainer: {
        // flex: 1
    },  
    button: {
        marginHorizontal: 50,
        marginTop: 30,
        backgroundColor: colorPalette.accentColor,
        borderRadius: 4,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colorPalette.primaryColor,
        fontWeight: "500",
    }
});

export default UserEvent;