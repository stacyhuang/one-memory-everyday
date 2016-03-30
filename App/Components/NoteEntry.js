import React, {
  Component,
  Text,
  View,
  TextInput,
  Dimensions,
  StyleSheet
} from 'react-native';

import moment from 'moment';
import DB from '../Utils/db';

let ScreenHeight = Dimensions.get("window").height;

class NoteEntry extends Component {
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
      type: 'note',
      text: this.state.note
    };

    this.setState({
      note: ''
    });

    DB.memories.add(memory)
      .then((res) => {
        this.props.routeToHome();
      })
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
    marginTop: 64,
    marginBottom: 49
  },
  noteInput: {
    flex: 1,
    height: ScreenHeight,
    padding: 10,
    fontSize: 18,
    color: '#111'
  }
});

module.exports = NoteEntry;
