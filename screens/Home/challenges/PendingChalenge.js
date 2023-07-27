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
  Alert,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {Container, Picker, Form, Spinner} from 'native-base';
const {width, height} = Dimensions.get('window');
import axios from 'axios';
import {AppRequired, COLORS, FONTS} from '../../../constants';

export default class PendingChalenge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isloading: true,
      buttonCancelLoading: false,
      buttonAcceptChallenge: false,
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

  componentWillUnmount() {}

  async getdata() {
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));

    let data_to_send = {
      student_id: StudentData.student_id,
    };

    axios
      .post(
        AppRequired.Domain + 'challenge/select_pendding_challanges.php',
        data_to_send,
      )
      .then((res) => {
        if (res.status == 200) {
          if (res.data != 'erorr') {
            if (res.data.length > 0) {
              // alert(JSON.stringify(res.data));
              let resData = res.data;
              resData.map((item) => {
                item.buttonCancelLoading = false;
                item.buttonAcceptLoading = false;
              });
              this.setState({
                data: resData,
              });
            } else {
              this.setState({
                data: [],
              });
            }
          } else if (res.data == 'full') {
            ToastAndroid.showWithGravityAndOffset(
              'لقد اجتزت العدد المسموح به للتحديات اليوم',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
            this.setState({
              data: [],
              isloading: false,
            });
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجى المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
            this.setState({
              data: [],
              isloading: false,
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
        this.setState({
          isloading: false,
        });
        // alert(this.state.isloading);
      })
      .finally(() => {
        this.setState({isloading: false});
      });
  }

  acceptChallenge = async (challenge_id, index) => {
    // alert(challenge_id)
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));

    let Data = this.state.data;
    Data[index].buttonAcceptLoading = true;

    this.setState({
      data: Data,
    });

    // this.setState({
    //   buttonAcceptChallenge: true,
    // });

    let data_to_send = {
      student_id: StudentData.student_id,
      challange_id: challenge_id,
    };

    console.log(JSON.stringify(data_to_send));

    axios
      .post(AppRequired.Domain + 'challenge/accept_challange.php', data_to_send)
      .then((res) => {
        // alert(res.data);
        console.log(res.data);

        this.setState({
          buttonAcceptChallenge: false,
        });

        if (res.data == 'success') {
          let data = this.state.data;
          data[index].buttonAcceptLoading = false;
          data.splice(index, 1);

          this.setState({data: data, isChange: true});
          ToastAndroid.showWithGravityAndOffset(
            'تم قبول التحدى',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        } else if (res.data == 'full') {
          ToastAndroid.showWithGravityAndOffset(
            'تم قبول تحدى اليوم',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
          let data = this.state.data;
          data[index].buttonAcceptLoading = false;
          this.setState({data: data});
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجى المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
          let data = this.state.data;
          data[index].buttonAcceptLoading = false;
          this.setState({data: data});
        }
      });
  };

  async remove_item(index, challenge_id) {
    // alert(challenge_id)
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));

    let Data = this.state.data;
    Data[index].buttonCancelLoading = true;

    this.setState({
      data: Data,
    });

    let data_to_send = {
      student_id: StudentData.student_id,
      challange_id: challenge_id,
    };

    // alert(JSON.stringify(data_to_send));

    axios
      .post(AppRequired.Domain + 'challenge/refuse_challange.php', data_to_send)
      .then((res) => {
        // alert(res.data);
        this.setState({
          buttonCancelLoading: false,
        });
        if (res.data == 'success') {
          let data = this.state.data;
          data.splice(index, 1);
          this.setState({data: data, isChange: true});
          ToastAndroid.showWithGravityAndOffset(
            'تم إلغاء التحدى بنجاح',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        } else {
          // this.setState({buttonCancelLoading:false})
          let data = this.state.data;
          data[index].buttonCancelLoading = false;
          this.setState({data: data});
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

  render() {
    return (
      <>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
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
                    صفحه الأنتظار
                  </Text>
                </View>
                <View style={{flex: 1}} />
              </View>
              {/* {alert(this.state.data)} */}
              {this.state.isloading == false ? (
                this.state.data.length > 0 ? (
                  <ScrollView>
                    {this.state.data.map((item, index) => (
                      <>
                        <View
                          style={{
                            width: '95%',
                            backgroundColor: '#fff',
                            alignSelf: 'center',
                            borderRadius: 8,
                            marginTop: 10,
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
                              justifyContent: 'space-between',
                            }}>
                            <View>
                              <View>
                                <Text
                                  style={{
                                    fontSize: 20,
                                    marginLeft: 10,
                                    fontWeight: 'bold',
                                    alignSelf: 'flex-start',
                                  }}>
                                  باب التحدي
                                </Text>
                                <View style={{width: 100}}>
                                  <Text
                                    numberOfLines={4}
                                    style={{
                                      fontSize: 15,
                                      color: '#aea9a9',
                                      marginLeft: 15,
                                      alignSelf: 'flex-start',
                                    }}>
                                    {item.session}
                                  </Text>
                                </View>
                              </View>
                            </View>

                            <View
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{
                                  fontSize: 20,
                                  marginLeft: 10,
                                  fontWeight: 'bold',
                                }}>
                                حالة الطلب
                              </Text>
                              <View style={{width: 100}}>
                                {item.state_of_order == true ? (
                                  <Text
                                    style={{
                                      fontSize: 15,
                                      color: '#aea9a9',
                                      alignSelf: 'center',
                                    }}>
                                    طلب من صديق
                                  </Text>
                                ) : (
                                  <View style={{width: 150}}>
                                    <Text
                                      style={{
                                        fontSize: 15,
                                        color: '#aea9a9',
                                        alignSelf: 'flex-start',
                                        marginLeft: 10,
                                      }}>
                                      تم ارسال الطلب
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>

                          <View style={{alignSelf: 'center'}}>
                            <Text
                              style={{
                                fontSize: 20,
                                marginLeft: 10,
                                fontWeight: 'bold',
                                marginTop: -20,
                                opacity: 0.5,
                              }}>
                              {item.name_of_challanger}
                            </Text>
                          </View>

                          {item.state_of_order == true ? (
                            <TouchableOpacity
                              disabled={this.state.buttonCancelLoading}
                              onPress={() => {
                                this.remove_item(index, item.challange_id);
                              }}
                              style={{width: '100%', marginTop: 30}}>
                              <View
                                style={{
                                  width: '30%',
                                  height: 50,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  backgroundColor: '#f00',
                                  alignSelf: 'center',
                                  marginBottom: 20,
                                  marginTop: 1,
                                  borderRadius: 10,
                                }}>
                                {item.buttonCancelLoading == false ? (
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      color: '#FFFFFF',
                                      fontWeight: 'bold',
                                      fontStyle: 'normal',
                                    }}>
                                    الغاء الطلب
                                  </Text>
                                ) : (
                                  <Spinner color="#FFF" size={25} />
                                )}
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <View style={{flexDirection: 'row', width: '50%'}}>
                              <TouchableOpacity
                                disabled={this.state.buttonAcceptChallenge}
                                onPress={() => {
                                  this.acceptChallenge(
                                    item.challange_id,
                                    index,
                                  );
                                  // alert('Go to VS Challenge');
                                }}
                                style={{width: '100%', marginTop: 30}}>
                                <View
                                  style={{
                                    width: '60%',
                                    height: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#43c027',
                                    alignSelf: 'center',
                                    marginBottom: 20,
                                    marginTop: 1,
                                    borderRadius: 10,
                                  }}>
                                  {/* <Text
                                style={{
                                  fontSize: 18,
                                  color: '#FFFFFF',
                                  fontWeight: 'bold',
                                  fontStyle: 'normal',
                                }}>
                                موافق
                              </Text> */}
                                  {item.buttonAcceptLoading == false ? (
                                    <Text
                                      style={{
                                        fontSize: 18,
                                        color: '#FFFFFF',
                                        fontWeight: 'bold',
                                        fontStyle: 'normal',
                                      }}>
                                      موافق
                                    </Text>
                                  ) : (
                                    <Spinner color="#FFF" size={25} />
                                  )}
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity
                                disabled={this.state.buttonCancelLoading}
                                onPress={() => {
                                  this.remove_item(index, item.challange_id);
                                }}
                                style={{width: '100%', marginTop: 30}}>
                                <View
                                  style={{
                                    width: '60%',
                                    height: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#f00',
                                    alignSelf: 'center',
                                    marginBottom: 20,
                                    marginTop: 1,
                                    borderRadius: 10,
                                  }}>
                                  {item.buttonCancelLoading == false ? (
                                    <Text
                                      style={{
                                        fontSize: 18,
                                        color: '#FFFFFF',
                                        fontWeight: 'bold',
                                        fontStyle: 'normal',
                                      }}>
                                      الغاء الطلب
                                    </Text>
                                  ) : (
                                    <Spinner color="#FFF" size={25} />
                                  )}
                                </View>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </>
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
            </>
          )}
        </View>
      </>
    );
  }
}
