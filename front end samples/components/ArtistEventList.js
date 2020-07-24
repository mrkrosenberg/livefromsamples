import React, { useState, useEffect, useContext} from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    FlatList 
} from 'react-native';

// Context
import UserContext from '../context/UserContext';

// Firebase 
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Components
import ArtistEventThumbnail from './ArtistEventThumbnail';

// Style Variables
import { colorPalette } from '../styles/ColorPalette';

function ArtistEventsList({ navigation }) {


    const userContext = useContext(UserContext);
    const currentUser = auth().currentUser.displayName;

    const [ eventsList, setEventsList ] = useState([]);

    const dbRef = firestore().collection('events').where('artist', '==', currentUser);

    // subscribe to user's events, unsubscribe on dismount
    useEffect(() => {
        const unsubscribe = dbRef.onSnapshot(snapshot => {
            var eventsArray = snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    title: doc.data().title,
                    artist: doc.data().artist,
                    description: doc.data().description,
                    imageURI: doc.data().imageURI,
                    date: doc.data().date,
                    time: doc.data().time,
                    ticketPrice: doc.data().ticketPrice,
                    playbackID: doc.data().playbackID,
                    ticketBatch: doc.data().ticketBatch
                }
            })
            setEventsList(eventsArray);
        })
        return unsubscribe
    }, [ setEventsList ]);

    
    return (
        <View style={styles.eventListContainer}>
            <View style={styles.eventList}>
                { eventsList.length == 0 ?
                    <View style={styles.noEventsContainer}>
                        <Text style={styles.noEventsText}>
                            Looks like you don't have any events scheduled yet
                        </Text>
                    </View>
                    :
                    <FlatList 
                        data={eventsList}
                        horizontal={true}
                        renderItem={({item}) =>  (
                           <TouchableOpacity 
                                onPress={() => navigation.navigate('Event', { item : item })}
                                key={item.id}
                            >
                                <ArtistEventThumbnail 
                                    event={item}
                                />
                           </TouchableOpacity>
                        )}>
                    </FlatList>
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    eventListContainer: {
    },
    eventList: {

    },
    noEventsContainer: {
        // flex: 1,
        backgroundColor: 'red'
    },
    noEventsText: {
        color: colorPalette.tertiaryColor
    }
});

export default ArtistEventsList;
