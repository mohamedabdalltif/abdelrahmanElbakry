import * as React from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import {Spinner} from 'native-base';

// With Flow type annotations (https://flow.org/)
import PDFView from 'react-native-view-pdf';
import {COLORS} from '../../constants';
// Without Flow type annotations
// import PDFView from 'react-native-view-pdf/lib/index';

export default class PDFViewr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  render() {
    const resources = {
      file:
        Platform.OS === 'ios'
          ? 'downloadedDocument.pdf'
          : '/sdcard/Download/downloadedDocument.pdf',
      url: this.props.summary_link, //'https://camp-coding.com/classRoomAPI/data/tasks.pdf',
      base64: 'JVBERi0xLjMKJcfs...',
    };

    const resourceType = 'url';

    return (
      <View style={{flex: 1}}>
        {/* Some Controls to change PDF resource */}

        <PDFView
          fadeInDuration={250.0}
          style={{flex: 1}}
          resource={resources[resourceType]}
          resourceType={resourceType}
          onLoad={() => this.setState({loading: false})}
          onError={(error) => console.log('Cannot render PDF', error)}
        />

        {this.state.loading ? (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Spinner color={COLORS.primary} size={40} />
          </View>
        ) : null}
      </View>
    );
  }
}
