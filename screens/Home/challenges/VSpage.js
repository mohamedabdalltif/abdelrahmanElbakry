import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Container, Picker, Form, Spinner, Item} from 'native-base';
const {width, height} = Dimensions.get('window');
import axios from 'axios';

import {AppRequired, COLORS, FONTS, images} from '../../../constants';

export default class VSpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isloading: false,
      enoughtChellengeToday: false,
      isChange: false,
    };
  }

  async componentDidMount() {
    let lastDate = JSON.parse(await AsyncStorage.getItem('currentDate'));
    let today = new Date();
    let currentDate =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();

    if (currentDate == lastDate) {
      this.setState({enoughtChellengeToday: true});
    } else {
      this.getdata();
    }
  }
  componentWillUnmount() {
    if (this.state.isChange) {
      let refrish = this.props.navigation.getParam('refrish');
      refrish();
    }
  }

  async getdata() {
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));

    let data_to_send = {
      student_id: StudentData.student_id,
    };

    axios
      .post(
        AppRequired.Domain + 'challenge/select_accepted_challanges.php',
        data_to_send,
      )
      .then((res) => {
        // alert(JSON.stringify(res.data));
        if (res.status == 200) {
          // console.log(JSON.stringify(res.data));
          if (res.data != 'error') {
            if (res.data.length > 0) {
              this.setState({
                data: res.data,
                isloading: true,
              });
            } else {
              this.setState({
                data: [],
                isloading: true,
              });
            }
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجى المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجى المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      });
  }

  nameFun(student_name) {
    var names = student_name.split(' ');
    return names[0] + ' ';
  }

  nameOfChalenge(student_name) {
    let nameOfChalenge = student_name.split(' ');
    return nameOfChalenge[0] + ' ';
  }

  render() {
    return (
      <>
        <StatusBar backgroundColor={COLORS.secondary}></StatusBar>
        {this.state.enoughtChellengeToday ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              width: '90%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                color: COLORS.primary,
                fontSize: 20,
                textAlign: 'center',
                alignSelf: 'center',
              }}>
              لقد اتممت تحديات اليوم الرجاء المحاوله غداً
            </Text>
          </View>
        ) : (
          <>
            <View style={{flex: 1, backgroundColor: '#fff'}}>
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
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.goBack();
                    }}>
                    <Icon
                      name="arrow-right"
                      style={{fontSize: 24, color: '#fff', marginLeft: 10}}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: '#fff',
                      fontSize: 19,
                    }}>
                    {' '}
                    دخول التحدى
                  </Text>
                </View>
                <View style={{flex: 1}} />
              </View>
              {this.state.isloading == true ? (
                this.state.data.length > 0 ? (
                  <ScrollView>
                    {this.state.data.map((item, index) => (
                      <View
                        style={{
                          width: width - 20,
                          backgroundColor: '#fff',
                          alignSelf: 'center',
                          borderRadius: 8,
                          marginTop: 15,
                          elevation: 10,
                        }}>
                        <View
                          style={{
                            height: 70,
                            marginTop: 10,
                            width: '98%',
                            backgroundColor: '#fff',
                            alignSelf: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                          }}>
                          <View style={{marginTop: 5, height: 110}}>
                            <Image
                              source={images.User_Avatar_Transparent}
                              style={{
                                width: 45,
                                height: 45,
                                alignSelf: 'center',
                              }}></Image>

                            <Text
                              style={{
                                fontSize: 20,
                                color: '#aea9a9',
                                marginTop: 5,
                              }}>
                              {this.nameFun(item.nameStudent)}
                            </Text>

                            <Text
                              style={{
                                fontSize: 20,
                                alignSelf: 'center',
                                color: '#aea9a9',
                                marginTop: 3,
                              }}>
                              {item.challange_sender_id}
                            </Text>
                          </View>

                          <View
                            style={{
                              width: 40,
                              height: 130,
                              // backgroundColor:"#f0f",
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: 2,
                                height: 40,
                                backgroundColor: COLORS.primary,
                              }}></View>
                            <Image
                              source={images.versus}
                              style={{width: 60, height: 60}}></Image>
                            <View
                              style={{
                                width: 2,
                                height: 40,
                                backgroundColor: COLORS.primary,
                              }}></View>
                          </View>

                          <View style={{marginTop: 5, height: 110}}>
                            <Image
                              source={images.secondAvatar}
                              style={{
                                width: 50,
                                height: 50,
                                alignSelf: 'center',
                              }}></Image>

                            <Text
                              style={{
                                fontSize: 20,
                                color: '#aea9a9',
                                marginTop: 2,
                              }}>
                              {this.nameOfChalenge(item.nameOfChalenge)}
                            </Text>

                            <Text
                              style={{
                                fontSize: 20,
                                alignSelf: 'center',
                                color: '#aea9a9',
                                marginTop: 3,
                              }}>
                              {item.challange_receiver_id}
                            </Text>
                          </View>
                        </View>

                        <View style={{marginTop: 25}}>
                          <TouchableOpacity
                            onPress={() => {
                              let AllChallengeArray = this.state.data;
                              AllChallengeArray.splice(index, 1);
                              this.setState({
                                data: AllChallengeArray,
                                isChange: true,
                              });
                              this.props.navigation.navigate(
                                'ExamPageQuestion',
                                {
                                  challenge_id: item.challange_id,
                                  challange_time: item.challange_time,
                                },
                              );
                              // alert('Go challenge');
                            }}
                            style={{width: '100%', marginTop: 50}}>
                            <View
                              style={{
                                width: '50%',
                                height: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: COLORS.primary,
                                alignSelf: 'center',
                                marginBottom: 20,
                                marginTop: 1,
                                borderRadius: 10,
                              }}>
                              <Text
                                style={{
                                  fontSize: 18,
                                  color: '#FFFFFF',
                                  fontWeight: 'bold',
                                  fontStyle: 'normal',
                                }}>
                                دخول التحدى
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}

                    <View style={{height: 40, width: '100%'}}></View>
                  </ScrollView>
                ) : (
                  <View
                    style={{
                      width: width,
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 25,
                        color: COLORS.primary,
                        fontFamily: FONTS.fontFamily,
                      }}>
                      لا يوجد تحديات
                    </Text>
                  </View>
                )
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Spinner size={40} color={COLORS.primary} />
                </View>
              )}
            </View>
          </>
        )}
      </>
    );
  }
}
