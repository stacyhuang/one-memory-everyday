import React, {
  Component,
  Text,
  View,
  Image,
  StyleSheet,
  ListView,
  TextInput,
  TouchableHighlight
} from 'react-native';

var ImagePickerManager = require('NativeModules').ImagePickerManager;
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import Note from './Note';
import api from '../Utils/api';
import Separator from './Helpers/Separator';

class Main extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      imageSource: null
    }
  }

  componentWillMount() {
    this.getMemories();
  }

  getMemories() {
    api.getMemories()
      .then((res) => {
        if (res === null) {
          console.log('No memories found');
        } else {
          this.setState({
            dataSource: this.ds.cloneWithRows(res)
          });
        }
      })
      .catch((error) => {
        console.log('Error loading memories', error);
      })
  }

  launchPicker() {
    var options = {
      title: 'Select Photo', // specify null or empty string to remove the title
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      maxWidth: 100, // photos only
      maxHeight: 100, // photos only
      aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
      quality: 0.2, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: false, // Built in functionality to resize/reposition the image after selection
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
      }
    };

    ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        const source = {uri: response.uri.replace('file://', ''), isStatic: true};

        this.setState({
          imageSource: source
        });

        this.handleNewPhoto();
      }
    });
  }

  handleNewNote() {
    this.props.navigator.push({
      title: 'New Note',
      component: Note,
      passProps: { onNewNote: this.getMemories.bind(this) }
    });
  }

  handleNewPhoto() {
    var currentDate = moment().format("YYYY-MM-DD");
    var memory = {
      date: currentDate,
      type: 'photo',
      image_url: this.state.imageSource.uri,
      text: 'Some note'
    };

    api.addMemory(memory)
      .then((res) => {
        this.getMemories();
      })
      .catch((error) => {
        console.log('Request failed', error);
        this.setState({ error });
      });
  }

  renderRow(rowData) {
    var image = rowData.image_url ? <Image source={{uri: rowData.image_url}} style={styles.photo} /> : <View></View>;
    return (
      <View>
        <View style={styles.rowContainer}>
          {image}
          <Text style={rowData.type === 'photo' && styles.noteWithPhoto}>
            {rowData.text}
          </Text>
        </View>
        <Separator />
      </View>
    )
  }

  footer() {
    return (
      <View style={styles.footerContainer}>
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleNewNote.bind(this)}
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

  render() {
    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
        {this.footer()}
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  rowContainer: {
    flexDirection: 'column',
    padding: 10,
    justifyContent: 'center',
    height: 95, // photo height + top and botton paddings
  },
  photo: {
    width: 75,
    height: 75,
    position: 'absolute',
    top: 10 // container top padding
  },
  noteWithPhoto: {
    marginLeft: 85 // photo width + margin of 10
  },
  footerContainer: {
    backgroundColor: '#272727',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  button: {
    width: 60,
    height: 60,
    // backgroundColor: '#48BBEC',
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white'
  }
});

module.exports = Main;
