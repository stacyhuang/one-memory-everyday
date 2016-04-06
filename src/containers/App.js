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

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import EventEmitter from 'EventEmitter';
import Subscribable from 'Subscribable';
import * as displayTabActions from '../actions/displayTabActions';
import ImagePickerOptions from '../Utils/ImagePickerOptions';
import ListTimeline from './ListTimeline';
import PhotoTimeline from './PhotoTimeline';
import EntryContainer from './EntryContainer';

const ImagePickerManager = NativeModules.ImagePickerManager;

class App extends Component {
  componentWillMount() {
    this.eventEmitter = new EventEmitter();
  }

  onSubmitNewEntry() {
    this.eventEmitter.emit('onSubmitNewEntry');
    this.routeToHome();
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
      gestures: false // turn off navigator swipe gesture to enable react-native-swipeout
    }
  }

  renderTimelineView(component, ref) {
    return (
      <Navigator
        style={styles.container}
        ref={ref}
        initialRoute={{component: component}}
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

  renderNewEntryView(memory_type, ref) {
    return (
      <Navigator
        style={styles.container}
        ref={ref}
        initialRoute={{
          component: EntryContainer,
          passProps: {
            eventEmitter: this.eventEmitter,
            memory_type: memory_type
          },
          rightText: 'Submit',
          onRightButtonPress: this.onSubmitNewEntry.bind(this),
          leftText: 'Cancel',
          onLeftButtonPress: this.routeToHome.bind(this)
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

  routeToHome() {
    this.props.actions.setSelectedTab('timeline');
  }

  routeToPhotoEntry(source) {
    this.refs.newPhotoRef.resetTo({
      component: EntryContainer,
      passProps: {
        eventEmitter: this.eventEmitter,
        image_url: source.uri,
        memory_type: 'photo',
      },
      rightText: 'Submit',
      onRightButtonPress: this.onSubmitNewEntry.bind(this),
      leftText: 'Cancel',
      onLeftButtonPress: this.routeToHome.bind(this)
    })
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

        this.props.actions.setSelectedTab('newPhoto');
        this.routeToPhotoEntry({uri: src, isStatic: true})
      }
    });
  }

  setTab(tab) {
    if (this.props.displayTab !== tab) {
      this.props.actions.setSelectedTab(tab);
    } else {
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
          selected={this.props.displayTab === 'timeline'}
          onPress={() => this.setTab('timeline')}>
          {this.renderTimelineView(ListTimeline, 'timelineRef')}
        </Icon.TabBarItemIOS>

        <Icon.TabBarItemIOS
          title="Grid"
          iconName="th"
          selected={this.props.displayTab === 'grid'}
          onPress={() => this.setTab('grid')}>
          {this.renderTimelineView(PhotoTimeline, 'gridRef')}
        </Icon.TabBarItemIOS>

        <Icon.TabBarItemIOS
          title="New Note"
          iconName="pencil"
          selected={this.props.displayTab === 'newNote'}
          onPress={() => this.setTab('newNote')}>
          {this.renderNewEntryView('note', 'newNoteRef')}
        </Icon.TabBarItemIOS>

        <Icon.TabBarItemIOS
          title="New Photo"
          iconName="camera-retro"
          selected={this.props.displayTab === 'newPhoto'}
          onPress={() => this.launchPicker()}>
          {this.renderNewEntryView('photo', 'newPhotoRef')}
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

const mapStateToProps = (state) => {
  return {
    displayTab: state.displayTab
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(displayTabActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
