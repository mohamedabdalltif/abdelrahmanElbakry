import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Animated,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Container,
  Picker,
  Form,
  Spinner,
  Header,
  Left,
  Body,
  Right,
  Title,
} from 'native-base';
const {width, height} = Dimensions.get('window');
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';
import {AppRequired, COLORS, FONTS, images} from '../../constants';

export default class SeeMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataa: [],
      visable: false,
      loading: true,
      student_id: '',
      generation_id: '',
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Offline',
      ModalAllAlerts: false,
      resMassage: '',
    };
    this._subscription;
  }

  async componentDidMount() {
    this._subscription = NetInfo.addEventListener(
      this._handelConnectionInfoChange,
    );
  }
  _handelConnectionInfoChange = async (NetInfoState) => {
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    if (NetInfoState.isConnected == true) {
      this.setState(({}) => ({
        connection_Status: 'Online',
      }));

      if (data != null) {
        // alert(data.student_id)
        this.setState({
          student_id: data.student_id,
          generation_id: data.student_generation_id,
        });

        this.info();
      }

      Animated.spring(this.state.bottomConnectionMsg, {
        toValue: -100,
      }).start();
    } else {
      this.setState(({}) => ({
        connection_Status: 'offline',
      }));
      Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
    }
  };

  info = async () => {
    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));

    let data_to_send = {
      generation_id: this.state.generation_id,
      student_id: this.state.student_id,
      subject_id: drInfo.subject_id,
    };

    axios
      .post(AppRequired.Domain + 'select_solved.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // alert(JSON.stringify(res.data));

          if (res.data == 'error') {
            this.setState({
              ModalAllAlerts: true,
              resMassage: 'عذرا يرجي المحاوله في وقتا لاحق',
            });
            // Alert.alert(
            //   nameApp + '',
            //   'عذرا يرجي المحاوله في وقتا لاحق',
            //   [
            //     {
            //       text: '',
            //       onPress: () => console.log('Cancel Pressed'),
            //       style: 'cancel',
            //     },
            //     { text: 'حسنا', onPress: () => console.log('OK Pressed') },
            //   ],
            //   { cancelable: false },
            // );
          } else {
            this.setState({
              dataa: res.data.exams,
            });
          }
        } else {
          this.setState({
            ModalAllAlerts: true,
            resMassage: 'عذرا يرجي المحاوله في وقتا لاحق',
          });
          // Alert.alert(
          //   nameApp + '',
          //   'عذرا يرجي المحاوله في وقتا لاحق',
          //   [
          //     {
          //       text: '',
          //       onPress: () => console.log('Cancel Pressed'),
          //       style: 'cancel',
          //     },
          //     { text: 'حسنا', onPress: () => console.log('OK Pressed') },
          //   ],
          //   { cancelable: false },
          // );
        }

        this.setState({loading: false});
      });
  };
  render() {
    const ViewConnectionMsg = (props) => {
      return (
        <Animated.View
          style={[
            styles.ConnectionView,
            {bottom: this.state.bottomConnectionMsg},
          ]}>
          <View>
            <Text style={{color: 'white'}}>{props.ConnectionEnter}</Text>
          </View>
        </Animated.View>
      );
    };
    return (
      <Container
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#fff',
        }}>
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
                fontSize: 22,
              }}>
              نتائج الامتحانات
            </Text>
          </View>
          <View style={{flex: 1}} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.loading == true &&
          this.state.connection_Status == 'Online' ? (
            <Spinner
              color={COLORS.primary}
              size={40}
              style={{marginTop: 200}}
            />
          ) : this.state.loading == false ? (
            <View>
              {this.state.dataa.length == 0 ? (
                <View
                  style={{
                    width: width,
                    height: height - 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                      color: COLORS.primary,
                      fontFamily: FONTS.fontFamily,
                    }}>
                    لا توجد نتائج
                  </Text>
                </View>
              ) : (
                <View style={{marginTop: 10, marginBottom: 20}}>
                  {this.state.dataa.map((str, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (str.type == 'allowed') {
                            this.props.navigation.navigate(
                              'Seloved_Student_Exam',
                              {
                                exam_quiz_id: str.exam_quiz_id,
                                student_id: this.state.student_id,
                              },
                            );
                          } else {
                            this.setState({
                              ModalAllAlerts: true,
                              resMassage: 'ستظهر اجاباتك قريبا........',
                            });
                            // Alert.alert(
                            //   nameApp + '',
                            //   'ستظهر اجاباتك قريبا........',
                            //   [
                            //     {
                            //       text: '',
                            //       onPress: () => console.log('Cancel Pressed'),
                            //       style: 'cancel',
                            //     },
                            //     {
                            //       text: 'حسنا',
                            //       onPress: () => console.log('OK Pressed'),
                            //     },
                            //   ],
                            //   { cancelable: false },
                            // );
                          }
                        }}
                        style={{
                          width: '90%',
                          alignSelf: 'center',
                          // paddingHorizontal: 10,
                          // paddingVertical: 10,
                          padding: 10,
                          borderLeftWidth: 8,
                          borderLeftColor: COLORS.primary,
                          borderRadius: 7,
                          backgroundColor: '#FFF',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 10,
                          elevation: 6,
                        }}>
                        <View
                          style={{
                            backgroundColor: 'white',
                            width: '70%',
                            borderRightWidth: 2,
                            justifyContent: 'center',
                            borderBottomStartRadius: 20,
                            borderTopStartRadius: 20,
                            // shadowColor: '#000',
                            // shadowOffset: {
                            //   width: 0,
                            //   height: 6,
                            // },
                            // shadowOpacity: 0.37,
                            // shadowRadius: 7.49,
                            padding: 10,
                            // elevation: 12,
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 18,
                              fontWeight: '500',
                            }}>
                            {str.exam_name}
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: 'white',
                            width: '30%',
                            justifyContent: 'center',
                            borderTopEndRadius: 20,
                            borderBottomEndRadius: 20,
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontSize: 18,
                              fontWeight: '500',
                            }}>
                            {str.solved_exam_score}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                  {/* </View> */}
                </View>
              )}
            </View>
          ) : this.state.connection_Status != 'offline' ? null : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: height / 3,
              }}>
              <Image
                style={{width: '70%', height: height / 4}}
                source={images.NoInternet}
              />
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  fontFamily: FONTS.fontFamily,
                }}>
                لا يوجد اتصال بالأنترنت
              </Text>
            </View>
          )}
        </ScrollView>

        <Modal
          visible={this.state.ModalAllAlerts}
          onRequestClose={() => {
            this.setState({ModalAllAlerts: false});
          }}
          transparent={true}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                width: width * 0.9,
                padding: 10,
                backgroundColor: '#fff',
                elevation: 22,
                borderRadius: 15,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    color: COLORS.primary,
                    fontSize: 22,
                  }}>
                  {AppRequired.appName}
                </Text>
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  width: '90%',
                  borderWidth: 1.5,
                  borderColor: '#ddd',
                }}
              />

              <View style={{paddingHorizontal: 20, paddingVertical: 12}}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    color: COLORS.primary,
                    fontSize: 17,
                    textAlign: 'center',
                  }}>
                  {this.state.resMassage}
                </Text>
              </View>

              <View
                style={{
                  alignSelf: 'center',
                  width: '90%',
                  borderWidth: 1.5,
                  borderColor: '#ddd',
                }}
              />

              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 7,
                }}>
                <TouchableOpacity
                  style={{alignItems: 'center', justifyContent: 'center'}}
                  onPress={() => {
                    this.setState({ModalAllAlerts: false});
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.primary,
                      fontSize: 20,
                    }}>
                    إلغاء
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <ViewConnectionMsg ConnectionEnter="لا يوجد اتصال بالأنترنت" />
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  ConnectionView: {
    width: '100%',
    height: 20,
    position: 'absolute',
    zIndex: 222,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
