import React, {Component} from 'react';
import {View, Text, Image, Modal, TouchableOpacity, SafeAreaView, FlatList, Platform, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import styles from '../Styles/MapScreenStyles.js';
import MapView, { Marker } from 'react-native-maps';
import SearchBar from 'react-native-search-bar';
import _, { range } from 'lodash';
import {API_KEY} from "@env";
import axios from 'axios';

export default class MapScreen extends Component{
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
          predictions: [],
          markers: [],
          sketchesInfo: [],
          visible: false
        }
        this.handleChangeTextDebounced = _.debounce(this.handleChangeText, 1000);
    }

    async componentDidMount(){
      await this.fetchImages();
      await Geolocation.getCurrentPosition(info =>
        this.setState( {region: { 
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }})
      );
      await this.imageLocationParser();
    }

    async fetchImages(){
      let sketchLocation = [40.8320147, -73.872721]; //dummy data will return one image from API. Should be swapped with user's current lat/log

      await axios({
        method: 'get',
        url: 'http://localhost:1234/api/image/getImages',
        params: {coordinates: JSON.stringify(sketchLocation)}
      })
      .then((response) => {
        this.setState({sketchesInfo: response['data']}, ()=>{console.log(JSON.stringify(this.state.sketchesInfo))});

      }, (error) => {
        console.log(error)
      });
    }

    async imageLocationParser(){
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
      let imageUrlForPressedMarker = '';
      let imageNameForPressedMarker = '';

      for(let i = 0; i < sketchInfos.length; i++){
        if (latitude == sketchInfos[i]['latitude'] && longitude == sketchInfos[i]['longitude']){
          imageUrlForPressedMarker = sketchInfos[i]['url'];
          imageNameForPressedMarker = sketchInfos[i]['name'];
        }
      }
      console.log("url: " + imageUrlForPressedMarker);
      console.log("name:" + imageNameForPressedMarker);
      this.renderImageForPressedMarker(imageUrlForPressedMarker, imageNameForPressedMarker);
    }

    renderImageForPressedMarker(imageUrl, imageName){
      this.setState({visible: true}, ()=>{console.log(this.state.visible)});
      return(
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {Alert.alert("Modal has been closed.");}}
          >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>{imageName}</Text>
            </View>
          </View>
        </Modal>
      )
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
            </View>: 
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