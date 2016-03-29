import React, {
  Component,
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  NativeModules
} from 'react-native';

const ImagePickerManager = NativeModules.ImagePickerManager;
import ImagePickerOptions from '../Utils/ImagePickerOptions';
import Icon from 'react-native-vector-icons/FontAwesome';
import Main from './Main';
import PhotoTimeline from './PhotoTimeline';

class Footer extends Component {
  launchPicker() {
    ImagePickerManager.showImagePicker(ImagePickerOptions.photo, (res) => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePickerManager Error: ', res.error);
      } else {
        let src = res.uri;
        let index = src.indexOf('images'); // index of 'i'

        if (index > -1) {
          index += 7; // index of first character of the image name
          src = src.slice(index);
        }

        const source = {uri: src, isStatic: true};

        this.props.handleNewPhoto(source);
      }
    });
  }

  routeToListTimeline() {
    this.props.navigator.push({
      title: 'One Memory Everyday',
      component: Main,
      leftButtonTitle: ' '
    });
  }

  routeToPhotoTimeline() {
    this.props.navigator.push({
      title: 'One Memory Everyday',
      component: PhotoTimeline,
      leftButtonTitle: ' '
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight
          style={styles.button}
          onPress={this.props.handleUpdateView.bind(this, 'list')}
          underlayColor='#88D4F5'>
            <Icon name="th-list" style={styles.buttonText} />
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={this.props.handleUpdateView.bind(this, 'photo')}
          underlayColor='#88D4F5'>
            <Icon name="th" style={styles.buttonText} />
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={this.props.handleNewNote}
          underlayColor='#88D4F5'>
            <Icon name="pencil" style={styles.buttonText} />
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={this.launchPicker.bind(this)}
          underlayColor='#88D4F5'>
            <Icon name="camera-retro" style={styles.buttonText}/>
        </TouchableHighlight>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#272727',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    width: 80,
    height: 50,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 32, // size of icon
    color: 'white'
  }
});

module.exports = Footer;
