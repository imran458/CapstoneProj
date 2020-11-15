import React, {Component} from 'react';
import {View, Text, Alert, TouchableOpacity, PermissionsAndroid, Platform, Image} from 'react-native';
import styles from '../Styles/CameraScreenStyles.js';
import {RNCamera} from 'react-native-camera';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CameraRoll from "@react-native-community/cameraroll";
import { captureScreen } from "react-native-view-shot";

export default class CameraScreen extends Component {
  constructor() {
    super();
    if (Platform.OS === 'android') {
      this.requestCameraPermission();
    }

    this.state = {
      pressed: false,
      savedImageInfo: {},
      imageURI: '',
      imageSaved: false
    }
  }


  async hasAndroidPermission() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
  
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }
  
  async savePicture() {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }
  
    CameraRoll.save(tag, { type, album })
  };

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

  jumpToMapScreen() {
    this.props.navigation.navigate('MapScreen');
  }

  paintBrushPressed(){
    this.setState({pressed: !this.state.pressed});
  }

  captureScreenFunction (){

    captureScreen({
      format: "jpg",
      quality: 0.8
    })
    .then(
      uri => this.setState({ imageURI : uri }),
      error => console.error("Oops, Something Went Wrong", error)
      
    );

    console.log("This is where the saved image is located: " + this.state.imageURI);
    this.setState({imageSaved: true});

  }

  render() {
    return (
      <View style={styles.container}>
         
        <RNCamera
          ref={(ref) => {
            this.CameraScreen = ref;
          }}
          style={{position: 'absolute',top: 0,left: 0,right: 0, bottom: 0}}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.auto}
          captureAudio={false}>
          
         
          {this.state.pressed ?
            <RNSketchCanvas
              defaultStrokeIndex={0}
              defaultStrokeWidth={5}
              containerStyle={styles.sketchContainer}
              canvasStyle={styles.sketchCanvas}
              closeComponent={<View style={styles.close}><MaterialCommunityIcons name="window-close" size={40}/></View>}
              onClosePressed={() => this.paintBrushPressed()}
              clearComponent={<View style={styles.trash}><Fontisto name="trash" size={35}/></View>}
              eraseComponent={<View style={styles.eraser}><MaterialCommunityIcons name="eraser" size={45} /></View>}
              strokeComponent={color => (<View style={[{ backgroundColor: color }, styles.strokeColorButton]}/>)}
              strokeSelectedComponent={(color, index, changed) => {
              return (<View style={[{backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]}/>)}}
              strokeWidthComponent={(w) => {
              return (<View style={styles.strokeWidthButton}>
                          <View  style={{backgroundColor: 'white', marginHorizontal: 2.5,width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2 }} />
                      </View>
              )}}
              saveComponent={<View style={styles.save}><Entypo name="save" size={40} style={styles.facebookIcon}/></View>}
              savePreference={() => {
              
              return {
                folder: null, 
                filename: String(Math.ceil(Math.random() * 100000000)),
                transparent: false,
                includeImage: true,
                imageType: 'png'
              }}}

              onSketchSaved={()=> this.captureScreenFunction()}
              
            />
            : 
            <View >
              <TouchableOpacity style={styles.mapMarkerIcon}>
                <Fontisto name="map-marker-alt" size={42} onPress={() => this.jumpToMapScreen()}/>
              </TouchableOpacity>

              <TouchableOpacity style={styles.paintBrush} onPress={() => this.paintBrushPressed()}>
                <FontAwesome5 name="paint-brush" size={50}/>
              </TouchableOpacity>

              
            </View>

            }
            
        </RNCamera>
        {this.state.imageSaved && this.state.imageURI !== '' ? 
           
            <Image style={{width: 50,
              height: 50,}} source={{uri: this.state.imageURI}}/>
          : null}
      </View>
    );
  }
}
