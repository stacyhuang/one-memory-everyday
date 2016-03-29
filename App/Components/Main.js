import React, {
  Component,
  Text,
  View,
  StyleSheet,
  ListView,
  Dimensions
} from 'react-native';

import moment from 'moment';
import EventEmitter from 'EventEmitter';
import Subscribable from 'Subscribable';
import RNFS from 'react-native-fs';
import ListTimeline from './ListTimeline';
import PhotoTimeline from './PhotoTimeline';
import NoteEntry from './NoteEntry';
import PhotoEntry from './PhotoEntry';
import Footer from './Footer';
import DB from '../Utils/db';

let ScreenHeight = Dimensions.get("window").height;

class Main extends Component {
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });

    this.state = {
      view: 'list',
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

  handleNewPhoto(source) {
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

  handleUpdateView(view) {
    this.setState({
      view: view
    });
  }

  render() {
    if (this.state.view === 'list') {
      view = <ListTimeline
        style={styles.timeline}
        navigator={this.props.navigator}
        dataSource={this.state.dataSource}
        getMemories={this.getMemories.bind(this)} />
    } else {
      view = <PhotoTimeline
        style={styles.timeline}
        navigator={this.props.navigator}
        dataSource={this.state.dataSource}
        getMemories={this.getMemories.bind(this)} />
    }

    return (
      <View style={styles.container}>
        {view}
        <Footer
          navigator={this.props.navigator}
          handleNewNote={this.handleNewNote.bind(this)}
          handleNewPhoto={this.handleNewPhoto.bind(this)}
          handleUpdateView={this.handleUpdateView.bind(this)} />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

module.exports = Main;
