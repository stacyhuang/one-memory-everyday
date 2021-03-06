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
import * as memoryActions from '../actions/memoryActions';
import Memory from '../components/Memory';
import Separator from '../components/Helpers/Separator';

let imageDirPath = RNFS.DocumentDirectoryPath + '/images/';
let ScreenWidth = Dimensions.get("window").width;

class Grid extends Component {
  constructor(props) {
    super(props);

    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    });
  }

  _navigate(memory) {
    this.props.navigator.push({
      component: Memory,
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
    const dataSource = this.dataSource.cloneWithRows(this.props.memory);

    return (
      <ListView
        contentContainerStyle={styles.list}
        automaticallyAdjustContentInsets={false}
        dataSource={dataSource}
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

module.exports = Grid;
