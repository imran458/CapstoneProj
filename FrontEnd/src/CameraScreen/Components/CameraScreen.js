import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../Styles/CameraScreenStyles.js';
import Fontisto from 'react-native-vector-icons/Fontisto';

export default class CameraScreen extends Component{

    jumpToMapScreen () {
        this.props.navigation.navigate('MapScreen');
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.mapMarkerIcon}>
                    <Fontisto name="map-marker-alt" size={30} onPress={()=> this.jumpToMapScreen()}/>
                </TouchableOpacity>

                <Text>Camera Screen</Text>
            </View>
        );
    }
}
    