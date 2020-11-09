import React, {Component} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {WikitudeView} from 'react-native-wikitude-sdk';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Share from "react-native-share";
import styles from '../Styles/test.js';
import {Wikitude_AR_LICENSE_KEY} from "@env"

const url = 'ARchitectExamples/11_Video_2_PlaybackStates/index'
const config = {
    licenseKey:
      Wikitude_AR_LICENSE_KEY,
    url: url,
  };
class Wikitude extends Component{
    constructor(props){
        super();

        this.wikitudeView = React.createRef(null);
        this.state = {
            isFocus: false
        }
    }


  componentDidMount(){
    const subscribeFocus = this.props.navigation.addListener('blur', () => {
      console.log('Is blur');
      if (this.wikitudeView.current) {
        //wikitudeView.current.stopRendering();
      }
      this.setState(({isFocus: false}));
    });
    this.props.navigation.addListener('willFocus', () => {
      console.log('Is focus');
      this.setState(({isFocus: true}));
      if (this.wikitudeView.current) {
        //wikitudeView.current.resumeRendering();
      }
    });
    //navigation.setOptions({
    //    headerRight: () => (
    //      <Icon name="camera" size={40} onPress={() => takeScreenshot()} />
    //    ),
    //  });
    return subscribeFocus;
  }

  
  takeScreenshot = () => {
    if (this.wikitudeView.current) {
      this.wikitudeView.current.captureScreen(true);
    }
  };

  onFinishLoading = event => {
    // event.success = true
    //This event is called when the html is finish loaded
    //For fail event, use onFailLoading
    console.log('On Finish Loading');
  };
  onJsonReceived = object => {
    console.log(object);
  };

  onFailLoading = event => {
    console.log(event);
  };

  onScreenCaptured = event => {
    if(!event.image) return;
    
    Share.open({
      message: 'Share this awesome AR with Wikitude',
      title: 'SpinAR Team',
      url: event.image,
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  
  render(){
      console.log("screen is working")
      return(
          <View>
            
            {this.state.isFocus ? 
            
                <SafeAreaView />
            :
            <SafeAreaView style={styles.container}>
                <WikitudeView
                ref={this.wikitudeView}
                licenseKey={config.licenseKey}
                url={config.url}
                style={styles.AR}
                onFailLoading={(e) => this.onFailLoading(e)}
                onJsonReceived={(e)=>this.onJsonReceived(e)}
                onFinishLoading={(e) =>this.onFinishLoading(e)}
                onScreenCaptured={(e)=>this.onScreenCaptured(e)}
                />
            </SafeAreaView>
            }
            </View>
            
      )
    }
};

export default Wikitude;
