import React, {Component} from 'react';
import {View, Text, Image, Modal, TouchableOpacity, SafeAreaView, FlatList, Platform, Alert, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { connect } from 'react-redux';
import styles from '../Styles/MapScreenStyles.js';
import MapView, { Marker } from 'react-native-maps';
import SearchBar from 'react-native-search-bar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import _, { range } from 'lodash';
import {API_KEY} from "@env";
import axios from 'axios';

class MapScreen extends Component{
  constructor(props){
      super();
      if (Platform.OS === "android") {
          this.requestLocationPermission();
      }
      this.state = {
        region: { 
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        },
        search: "",
        pressedMarkerImageUrl: "",
        pressedMarkerImageName: "",
        pressedMarkerUserName: "",
        pressedMarkerImageAlreadyLiked: false,
        predictions: [],
        markers: [],
        sketchesInfo: [],
        modalVisible: false,
        currentImagePressed: false,
        imageLikes: 0,
        userLikedSketches: []
      }
      this.handleChangeTextDebounced = _.debounce(this.handleChangeText, 1000);
  }

  async componentDidMount(){
    await this.getUserLocation();
  }

  async getUserLocation(){
    await Geolocation.getCurrentPosition(info =>
      this.setState( {region: { 
        latitude: info.coords.latitude,
        longitude: info.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}, ()=> {this.fetchImages()})
    );
  }

  async fetchImages(){
    let sketchLocation = [this.state.region['latitude'], this.state.region['longitude']];
    console.log("this is sketch location: " + sketchLocation);

    await axios({
      method: 'get',
      url: 'http://localhost:1234/api/image/getImages',
      params: {coordinates: JSON.stringify(sketchLocation)}
    })
    .then((response) => {
      this.setState({sketchesInfo: response['data']}, ()=>{console.log("data: " + JSON.stringify(this.state.sketchesInfo))});
      this.imageLocationParser();
      this.fetchUserLikedImages();
    }, (error) => {
      console.log(error)
    });
  }

  fetchUserLikedImages(){
    let email = this.props.email;
    axios({
      method: 'get',
      url: 'http://localhost:1234/api/image/getLikedImages',
      params: {user: email}
    })
    .then((response) => {
      this.setState({userLikedSketches: response['data']}, ()=>{console.log("data: " + JSON.stringify(this.state.userLikedSketches))});
    }, (error) => {
      console.log(error)
    });
  }

  imageLocationParser(){
    let coordinates = {};
    let imageInfo = this.state.sketchesInfo;
    let markers = this.state.markers;
    
    for(let i = 0; i < imageInfo.length; i++){
      coordinates['latitude'] = parseFloat(imageInfo[i]['latitude']);
      coordinates['longitude'] = parseFloat(imageInfo[i]['longitude']);
      markers.push(coordinates);
      coordinates = {};
    }
  
    this.setState({markers: markers}, ()=>{console.log(JSON.stringify(this.state.markers))});
  }

  findImageForPressedMarker(latitude, longitude){
    console.log(latitude);
    console.log(longitude);
    let sketchInfos = this.state.sketchesInfo;
    let userLikedSketches = this.state.userLikedSketches;
    let imageUrlForPressedMarker = '';
    let imageNameForPressedMarker = '';
    let user = '';
    let numberOfLikes = 0;

    for(let i = 0; i < sketchInfos.length; i++){
      if (latitude == sketchInfos[i]['latitude'] && longitude == sketchInfos[i]['longitude']){
        imageUrlForPressedMarker = sketchInfos[i]['url'];
        imageNameForPressedMarker = sketchInfos[i]['name'].split("_")[0];
        user = sketchInfos[i]['user'].split("@")[0];
        numberOfLikes = sketchInfos[i]['likes'];
      }
    }

    for(let i = 0; i < userLikedSketches.length; i++){
      if (imageNameForPressedMarker === userLikedSketches[i]['image']){
        this.setState({pressedMarkerImageAlreadyLiked: true});
      }
    }

    this.setState({pressedMarkerImageUrl: imageUrlForPressedMarker}, ()=>{console.log(this.state.pressedMarkerImageUrl)});
    this.setState({pressedMarkerImageName: imageNameForPressedMarker}, ()=>{console.log(this.state.pressedMarkerImageName)});
    this.setState({imageLikes: numberOfLikes}, ()=>{console.log(this.state.imageLikes)});
    this.setState({pressedMarkerUserName: user}, ()=>{console.log(this.state.pressedMarkerUserName)});
    this.setState({modalVisible: !this.state.modalVisible}, ()=>{console.log(this.state.modalVisible)});
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Diggraffiti",
          message: "Allow Digraffiti to access your location"
        }
      );
      if (!granted === PermissionsAndroid.RESULTS.GRANTED) {
        alert("Location access denied");
      }
    } catch (err) {
      console.log(err);
    }
  }

  onRegionChange = (region) => {
    this.setState({ region });
  };

  async handleChangeText(text){
    this.setState({ search: text }, () => {
      console.log(this.state.search)
    });
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=
    ${text}&location=${this.state.region.latitude}, ${this.state.region.longitude}&radius=2000`;
    try{
      const result = await fetch(url);
      const json =  await result.json();
      console.log(json.predictions.length);
      this.setState( {predictions: json.predictions} );
    } catch(err){
      console.log(err);
    }
  }

  async handleSelectedAddress(prediction){
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction['place_id']}&key=${API_KEY}`
    try{
      const result = await fetch(url);
      const json =  await result.json();
      this.setState( {region: { 
        latitude: json.result.geometry.location.lat,
        longitude: json.result.geometry.location.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }});
      const newState = this.state.markers.concat({ 
        latitude: json.result.geometry.location.lat,
        longitude: json.result.geometry.location.lng,
        latitudeDelta:.1,
        longitudeDelta: .1
      });
      this.setState({
        markers: newState,
        predictions: []
      });
    } catch(err){
      console.log(err);
    }
  }

  renderPrediction = ({ item }) => {
    return (
      <TouchableOpacity style={styles.prediction} onPress={() => this.handleSelectedAddress(item)}>
        <Text style={styles.text}>
          {item.description}
        </Text>
        <View style={styles.divider}/>
      </TouchableOpacity>
    );
  };

  jumpToCameraScreen(){
    this.props.navigation.navigate('CameraScreen');
  }

  updateImageLikes(){
    let image = this.state.pressedMarkerImageName;
    let email = this.props.email;

    this.state.pressedMarkerImageAlreadyLiked ? this.setState({imageLikes: this.state.imageLikes-1}, ()=>{console.log(this.state.imageLikes)}) : this.setState({imageLikes: this.state.imageLikes+1}, ()=>{console.log(this.state.imageLikes)})
    this.setState({pressedMarkerImageAlreadyLiked: !this.state.pressedMarkerImageAlreadyLiked}, ()=>{console.log(this.state.pressedMarkerImageAlreadyLiked)});

    axios({
      method: 'post',
      url: "http://localhost:1234/api/image/updateImageLikes",
      data: {user: email, imageName: image}
    })
    .then((response) => { 
      console.log(response);
    }, (error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <SearchBar
          value={this.state.search}
          onChangeText={text=>
            this.handleChangeTextDebounced(text)
          }
          textColor='black'  
        />

        {(this.state.search === "" || this.state.predictions.length === 0) ?
          <View style={styles.container}>
            <FlatList 
              style={styles.flatList1}
              data={this.state.predictions}
              renderItem={this.renderPrediction}
            />
            <MapView 
              region={this.state.region}
              style={styles.map1}
              followsUserLocation={true}
              showsMyLocationButton={true}     
              showsUserLocation={true}
            > 
              {this.state.markers.map((marker, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude
                  }}
                  onPress={() => this.findImageForPressedMarker(marker.latitude, marker.longitude)}
                />
              ))}
            </MapView>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {Alert.alert("Modal has been closed.");}}
              >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <TouchableOpacity onPress={() => {this.setState({modalVisible: false})}} style={styles.closeModalIcon}>
                  <AntDesign name="closecircle" size={20} color="red"/>       
                </TouchableOpacity>
                
                {!this.state.pressedMarkerImageAlreadyLiked ? 
                  <TouchableOpacity style={styles.unpressedLikeIcon} onPress={() => this.updateImageLikes()}> 
                    <EvilIcons name="heart" size={35} />       
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.pressedLikeIcon} onPress={() => this.updateImageLikes()}>
                    <AntDesign name="heart" color="red" size={22}/>       
                  </TouchableOpacity>
                }

                <Text style={styles.renderedSketchName}>{this.state.pressedMarkerUserName}'s {this.state.pressedMarkerImageName}</Text>
                <Image style={styles.renderedSketch} source={{uri: this.state.pressedMarkerImageUrl}}/>
                <Text style={styles.imageLikes}>{this.state.imageLikes}</Text>
                </View>
              </View>
            </Modal>

            <TouchableOpacity onPress={() => this.jumpToCameraScreen()} style={styles.cameraIcon}>
              <AntDesign name="camera" size={38} />       
            </TouchableOpacity>

          </View> : 
          <View style={styles.container}>
            <FlatList 
              style={styles.flatList2}
              data={this.state.predictions}
              renderItem={this.renderPrediction}
            />
            <MapView 
                region={this.state.region}
                style={styles.map2}
                followsUserLocation={true}
                showsMyLocationButton={true}     
                showsUserLocation={true}
            > 
              {this.state.markers.map((marker, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude
                  }}
                />
              ))}
            </MapView>
          </View>}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    email: state.loginReducer.email
  }
}

export default connect(mapStateToProps) (MapScreen);
