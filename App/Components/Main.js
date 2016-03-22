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
        debugger
        console.log('Error loading memories', error);
      })
  }

  handleNewNote() {
    this.props.navigator.push({
      title: 'New Note',
      component: Note,
      passProps: { onNewNote: this.getMemories.bind(this) }
    });
  }

  handleNewPhoto() {
    //
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
          onPress={this.handleNewPhoto.bind(this)}
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
