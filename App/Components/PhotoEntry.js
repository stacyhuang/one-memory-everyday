import React, {
  Component,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  StyleSheet
} from 'react-native';

import moment from 'moment';
import DB from '../Utils/db';
import RNFS from 'react-native-fs';

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
let imageDirPath = RNFS.DocumentDirectoryPath + '/images/';

class PhotoEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: ''
    }
  }

  componentDidMount() {
    this.props.events.addListener('submitNewEntry', this.handleSubmit.bind(this));
  }

  componentWillUnmount() {
    this.props.events.removeAllListeners();
  }

  handleChange(event) {
    this.setState({
      note: event.nativeEvent.text
    });
  }

  handleSubmit() {
    let currentDate = moment().format("YYYY-MM-DD");

    let memory = {
      date: currentDate,
      type: 'photo',
      image_url: this.props.image_url,
      text: this.state.note
    };

    this.setState({
      note: ''
    })

    DB.memories.add(memory)
      .then((res) => {
        this.props.onNewEntry();
        this.props.navigator.pop();
      })
  }

  render() {
    return (
      <View>
        <ScrollView style={styles.container}>
          <TextInput
          style={styles.noteInput}
          value={this.state.note}
          onChange={this.handleChange.bind(this)}
          multiline={true}
          autoFocus={true}
          maxLength={140}
          placeholder='Say something about this photo...' />
          <Image source={{uri: imageDirPath + this.props.image_url}} style={styles.photo} />
        </ScrollView>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: ScreenHeight
  },
  noteInput: {
    height: 110,
    padding: 10,
    fontSize: 18,
    color: '#111',
  },
  photo: {
    width: ScreenWidth,
    height: ScreenWidth,
  }
});

module.exports = PhotoEntry;
