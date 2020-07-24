import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
} from 'react-native';

// Components
import FastImage from 'react-native-fast-image';
import RenderImage from './RenderImage';

// Style Variables
import { colorPalette } from '../styles/ColorPalette';

function EventDetails(props) {

    const eventData = props.eventData;
    const defaultImage = require('../assets/flyer.png');


    const formatTimeString = () => {
        return  props.eventData.time.substr(0, 5) +  props.eventData.time.substr(8, 4);
     };

     const formatTicketPrice = () => {
        return props.eventData.ticketPrice / 100;
     };


    return (
        <View style={styles.eventContainer}>
                <RenderImage imageURI={eventData.imageURI}/>
                <View style={styles.eventInfoContainer}>
                    <View style={[styles.titleContainer, styles.container]}>
                        <Text style={styles.eventText}>
                            {eventData.title}
                        </Text>    
                    </View>
                    <View style={[styles.artistContainer, styles.container]}>
                        <Text style={styles.eventText}>
                            Artist: {eventData.artist}
                        </Text>
                    </View>
                    <View style={[styles.descContainer, styles.container]}>
                        <Text style={styles.eventText}>
                            {eventData.description}
                        </Text>
                    </View>
                    <View style={[styles.dateContainer, styles.container]}>
                        <Text style={styles.eventText}>
                            {eventData.date}
                        </Text>
                        <Text style={styles.eventText}>
                            {formatTimeString()}
                        </Text>
                    </View>
                    <View style={[styles.ticketContainer, styles.container]}>
                        <Text style={styles.eventText}>
                            Tickets: ${formatTicketPrice()}
                        </Text>
                    </View>
                </View>
            </View>
    )
};

const styles = StyleSheet.create({
    eventContainer: {
        flex: 3,
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
        alignItems: 'center',
        marginTop: -50
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
    eventText: {
        marginHorizontal: 30,
        marginVertical: 10,
        color: colorPalette.tertiaryColor
    }, 
});

export default EventDetails;