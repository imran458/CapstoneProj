import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../Styles/MapScreenStyles.js';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default class MapScreen extends Component{

    jumpToCameraScreen () {
        this.props.navigation.navigate('CameraScreen');
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.cameraIcon} onPress={() => this.jumpToCameraScreen()} >
                    <AntDesign name="camera" size={30} />       
                </TouchableOpacity>
                <Text>Map Screen</Text>
            </View>
        );
    }
}
    