import React, { useState } from 'react';
import { 
    View,
    SafeAreaView, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Modal
} from 'react-native';

// Components
import Broadcaster from './Broadcaster';
import EventDetails from './EventDetails';

// Style Variables
import { colorPalette } from '../styles/ColorPalette';

function ArtistEvent(props) {


    const [ broadcasting, setBroadcasting ] = useState(false);

    const artistData = props.artistInfo;
    const eventData = props.eventData;
    const navigation = props.navigation;

    const handleBroadcastingState = ()  =>  {
        console.log('broadcast state changed')
        setBroadcasting(!broadcasting);
    };

    return (
        <View style={styles.eventContainer}>
            { broadcasting ?  
                <Broadcaster 
                    eventData={eventData}
                    artistData={artistData}
                    navigation={navigation}
                    handleBroadcastingState={handleBroadcastingState}
                /> 
                :
                <View style={styles.eventContainer}>
                    <EventDetails 
                        eventData={eventData}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            onPress={handleBroadcastingState}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>
                                Start the show
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
        flex: 1
    },
    buttonContainer: {
        flex: 1
    },  
    button: {
        marginHorizontal: 60,
        // marginTop: 30,
        backgroundColor: colorPalette.accentColor,
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: colorPalette.primaryColor,
        fontWeight: '500'
    }
});

export default ArtistEvent;