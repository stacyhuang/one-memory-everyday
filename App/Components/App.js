import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  TabBarIOS,
  NativeModules
} from 'react-native';

const ImagePickerManager = NativeModules.ImagePickerManager;
import ImagePickerOptions from '../Utils/ImagePickerOptions';
import Icon from 'react-native-vector-icons/FontAwesome';
import EventEmitter from 'EventEmitter';
import Subscribable from 'Subscribable';
import ListTimeline from './ListTimeline';
import PhotoTimeline from './PhotoTimeline';
import MemoryView from './MemoryView';
import PhotoEntry from './PhotoEntry';
import NoteEntry from './NoteEntry';

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedTab: 'timeline'
    }
  }

  componentWillMount() {
    this.eventEmitter = new EventEmitter();
  }

  onSubmitNewEntry() {
    this.eventEmitter.emit('submitNewEntry');
  }

  renderScene(route, navigator) {
    return React.createElement(route.component, {
      ...this.props,
      ...route.passProps,
      route,
      navigator
    })
  }

  configureScene(route, navigator) {
    return {
      ...Navigator.SceneConfigs.HorizontalSwipeJump,
      gestures: false // turn off navigator swipe gesture in order to enable react-native-swipeout
    }
  }

  renderTimelineView(component, ref) {
    return (
      <Navigator
        style={styles.container}
        ref={ref}
        initialRoute={{
          component: component
        }}
        renderScene={this.renderScene}
        configureScene={this.configureScene}
        navigationBar={
          <Navigator.NavigationBar
            style={styles.nav}
            routeMapper={NavigationBarRouteMapper} />
        }
      />
    )
  }

  renderNewEntryView(component, ref) {
    return (
      <Navigator
        style={styles.container}
        ref={ref}
        initialRoute={{
          component: component,
          passProps: {
            eventEmitter: this.eventEmitter,
            routeToHome: this.routeToHome.bind(this),
          },
          onRightButtonPress: this.onSubmitNewEntry.bind(this),
          onLeftButtonPress: this.routeToHome.bind(this),
          rightText: 'Submit',
          leftText: 'Cancel'
        }}
        renderScene={this.renderScene}
        configureScene={this.configureScene}
        navigationBar={
          <Navigator.NavigationBar
            style={styles.nav}
            routeMapper={NavigationBarRouteMapper} />
        }
      />
    )
  }

  launchPicker() {
    ImagePickerManager.showImagePicker(ImagePickerOptions.photo, (res) => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePickerManager Error: ', res.error);
      } else {
        let src = res.uri;
        let index = src.indexOf('images'); // index of 'i'

        if (index > -1) {
          index += 7; // index of first character of the image name
          src = src.slice(index);
        }

        this.setState({
          selectedTab: 'newPhoto'},
          () => this.routeToPhotoEntry({uri: src, isStatic: true})
        );
      }
    });
  }

  // Todo: Need to reset PhotoTimeline as well
  routeToHome() {
    this.setState(
      {selectedTab: 'timeline'},
      () => {
        this.refs.timelineRef.resetTo({
          component: ListTimeline,
          passProps: {
            eventEmitter: this.eventEmitter,
          }
        });
      }
    );
  }

  routeToPhotoEntry(source) {
    this.refs.newPhotoRef.resetTo({
      component: PhotoEntry,
      passProps: {
        eventEmitter: this.eventEmitter,
        image_url: source.uri,
        routeToHome: this.routeToHome.bind(this)
      },
      onRightButtonPress: this.onSubmitNewEntry.bind(this),
      onLeftButtonPress: this.routeToHome.bind(this),
      rightText: 'Submit',
      leftText: 'Cancel'
    })
  }

  setTab(tab) {
    if (this.state.selectedTab !== tab) {
      this.setState({selectedTab: tab})
    } else if (this.state.selectedTab === tab) {
      let tabName = tab + 'Ref';
      this.refs[tabName].popToTop();
    }
  }

  render() {
    return (
      <TabBarIOS barTintColor='black' tintColor='white'>
        <Icon.TabBarItemIOS
          title="Timeline"
          iconName="th-list"
          selected={this.state.selectedTab === 'timeline'}
          onPress={() => this.setTab('timeline')}>
          {this.renderTimelineView(ListTimeline, 'timelineRef')}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="Grid"
          iconName="th"
          selected={this.state.selectedTab === 'grid'}
          onPress={() => this.setTab('grid')}>
          {this.renderTimelineView(PhotoTimeline, 'gridRef')}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="New Note"
          iconName="pencil"
          selected={this.state.selectedTab === 'newNote'}
          onPress={() => this.setTab('newNote')}>
          {this.renderNewEntryView(NoteEntry, 'newNoteRef')}
        </Icon.TabBarItemIOS>
        <Icon.TabBarItemIOS
          title="New Photo"
          iconName="camera-retro"
          selected={this.state.selectedTab === 'newPhoto'}
          onPress={() => this.launchPicker()}>
          {this.renderNewEntryView(PhotoEntry, 'newPhotoRef')}
        </Icon.TabBarItemIOS>
      </TabBarIOS>
    );
  }
}

const NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if(index > 0) {
      return (
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => { if (index > 0) { navigator.pop() } }}>
          <Text style={ styles.leftNavButtonText }>Back</Text>
        </TouchableHighlight>
      )
    } else if(route.onLeftButtonPress) {
      return (
        <TouchableHighlight
        underlayColor="transparent"
        onPress={() => route.onLeftButtonPress()}>
        <Text style={ styles.leftNavButtonText }>
        { route.leftText || 'Left Button' }
        </Text>
        </TouchableHighlight>
      )
    } else {
      return null
    }
  },
  RightButton(route, navigator, index, navState) {
    if (route.onRightButtonPress) {
      return (
        <TouchableHighlight
           onPress={ () => route.onRightButtonPress() }>
           <Text style={ styles.rightNavButtonText }>
            { route.rightText || 'Right Button' }
           </Text>
         </TouchableHighlight>
       )
     }
  },
  Title(route, navigator, index, navState) {
    return <Text style={ styles.title }>One Memory Everyday</Text>
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  nav: {
    backgroundColor: '#efefef'
  },
  leftNavButtonText: {
    fontSize: 16,
    marginLeft: 13,
    marginTop: 10
  },
  rightNavButtonText: {
    fontSize: 16,
    marginRight: 13,
    marginTop: 10
  },
  title: {
    fontSize: 16,
    marginTop: 10
  }
});

module.exports = App;
