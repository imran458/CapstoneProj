import React, {Component} from 'react';
import {View, Text, TouchableOpacity, PermissionsAndroid} from 'react-native';
import styles from '../Styles/CameraScreenStyles.js';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {RNCamera} from 'react-native-camera';

export default class CameraScreen extends Component {
  jumpToMapScreen() {
    this.props.navigation.navigate('MapScreen');
  }

  constructor() {
    super();
    if (Platform.OS === 'android') {
      this.requestCameraPermission();
    }
  }

  async requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Diggraffiti',
          message: 'Let Diggrafiti Access the Camera',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.mapMarkerIcon}>
          <Fontisto
            name="map-marker-alt"
            size={30}
            onPress={() => this.jumpToMapScreen()}
          />
        </TouchableOpacity>
        <RNCamera
          ref={(ref) => {
            this.CameraScreen = ref;
          }}
          style={{position: 'absolute',top: 0,left: 0,right: 0, bottom: 0}}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.auto}
          captureAudio={false}></RNCamera>

        
      </View>
    );
  }
}
