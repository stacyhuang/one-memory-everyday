import React, {
  Component,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  StyleSheet,
  PropTypes
} from 'react-native';

import RNFS from 'react-native-fs';
import moment from 'moment';

let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
let imageDirPath = RNFS.DocumentDirectoryPath + '/images/';

class Entry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      note: ''
    }
  }

  componentDidMount() {
    this.props.eventEmitter.addListener('onSubmitNewEntry', this.handleSubmit.bind(this));
  }

  componentWillUnmount() {
    this.props.eventEmitter.removeAllListeners();
  }

  handleChange(event) {
    this.setState({
      note: event.nativeEvent.text
    });
  }

  handleSubmit() {
    let currentDate = moment().format("YYYY-MM-DD");
    let { image_url, memory_type, actions } = this.props;
    image_url = image_url || '';

    let memory = {
      date: currentDate,
      memory_type: memory_type,
      image_url: image_url,
      text: this.state.note
    };

    this.setState({ note: '' });
    actions.addToDB(memory);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.noteInput}
          value={this.state.note}
          onChange={this.handleChange.bind(this)}
          multiline={true}
          autoFocus={true}
          maxLength={140}
          placeholder='New Memory' />
        <Image source={{uri: imageDirPath + this.props.image_url}} style={styles.photo} />
      </View>
    )
  }
}

Entry.propTypes = {
  image_url: PropTypes.string,
  memory_type: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  // eventEmitter: ?
};


var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 64,
    marginBottom: 49
  },
  noteInput: {
    height: 110,
    padding: 10,
    fontSize: 18,
    color: '#111'
  },
  photo: {
    width: ScreenWidth,
    height: ScreenWidth,
  }
});

module.exports = Entry;
