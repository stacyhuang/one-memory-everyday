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

import api from '../Utils/api';
import Separator from './Helpers/Separator';


class Main extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2});
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      note: '',
      error: ''
    }
  }

  componentWillMount() {
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

  handleChange(event) {
    this.setState({
      note: event.nativeEvent.text
    });
  }

  handleSubmit() {
    // Todo: to pass in today's date instead of hardcoded date
    var memory = {
      date: '2016-03-22',
      type: 'note',
      text: this.state.note
    };

    this.setState({
      note: ''
    })

    api.addMemory(memory)
      .then((res) => {
        api.getMemories()
          .then((res) => {
            this.setState({
              dataSource: this.ds.cloneWithRows(res)
            })
          })
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
        <TextInput
          style={styles.searchInput}
          value={this.state.note}
          onChange={this.handleChange.bind(this)}
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
  buttonText: {
    fontSize: 18,
    color: 'white'
  },
  button: {
    height: 60,
    backgroundColor: '#48BBEC',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchInput: {
    height: 60,
    padding: 10,
    fontSize: 18,
    color: '#111',
    flex: 10
  },
  rowContainer: {
    flexDirection: 'column',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 95,
  },
  photo: {
    width: 75,
    height: 75,
    position: 'absolute',
    top: 10
  },
  noteWithPhoto: {
    marginLeft: 85
  },
  footerContainer: {
    backgroundColor: '#E3E3E3',
    alignItems: 'center',
    flexDirection: 'row'
  }
});

module.exports = Main;
