import React, {Component} from 'react';
import {View, Text, Alert, TouchableOpacity, PermissionsAndroid} from 'react-native';
import styles from '../Styles/CameraScreenStyles.js';
import {RNCamera} from 'react-native-camera';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import WikitudeView from 'react-native-wikitude-sdk';
import {Wikitude_AR_LICENSE_KEY} from "@env";
import RNFS from 'react-native-fs';

export default class CameraScreen extends Component {
  constructor() {
    super();
    if (Platform.OS === 'android') {
      this.requestCameraPermission();
    }

    this.state = {
      pressed: false,
      savedImageInfo: {}
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

  jumpToMapScreen() {
    this.props.navigation.navigate('MapScreen');
  }

  paintBrushPressed(){
    this.setState({pressed: !this.state.pressed});
  }

  onSave = async (success, path) => {
    success = true
    console.log("in here!");
    if(!success) return;
    let imageUri;
    const myNewImagePath = RNFS.DocumentDirectoryPath + 'my_folder'
    
    console.log(myNewImagePath);
    try{
        if(path == null){
            // image has been saved to the camera roll
            // Here I am assuming that the most recent photo in the camera roll is the saved image, you may want to check the filename
            const images = await CameraRoll.getPhotos({first: 1});
            if(images.length > 0){
                imageUri = [0].image.uri;
                console.log(imageUri);
            }else{
                console.log('Image path missing and no images in camera roll')
                return;
            }

        } else{
            imageUri = path
        }

        await RNFS.moveFile(imageUri, myNewImagePath)
    } catch (e) {
        console.log(e.message)
    }
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
                folder: 'Temp', 
                filename: String(Math.ceil(Math.random() * 100000000)),
                transparent: false,
                includeImage: true,
                imageType: 'png'
              }}}
              onSketchSaved={this.onSave}
            />
            : 
            <View >
              <TouchableOpacity style={styles.mapMarkerIcon}>
                <Fontisto name="map-marker-alt" size={42} onPress={() => this.jumpToMapScreen()}/>
              </TouchableOpacity>

              <TouchableOpacity style={styles.paintBrush} onPress={() => this.paintBrushPressed()}>
                <FontAwesome5 name="paint-brush" size={50}/>
              </TouchableOpacity>

              {/*<WikitudeView
                ref="wikitudeView"
                style={{ flex: 1 }}
                url={'https://yourserver.com/yourwikitudestudioproject/'}
                licenseKey={Wikitude_AR_LICENSE_KEY}
                feature={WikitudeView.Geo}
                onJsonReceived={this.onJsonReceived}
                onFinishLoading={this.onFinishLoading}
                onScreenCaptured={this.onScreenCaptured}
              />*/}
            </View>

            }
        </RNCamera>
      </View>
    );
  }
}
