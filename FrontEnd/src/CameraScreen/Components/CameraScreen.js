import React, {Component} from 'react';
import {View, TouchableOpacity, PermissionsAndroid, Platform, Modal, Text, TextInput} from 'react-native';
import styles from '../Styles/CameraScreenStyles.js';
import {RNCamera} from 'react-native-camera';
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ViewShot from "react-native-view-shot";
import RNImageTools from 'react-native-image-tools-wm';
import { connect } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import GetLocation from 'react-native-get-location';

class CameraScreen extends Component {
  constructor(props) {
    super();
    if (Platform.OS === 'android') {
      this.requestCameraPermission();
      this.requestStorageWritePermissions();
      this.requestStorageReadPermissions();
      this.requestCoarseLocation();
    }
    console.log(props);
    this.viewShotRef = React.createRef();

    this.state = {
      paintBrushIconPressed: false,
      imageName: '',
      modalVisible: false,
      sketchImageURI: '',
      backgroundImageURI: '',
      mergedImageURI: '',
    }
  }

  async requestStorageReadPermissions() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Diggraffiti',
          message: 'Let Diggrafiti Read From External Storage',
        },
      );
      granted === PermissionsAndroid.RESULTS.GRANTED ? console.log('You can read from external storage') : console.log('Cannot read from external storage');
    } catch (err) {
      console.warn(err);
    }
  }

  async requestStorageWritePermissions() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Diggraffiti',
          message: 'Let Diggrafiti Write to External Storage',
        },
      );
      granted === PermissionsAndroid.RESULTS.GRANTED ? console.log('You can write to external storage') : console.log('Cannot write to external storage');
    } catch (err) {
      console.warn(err);
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
      granted === PermissionsAndroid.RESULTS.GRANTED ? console.log('You can use the camera') : console.log('Camera permission denied');
    } catch (err) {
      console.warn(err);
    }
  }
  
  async requestCoarseLocation(){
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: 'Diggraffiti',
          message: 'Let Diggrafiti Access Coarse Location',
        },
      );
      granted === PermissionsAndroid.RESULTS.GRANTED ? console.log('Coarse Location Accessible') : console.log('Coarse Location Not Accessible');
    } catch (err) {
      console.warn(err);
    }
  }

  jumpToMapScreen() {
    this.props.navigation.navigate('MapScreen');
  }

  paintBrushPressed(){
    this.setState({paintBrushIconPressed: !this.state.paintBrushIconPressed});
  }

  async captureImages(succes, path){
    await this.captureBackground();
    await this.captureSketch(succes, path);
    this.getUserLocation();
    this.imageMerger();
  }

  imageMerger(){
    RNImageTools.merge([this.state.backgroundImageURI,this.state.sketchImageURI]).then(({ uri, width, height }) => {
      this.setState({mergedImageURI: uri}),()=>{console.log(this.state.mergedImageURI)};
      this.sendSketchToBackEnd();
  }).catch(console.error);
    
  }

  async captureSketch(success, path){
    let url = '';
    if (success){
      url = "file://" + path;
      this.setState({sketchImageURI: url},()=>{console.log(this.state.sketchImageURI)});
    }else{
      console.log("Image didn't save!");
    }
    return url;
  }

  async captureBackground(){
    let backgroundURI = await this.viewShotRef.current.capture().then(uri => uri);
    this.setState({backgroundImageURI: backgroundURI}), ()=>{console.log(this.state.backgroundImageURI)};
  }

  getUserLocation(){
    GetLocation.getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 15000,
    })
    .then(location => {
      console.log(location);
    })
    .catch(error => {
      const { code, message } = error;
      console.warn(code, message);
    })
  }

  sendSketchToBackEnd(){
    let email = this.props.email;
    let sketchLocation = [23.4556, 46.435] //dummy data ;
    let imageFileUri = this.state.mergedImageURI;
    let splittedFileUri = imageFileUri.split("/");
    let file = splittedFileUri[splittedFileUri.length-1];

    
    RNFetchBlob.fetch('POST', 'http://localhost:1234/api/image/upload', {
      'Content-Type' : 'multipart/form-data',
    },[
      {name: "file", filename : file, data: RNFetchBlob.wrap(imageFileUri)},
      {name: 'user', data: email},
      {name: 'coordinates', data : JSON.stringify(sketchLocation)}
    ]
  ).then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  })
  }

  render() {
    return (
      <ViewShot style={styles.container} ref={this.viewShotRef} options={{ format: "png", quality: 0.9 }}> 
        <RNCamera
          ref={(ref) => {this.CameraScreen = ref;}}
          style={styles.cameraView}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.auto}
          captureAudio={false}>
        
          {this.state.paintBrushIconPressed ?
            <RNSketchCanvas
              defaultStrokeIndex={0}
              defaultStrokeWidth={5}
              containerStyle={styles.sketchContainer}
              canvasStyle={styles.sketchCanvas}
              onClosePressed={() => this.paintBrushPressed()}
              closeComponent={<View style={styles.close}><MaterialCommunityIcons name="window-close" size={40}/></View>}
              clearComponent={<View style={styles.trash}><Fontisto name="trash" size={35}/></View>}
              eraseComponent={<View style={styles.eraser}><MaterialCommunityIcons name="eraser" size={45} /></View>}
              strokeComponent={color => (<View style={[{ backgroundColor: color }, styles.strokeColorButton]}/>)}
              saveComponent={<View style={styles.save}><Entypo name="save" size={40} style={styles.facebookIcon}/></View>}
              savePreference={() => {return {folder: null, filename: String(Math.ceil(Math.random() * 100000000)), transparent: true, imageType: 'png'}}}
              onSketchSaved={( success, path)=> this.captureImages(success, path)} 
              strokeSelectedComponent={(color) => {return (<View style={[{backgroundColor: color, borderWidth: 2 }, styles.strokeColorButton]}/>)}}
              strokeWidthComponent={(w) => {return (<View style={styles.strokeWidthButton}><View  style={{backgroundColor: 'white', marginHorizontal: 2.5,width: Math.sqrt(w / 3) * 10, height: Math.sqrt(w / 3) * 10, borderRadius: Math.sqrt(w / 3) * 10 / 2 }} /></View>)}}
            />
            : 
            <View>
              <TouchableOpacity style={styles.mapMarkerIcon}>
                <Fontisto name="map-marker-alt" size={42} onPress={() => this.jumpToMapScreen()}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.paintBrush} onPress={() => this.paintBrushPressed()}>
                <FontAwesome5 name="paint-brush" size={50}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editIcon} onPress={() => { this.setState({modalVisible: true})}}>
                <Entypo name="pencil" color={'#2d2d2d'} size={45} />
              </TouchableOpacity>

              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {Alert.alert("Modal has been closed.");}}
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <TextInput
                      placeholder="Please enter a name for the sketch"
                      autoFocus={true}
                      placeholderTextColor='#000000'
                      style={styles.imageNameInput}
                      onChangeText={(imageName) => this.setState({imageName})}
                    />
                    <TouchableOpacity style={{ ...styles.cancelButton, backgroundColor: "grey" }} onPress={() => {this.setState({modalVisible: false})}}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>
            }
        </RNCamera>
      </ViewShot>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    email: state.loginReducer.email
  }
}

export default connect(mapStateToProps) (CameraScreen);