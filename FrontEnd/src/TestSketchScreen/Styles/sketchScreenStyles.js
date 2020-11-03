import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#be0000',
    justifyContent: 'center', 
    alignItems: 'center', 
    flex: 1
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
    bottom: '5%',
    left: '-45%'
  },

  trash: {
    height: 30, 
    width: 60,
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center',
    top: 8,
    left: -15,
    marginLeft: 50
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
    left: -5
  },

  eraser: {
    height: 30, 
    width: 60,
    backgroundColor: 'transparent', 
    justifyContent: 'center', 
    alignItems: 'center',
    top: 8,
    left: 20,
  },

  sketchContainer: {
    backgroundColor: 'transparent', 
    flex: 1
  },

  sketchCanvas: {
    backgroundColor: 'transparent', 
    flex: 1,
  },

});