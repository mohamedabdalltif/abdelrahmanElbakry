import {Spinner} from 'native-base';
import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import * as Animatable from 'react-native-animatable';

import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {AppRequired, COLORS, FONTS} from '../../constants';
const {width, height} = Dimensions.get('window');
export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      pageLoading: true,
    };
  }

  componentDidMount() {
    this.getNotification();
  }

  getNotification = async () => {
    let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let data_to_send = {
      student_id: studentData.student_id,
    };
    axios
      .post(AppRequired.Domain + 'select_notification.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          console.log(JSON.stringify(res.data));
          if (Array.isArray(res.data)) {
            this.setState({
              notifications: res.data,
              pageLoading: false,
            });
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
            this.setState({
              pageLoading: false,
              notifications: [],
            });
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
          this.setState({
            pageLoading: false,
            notifications: [],
          });
        }
      });
  };

  _renderRows = (item, index) => {
    return (
      <>
        {index % 2 == 0 ? (
          <TouchableOpacity
            onPress={() => {
              if (item.page_to_go == 'vs') {
                this.props.navigation.navigate('PendingChalenge');
              } else if (item.page_to_go == 'exam') {
                this.props.navigation.navigate('ExamList');
              } else if (item.page_to_go == 'quiz') {
                this.props.navigation.navigate('QuizList');
              }
              // this.props.navigation.navigate('PendingChalenge');
            }}>
            <Animatable.View
              animation="fadeInRight"
              // duration={2500}
              easing="linear"
              style={{
                width: '95%',
                alignSelf: 'center',
                padding: 10,
                borderLeftColor: COLORS.primary,
                borderLeftWidth: 8,
                borderRadius: 7,
                backgroundColor:
                  item.notification_seen == '1' ? 'rgba(0,0,0,0.2)' : '#fff',
                borderWidth: 1,
                borderColor:
                  item.notification_seen == '1' ? COLORS.primary : 'green',
                marginVertical: 10,
              }}>
              <Text style={{fontFamily: FONTS.fontFamily, fontSize: 16}}>
                {item.notification_title}
              </Text>
              <Text style={{fontFamily: FONTS.fontFamily, fontSize: 16}}>
                {item.notification_body}
              </Text>
            </Animatable.View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (item.page_to_go == 'vs') {
                this.props.navigation.navigate('PendingChalenge');
              } else if (item.page_to_go == 'exam') {
                this.props.navigation.navigate('ExamList');
              } else if (item.page_to_go == 'quiz') {
                this.props.navigation.navigate('QuizList');
              }
              // this.props.navigation.navigate('PendingChalenge');
            }}>
            <Animatable.View
              animation="fadeInLeft"
              // duration={2500}
              easing="linear"
              style={{
                width: '95%',
                alignSelf: 'center',
                padding: 10,
                borderLeftColor: COLORS.primary,
                borderLeftWidth: 8,
                borderRadius: 7,
                backgroundColor:
                  item.notification_seen == '1' ? 'rgba(0,0,0,0.2)' : '#fff',
                borderColor:
                  item.notification_seen == '1' ? COLORS.primary : 'green',
                borderWidth: 1,
                marginVertical: 10,
              }}>
              <Text style={{fontFamily: FONTS.fontFamily, fontSize: 16}}>
                {item.notification_title}
              </Text>
              <Text style={{fontFamily: FONTS.fontFamily, fontSize: 16}}>
                {item.notification_body}
              </Text>
            </Animatable.View>
          </TouchableOpacity>
        )}
      </>
    );
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            width: width,
            height: height * 0.1,
            backgroundColor: COLORS.primary,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            flexDirection: 'row',
          }}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
              }}>
              <FontAwesome5
                name="arrow-right"
                style={{fontSize: 24, color: '#fff', marginLeft: 10}}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                color: '#fff',
                fontSize: 19,
              }}>
              الاشعارات
            </Text>
          </View>
          <View style={{flex: 1}} />
        </View>
        {/* <ScrollView showsVerticalScrollIndicator={false} > */}
        {this.state.pageLoading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Spinner color={COLORS.primary} />
          </View>
        ) : this.state.notifications.length > 0 ? (
          <FlatList
            data={this.state.notifications}
            style={{width: '100%'}}
            renderItem={({item, index}) => this._renderRows(item, index)}
          />
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                textAlign: 'center',
                fontSize: 18,
              }}>
              لا يوجد إشعارات
            </Text>
          </View>
        )}

        {/* </ScrollView> */}
      </View>
    );
  }
}
