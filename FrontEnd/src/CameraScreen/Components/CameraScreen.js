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
import Geolocation from 'react-native-geolocation-service';

class CameraScreen extends Component {
  constructor(props) {
    super();
    if (Platform.OS === 'android') {
      this.requestPhoneFeatures()
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
      latitude: 0.0,
      longitude: 0.0
    }
  }

  async requestPhoneFeatures() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ]);
      return granted;
    }
    catch (err) {
      Warning(err);
    }
    return null;
  }
      

  jumpToMapScreen() {
    this.props.navigation.navigate('MapScreen');
  }

  closeSketchTools(){
    this.setState({paintBrushIconPressed: false});
    this.setState({modalVisible: false});
  }

  openSketchTools(){
    this.setState({paintBrushIconPressed: true});
    this.setState({modalVisible: true});
  }

  async captureImages(success, path){
    await this.captureBackground();
    await this.captureSketch(success, path);
    await this.getUserLocation();
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

  async getUserLocation(){
    Geolocation.getCurrentPosition(
    (position) => {
      this.setState({latitude: position['coords']['latitude']}), ()=>{console.log(this.state.latitude)};
      this.setState({longitude: position['coords']['longitude']}), ()=>{console.log(this.state.longitude)};
    },
    (error) => {
      console.log(error.code, error.message);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  async sendSketchToBackEnd(){
    let email = this.props.email;
    let sketchLocation = [this.state.latitude, this.state.longitude];
    let imageFileUri = this.state.mergedImageURI;
    let splittedFileUri = imageFileUri.split("/");
    let file = splittedFileUri[splittedFileUri.length-1];
    let originalFileName = file.split('.')[0];
    file = file.replace(originalFileName, this.state.imageName);

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
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {Alert.alert("Modal has been closed.");}}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.nameSketchText}>Name Your Sketch</Text>
                <TextInput
                  placeholder="Enter a sketch name"
                  autoFocus={true}
                  placeholderTextColor='#000000'
                  style={styles.imageNameInput}
                  onChangeText={(imageName) => this.setState({imageName})}
                />
                <Entypo name="pencil" color={'#2d2d2d'} size={20} style={styles.editIcon} />
                <TouchableOpacity style={styles.cancelButton} onPress={() => {this.setState({modalVisible: false})}}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitButton} onPress={() => this.setState({modalVisible: false})}>
                  <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        
          {this.state.paintBrushIconPressed ?
            <RNSketchCanvas
              defaultStrokeIndex={0}
              defaultStrokeWidth={5}
              containerStyle={styles.sketchContainer}
              canvasStyle={styles.sketchCanvas}
              onClosePressed={() => this.closeSketchTools()}
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
              <TouchableOpacity style={styles.paintBrush} onPress={() => this.openSketchTools()}>
                <FontAwesome5 name="paint-brush" size={50}/>
              </TouchableOpacity>
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