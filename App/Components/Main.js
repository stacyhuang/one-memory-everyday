import React, {
  Component,
  Text,
  View,
  Image,
  StyleSheet,
  ListView,
  TextInput,
  TouchableHighlight,
  NativeModules
} from 'react-native';

const ImagePickerManager = NativeModules.ImagePickerManager;
import moment from 'moment';
import EventEmitter from 'EventEmitter';
import Subscribable from 'Subscribable';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeout from 'react-native-swipeout';
import NoteEntry from './NoteEntry';
import PhotoEntry from './PhotoEntry';
import MemoryView from './MemoryView';
import Separator from './Helpers/Separator';
import ImagePickerOptions from '../Utils/ImagePickerOptions';
import DB from '../Utils/db';

class Main extends Component {
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      imageSource: null
    }
  }

  componentWillMount() {
    this.getMemories();
    this.eventEmitter = new EventEmitter();
  }

  onSubmitNewEntry() {
    this.eventEmitter.emit('submitNewEntry');
  }

  getMemories() {
    // DB.memories.destroy();
    DB.memories.find()
      .then((res) => {
        if (res === null) {
          console.log('No memories found');
        } else {
          this.setState({
            dataSource: this.ds.cloneWithRows(res)
          });
        }
      });
  }

  deleteMemory(id) {
    DB.memories.removeById(id)
      .then((res) => {
        this.getMemories();
      })
  }

  launchPicker() {
    ImagePickerManager.showImagePicker(ImagePickerOptions.photo, (res) => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePickerManager Error: ', res.error);
      } else {
        const source = {uri: res.uri.replace('file://', ''), isStatic: true};

        this.setState({
          imageSource: source
        });

        this.props.navigator.push({
          title: 'New Memory',
          component: PhotoEntry,
          rightButtonTitle: 'Submit',
          leftButtonTitle: 'Cancel',
          onRightButtonPress: this.onSubmitNewEntry.bind(this),
          onLeftButtonPress: () => this.props.navigator.pop(),
          passProps: {
            image_url: this.state.imageSource.uri,
            onNewEntry: this.getMemories.bind(this),
            events: this.eventEmitter
          },
        });
      }
    });
  }

  handleNewNote() {
    this.props.navigator.push({
      title: 'New Memory',
      component: NoteEntry,
      rightButtonTitle: 'Submit',
      leftButtonTitle: 'Cancel',
      onRightButtonPress: this.onSubmitNewEntry.bind(this),
      onLeftButtonPress: () => this.props.navigator.pop(),
      passProps: {
        onNewEntry: this.getMemories.bind(this),
        events: this.eventEmitter
      }
    });
  }

  handleDisplayMemory(memory) {
    this.props.navigator.push({
      title: 'One Memory Everyday',
      component: MemoryView,
      leftButtonTitle: 'Back',
      onLeftButtonPress: () => this.props.navigator.pop(),
      passProps: {
        memory: memory
      }
    });
  }

  renderRow(rowData, sectionID, rowID) {
    let image = rowData.image_url ? <Image source={{uri: rowData.image_url}} style={styles.photo} /> : <View></View>;
    let date = moment(rowData.date).format('MMMM DD');

    let swipeBtns = [{
      text: 'Delete',
      backgroundColor: 'red',
      underlayColor: '#F8F8F8',
      onPress: () => { this.deleteMemory(rowData._id) }
    }];

    return (
      <Swipeout right={swipeBtns}
        autoClose='true'
        backgroundColor='transparent'>
        <TouchableHighlight
          onPress={this.handleDisplayMemory.bind(this, rowData)}
          underlayColor='#F8F8F8'>
          <View style={styles.rowContainer}>
            {image}
            <View style={[styles.rowContainerRight, rowData.type === 'photo' && styles.rowContainerRightWithPhoto]}>
              <Text style={styles.noteContainer}>{rowData.text}</Text>
              <Text style={styles.dateContainter}>{date}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <Separator />
      </Swipeout>
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
          renderRow={this.renderRow.bind(this)} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    height: 95, // photo height + top and bottom paddings
  },
  photo: {
    width: 75,
    height: 75,
    position: 'absolute',
    top: 10 // container top padding
  },
  rowContainerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowContainerRightWithPhoto: {
    marginLeft: 85 // photo width + margin of 10
  },
  noteContainer: {
    flex: 1,
    color: '#494949',
    fontSize: 16,
    lineHeight: 22
  },
  dateContainter: {
    backgroundColor: '#48BBEC',
    textAlign: 'center',
    width: 75,
    height: 75,
    padding: 5,
    paddingTop: 14, // Todo: use flexbox to vertically align intead of brute force
    lineHeight: 22, // Todo: use flexbox to vertically align intead of brute force
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 5
  },
  footerContainer: {
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

module.exports = Main;
