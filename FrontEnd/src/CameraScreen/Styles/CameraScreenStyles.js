import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#be0000',
    justifyContent: 'center', 
    alignItems: 'center', 
    flex: 1
  },

  mapMarkerIcon: {
    position: 'absolute',
    right: '8%',
    top: 15
  },

  strokeColorButton: {
    marginHorizontal: 2.5, 
    marginVertical: 8, 
    width: 30, 
    height: 30,
    borderRadius: 15,
  },
    
  strokeWidthButton: {
    width: 40, 
    height: 40, 
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    top: 3,
    left: -10
  },
    
  close: {
    height: 30, 
    width: 60,
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center', 
    top: 8,
  },

  paintBrush: {
    position: 'absolute',
    top: 470,
    left: '6%'
  },

  trash: {
    height: 30, 
    width: 60,
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center',
    top: 8,
    left: 7,
  },

  save: {
    marginHorizontal: 2.5, 
    marginVertical: 8, 
    height: 30, 
    width: 60,
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 5,
    left: 5
  },

  eraser: {
    height: 30, 
    width: 60,
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center',
    top: 8,
    left: 0,
  },

  sketchContainer: {
    backgroundColor: 'transparent', 
    flex: 1
  },

  sketchCanvas: {
    backgroundColor: 'transparent', 
    flex: 1,
  },

  cameraView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, 
    bottom: 0
  },

  savedImage: {
    width: 200, 
    height: 200
  }

});