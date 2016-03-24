import React, {
  Component,
  Text,
  View,
  TextInput,
  Dimensions,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

import moment from 'moment';
import api from '../Utils/api';

let ScreenHeight = Dimensions.get("window").height;

class NoteEntry extends Component {
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
    var currentDate = moment().format("YYYY-MM-DD");
    var memory = {
      date: currentDate,
      type: 'note',
      text: this.state.note
    };

    this.setState({
      note: ''
    })

    api.addMemory(memory)
      .then((res) => {
        this.props.onNewEntry();
        this.props.navigator.pop();
      })
      .catch((error) => {
        console.log('Request failed', error);
      });
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
          placeholder='New Note' />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 65,
  },
  noteInput: {
    height: ScreenHeight,
    padding: 10,
    fontSize: 18,
    color: '#111',
  }
});


module.exports = NoteEntry;
