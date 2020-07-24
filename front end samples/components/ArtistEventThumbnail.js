import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
} from 'react-native';

// Components
import RenderThumbnail from './RenderThumbnail';

// Style Variables
import { colorPalette } from '../styles/ColorPalette';

const ArtistEventThumbNail = (props) => {

    const eventData = props.event;

    const formatTitle = () => {
        return eventData.title.substr(0,20) + '...';
    };


    return (
        <View style={styles.eventContainer}>
            <RenderThumbnail 
                imageURI={eventData.imageURI}
            />
            <View style={styles.eventInfo}>
                <Text style={styles.eventText}>
                    {eventData.artist}
                </Text>
                <Text style={styles.eventText}>
                    {formatTitle()}
                </Text>
                <Text style={styles.eventText}>
                    {eventData.date}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    eventContainer: {
        height: 200,
        width: 150,
        marginLeft: 10,
        marginRight: 10,

    },
    eventInfo: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 20,
        backgroundColor: colorPalette.transparentBackground
    },
    eventText: {
        color: colorPalette.tertiaryColor
    }
});

export default ArtistEventThumbNail;