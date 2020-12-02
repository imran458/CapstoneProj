import React, {Component} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView, FlatList, Platform, PermissionsAndroid} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import styles from '../Styles/MapScreenStyles.js';
import MapView, { Marker } from 'react-native-maps';
import SearchBar from 'react-native-search-bar';
import _ from 'lodash';
import env from 'react-native-config';
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
          sketchesInfo: []
        }
        this.handleChangeTextDebounced = _.debounce(this.handleChangeText, 1000);
    }

    componentDidMount(){
      this.fetchImages();
      Geolocation.getCurrentPosition(info =>
        this.setState( {region: { 
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }})
      );
    }

    fetchImages(){
      let sketchLocation = [40.8320147, -73.872721]; //dummy data will return one image from API. Should be swapped with user's current lat/log

      axios({
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
        this.setState({ region }, () => {
            //console.log("REGION:", this.state.region);
        });
    };

    async handleChangeText(text){
      this.setState({ search: text }, () => {
        console.log(this.state.search)
      });
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${env.API_KEY}&input=
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
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction['place_id']}&key=${env.API_KEY}`
      try{
        const result = await fetch(url);
        const json =  await result.json();
        //console.log(json);
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
        }, () => {
          //console.log("MARKERS: ", this.state.markers, this.state.predictions);
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