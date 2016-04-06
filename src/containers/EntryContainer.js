import React, {
  Component
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as memoryActions from '../actions/memoryActions';
import Entry from '../components/Entry';

class EntryContainer extends Component {
  render() {
    return (
      <Entry {...this.props} />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(memoryActions, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(EntryContainer);
