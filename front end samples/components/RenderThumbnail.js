import React from 'react';
import { 
    View, 
    ImageBackground, 
    StyleSheet, 
} from 'react-native';

// Components
import FastImage from 'react-native-fast-image';

// Style Variables
import { colorPalette } from '../styles/ColorPalette';

function RenderThumbnail(props) {

    const imageURI = props.imageURI;
    const defaultImage = require('../assets/LF2.png');

    return (
        <View style={styles.backgroundImage}>
            { imageURI ? 
                <FastImage 
                    source={{uri: imageURI}}
                    style={styles.image} 
                    // onLoadStart={console.log('started')}
                    // onLoad={console.log('finsihed')}
                />
            :
                <ImageBackground 
                    source={imageURI ? {uri: imageURI} : defaultImage}
                    style={styles.backgroundImage}
                    defaultSource={defaultImage}
                >
                </ImageBackground> 
            }
        </View>
    )  
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 2
    },
    image: {
        flex: 1
    },
    defaultImage: {
        resizeMode: 'stretch'
    }
});

export default RenderThumbnail;