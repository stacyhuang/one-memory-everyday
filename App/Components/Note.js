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

class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: ''
    }
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
        this.props.onNewNote();
        this.props.navigator.pop();
      })
      .catch((error) => {
        console.log('Request failed', error);
        this.setState({ error });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          value={this.state.note}
          onChange={this.handleChange.bind(this)}
          multiline={true}
          maxLength={140}
          placeholder='New Note' />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          underlayColor='#88D4F5'>
            <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  searchInput: {
    height: ScreenHeight - 65 - 60, // screen height - title bar height - button height
    marginTop: 65,
    padding: 10,
    fontSize: 18,
    color: '#111',
    justifyContent: 'flex-start',
  },
  button: {
    height: 60,
    backgroundColor: '#48BBEC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white'
  }
});


module.exports = Note;
