import React, { Component } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    FlatList 
} from 'react-native';

// Firebase Ref
import firestore from '@react-native-firebase/firestore';

// Components
import EventThumbnail from './EventThumbnail';

export class EventList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            events: []
        }
    };

    componentDidMount() {
        this.unsubscribe = firestore().collection('events').onSnapshot((snapshot) => {
            var eventsArray = snapshot.docs.map((doc) => {
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
            this.setState({
                events: eventsArray
            })
        })
    };

    componentWillUnmount() {
        this.unsubscribe();
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.listTitle}>
                    {this.props.title}
                </Text>
                <FlatList
                    data={this.state.events}
                    horizontal={true}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate('Event', { item })}}
                                         key={item.id}
                        >
                            <EventThumbnail
                                event={item}
                            />
                        </TouchableOpacity>
                    )}>
                </FlatList>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 50
    },
    listTitle: {
        color: 'white'
    }
});

export default EventList;