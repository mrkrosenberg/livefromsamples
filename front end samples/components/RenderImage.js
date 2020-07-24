import React, { useEffect } from 'react';
import { 
    View, 
    Image,
    StyleSheet, 
    Dimensions
} from 'react-native';

// Components
import FastImage from 'react-native-fast-image';

// Style Variables
import { colorPalette } from '../styles/ColorPalette';

function RenderImage(props) {

    const imageURI = props.imageURI;
    const defaultImage = require('../assets/defaultImage.jpg');
    const deviceWidth = Dimensions.get('window').width;

    return (
        <View style={styles.imageContainer}>
            { imageURI ? 
                <FastImage 
                    source={{uri: imageURI}}
                    style={styles.image} 
                    // onLoadStart={console.log('started')}
                    // onLoad={console.log('finsihed')}
                />
            :
                <Image 
                    source={defaultImage}
                    style={[styles.defaultImage, {width: deviceWidth}]}
                    defaultSource={defaultImage}  
                />
            }
        </View>
    )       
};

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        marginTop: 30,
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: 30
    },  
    image: {
        flex: 1,
        height: 200,
        resizeMode: 'center',
        // marginLeft: -200
    },
    defaultImage: {
        flex: 1,
        // height: 200,
        resizeMode: 'center'
    }
});

export default RenderImage;