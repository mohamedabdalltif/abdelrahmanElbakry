import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import {
  Container,
  Picker,
  Form,
  Header,
  Left,
  Body,
  Right,
  Title,
  Spinner,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PDFViewr from './PDFViewr';

import {COLORS, FONTS} from '../../constants';
const {width, height} = Dimensions.get('window');

export default class Viewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      summary_name: this.props.navigation.getParam('sum_name'),
      summary_link: this.props.navigation.getParam('sum_link'),
    };
  }

  componentDidMount() {
    this.forbidFunction();
  }

  forbidFunction = async () => {
    try {
      const result = await NativeModules.PreventScreenshotModule.forbid();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  allowFunction = async () => {
    try {
      const result = await NativeModules.PreventScreenshotModule.allow();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <Container style={{flex: 1}}>
        <Header
          style={{backgroundColor: COLORS.primary}}
          androidStatusBarColor={COLORS.secondary}>
          <Left style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <Icon
                name="arrow-right"
                style={{fontSize: 20, color: '#fff', marginLeft: 10}}
              />
            </TouchableOpacity>
          </Left>
          <Body
            style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
            <Title
              numberOfLines={2}
              style={{
                fontSize: 17,
                fontFamily: FONTS.fontFamily,
                alignSelf: 'center',
                textAlign: 'center',
              }}>
              {this.state.summary_name}
            </Title>
          </Body>
          <Right />
        </Header>
        <View
          style={{
            width: '100%',
            backgroundColor: '#f7f7f7',
            height: height - 10,
            // marginTop:60,
            paddingTop: 10,
            paddingHorizontal: 10,
            paddingBottom: 20,
          }}>
          <View
            style={{
              width: '100%',
              alignSelf: 'center',
              height: '100%',
              // borderRadius:10,
              // paddingTop:10,
            }}>
            <PDFViewr summary_link={this.state.summary_link} />
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});
