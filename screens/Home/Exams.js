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
} from 'react-native';
import {Container, Picker, Form, Spinner} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome5';
const {width, height} = Dimensions.get('window');
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import {AppRequired, COLORS, FONTS, images} from '../../constants';
export default class SeeMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataa: [],
      visable: false,
      loading: true,
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Offline',
    };
    this._subscription;
  }

  // componentWillUnmount () {
  //   this._subscription && this._subscription()
  // }

  async componentDidMount() {
    // this._subscription = NetInfo.addEventListener(
    //   this._handelConnectionInfoChange,
    // );

    this.info();
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      console.log('Connection value ' + state.isConnected);
      console.log('Connection type ' + state.type);
      if (state.isConnected == true) {
        this.setState({
          connection_Status: 'Online',
        });
        Animated.spring(this.state.bottomConnectionMsg, {
          toValue: -100,
        }).start();
      } else {
        this.setState({
          connection_Status: 'Offline',
        });
        Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
      }
    });
  }

  // _handelConnectionInfoChange = async (NetInfoState) => {
  //   const data = JSON.parse(await AsyncStorage.getItem('AllData'));
  //   if (NetInfoState.isConnected == true) {
  //     this.setState(({}) => ({
  //       connection_Status: 'Online',
  //     }));

  //     this.info();

  //     Animated.spring(this.state.bottomConnectionMsg, {
  //       toValue: -100,
  //     }).start();
  //   } else {
  //     this.setState(({}) => ({
  //       connection_Status: 'offline',
  //     }));
  //     Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
  //   }
  // };

  info = () => {
    let data_to_send = {
      generation_id: 1,
      student_id: 1,
    };

    axios
      .post(AppRequired.Domain + 'select_solved.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 'error') {
            Alert.alert(
              AppRequired.appName + '',
              'هناك خطأ ما في اتسترجاع بيانات الامتحان',
            );
          } else {
            this.setState({
              dataa: res.data.exams,
            });
          }
        } else {
          Alert.alert(
            AppRequired.appName + '',
            'عذرا يرجي المحاوله في وقتا لاحق',
          );
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
          backgroundColor: '#EAEAEA',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{width: '10%', alignSelf: 'flex-start'}}>
          <TouchableOpacity
            style={{
              marginLeft: 0.05 * width,
              marginTop: 0.05 * height,
              // flexDirection: 'row',
              width: '100%',
            }}>
            <Icon name="chevron-right" color={'black'} size={20} />
          </TouchableOpacity>
        </View>
        <ScrollView>
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
                    لا يوجد امتحانات متاحة
                  </Text>
                </View>
              ) : (
                <View>
                  <View
                    style={{
                      width: '95%',
                      flexDirection: 'row',
                      marginTop: 25,
                      height: height * 0.05,
                      marginBottom: 5,
                      alignSelf: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: 'white',
                        width: '70%',
                        borderRightWidth: 2,
                        justifyContent: 'center',
                        borderBottomStartRadius: 20,
                        borderTopStartRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 6,
                        },
                        shadowOpacity: 0.37,
                        shadowRadius: 7.49,

                        elevation: 12,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 18,
                          fontWeight: 'bold',
                          fontFamily: FONTS.fontFamily,
                        }}>
                        اسم الكويز
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: 'white',
                        width: '30%',
                        justifyContent: 'center',
                        borderTopEndRadius: 20,
                        borderBottomEndRadius: 20,
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 6,
                        },
                        shadowOpacity: 0.37,
                        shadowRadius: 7.49,
                        elevation: 12,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 18,
                          fontWeight: 'bold',
                          fontFamily: FONTS.fontFamily,
                        }}>
                        المجموع
                      </Text>
                    </View>
                  </View>

                  {this.state.dataa.map((str) => {
                    return (
                      <View
                        style={{
                          width: '95%',
                          flexDirection: 'row',
                          marginTop: 5,
                          height: height * 0.05,
                          marginBottom: 5,
                          alignSelf: 'center',
                        }}>
                        <View
                          style={{
                            backgroundColor: 'white',
                            width: '70%',
                            borderRightWidth: 2,
                            justifyContent: 'center',
                            borderBottomStartRadius: 20,
                            borderTopStartRadius: 20,
                            shadowColor: '#000',
                            shadowOffset: {
                              width: 0,
                              height: 6,
                            },
                            shadowOpacity: 0.37,
                            shadowRadius: 7.49,

                            elevation: 12,
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
                            shadowColor: '#000',
                            shadowOffset: {
                              width: 0,
                              height: 6,
                            },
                            shadowOpacity: 0.37,
                            shadowRadius: 7.49,

                            elevation: 12,
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
                      </View>
                    );
                  })}
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
