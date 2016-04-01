import React, {
  Component,
  Text,
  View,
  Image,
  TextInput,
  Dimensions,
  StyleSheet
} from 'react-native';

import * as memoryActions from '../actions/memoryActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
    this.props.eventEmitter.addListener('submitNewEntry', this.handleSubmit.bind(this));
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

    let memory = {
      date: currentDate,
      memory_type: 'photo',
      image_url: this.props.image_url,
      text: this.state.note
    };

    this.setState({
      note: ''
    });

    this.props.actions.addToDB(memory);
    this.props.routeToHome();
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
        placeholder='Say something about this photo...' />
        <Image source={{uri: imageDirPath + this.props.image_url}} style={styles.photo} />
      </View>
    )
  }
}

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

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(memoryActions, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(PhotoEntry);
