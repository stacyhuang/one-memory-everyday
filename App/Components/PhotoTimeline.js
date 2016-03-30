import React, {
  Component,
  Text,
  View,
  Image,
  StyleSheet,
  ListView,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

import RNFS from 'react-native-fs';
import MemoryView from './MemoryView';
import Separator from './Helpers/Separator';
import DB from '../Utils/db';

let imageDirPath = RNFS.DocumentDirectoryPath + '/images/';
let ScreenWidth = Dimensions.get("window").width;

class PhotoTimeline extends Component {
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
  }

  getMemories() {
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

  _navigate(memory) {
    this.props.navigator.push({
      component: MemoryView,
      passProps: {
        memory: memory
      }
    })
  }

  renderRow(rowData, sectionID, rowID) {
    let image = rowData.image_url ? <Image source={{uri: imageDirPath + rowData.image_url}} style={styles.photo} /> : <View></View>;

    return (
      <View>
        <TouchableHighlight
          onPress={this._navigate.bind(this, rowData)}
          underlayColor='#F8F8F8'>
          <View style={styles.rowContainer}>
            {image}
          </View>
        </TouchableHighlight>
        <Separator />
      </View>
    )
  }

  render() {
    return (
      <ListView
        contentContainerStyle={styles.list}
        automaticallyAdjustContentInsets={false}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)} />
    )
  }
}

var styles = StyleSheet.create({
  list: {
    flex: 1,
    marginTop: 64,
    marginBottom: 49,
    padding: 7.5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  rowContainer: {
    width: (ScreenWidth - 60) / 3,
    height: (ScreenWidth - 60) / 3,
    margin: 7.5
  },
  photo: {
    width: (ScreenWidth - 60) / 3,
    height: (ScreenWidth - 60) / 3,
  }
});

module.exports = PhotoTimeline;
