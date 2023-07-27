import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  ToastAndroid,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

// import {Container, Spinner} from 'native-base';
// import firebase from 'react-native-firebase';

const {width, height} = Dimensions.get('window');
import axios from 'axios';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ProgressBar from 'react-native-progress/Bar';

import NetInfo from '@react-native-community/netinfo';
import {Badge} from 'react-native-elements';
import {NavigationEvents} from 'react-navigation';

import {StatusBar} from 'react-native';

import {AppRequired, COLORS, FONTS, images, SIZES} from '../../constants';
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataa: {
        exams: [],
      },
      visable: false,
      arr: [],
      numbro: 100,
      final_ratio: 0,
      success_ratio: 0,
      failed_ratio: 0,
      total_final: 0,
      num_of_Ques: 1,
      my_solve_ques: 0,
      isloading: false,
      balance: '',
      student_id: '',
      studentId: '',
      generationId: '',
      studentName: '',
      loading: true,
      checkLogoutLoading: false,
      xValue: new Animated.Value(0),
      xComponyBottomPanner: new Animated.Value(400),
      xComponyTopPanner: new Animated.Value(400),
      rotationMode: new Animated.Value(0),
      show: false,
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Online',
      refreshing: false,
      translateMainPageX: new Animated.Value(0),
      translateMainPageY: new Animated.Value(0),
      showModalForDrawer: false,
      failedLogout: false,
      showLogoutModal: false,
      newNotification: false,
    };
    this._subscription;
    examsLoding: true;
    exams: [];
  }

  async CustomComponentDidMount() {
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));

    if (data != null) {
      this.setState({
        studentId: data.student_id,
        generationId: data.student_generation_id,
        studentName: data.student_name,
      });
      this.info();
    }

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected == true) {
        this.setState({
          connection_Status: 'Online',
        });
        this.info();
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

  //   async checkPermission() {
  //     const enabled = await firebase.messaging().hasPermission();
  //     // If Premission granted proceed towards token fetch
  //     if (enabled) {
  //       this.getToken();
  //     } else {
  //       // If permission hasn’t been granted to our app, request user in requestPermission method.
  //       this.requestPermission();
  //     }
  //   }

  //   async requestPermission() {
  //     try {
  //       await firebase.messaging().requestPermission();
  //       // User has authorised
  //       this.getToken();
  //     } catch (error) {
  //       // User has rejected permissions
  //       console.log('permission rejected');
  //       this.requestPermission();
  //     }
  //   }

  //   async getToken() {
  //     let fcmToken = await AsyncStorage.getItem('fcmToken');
  //     console.log('Token ' + fcmToken);

  //     let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
  //     let data_to_send = {
  //       student_id: studentData.student_id,
  //       student_token: fcmToken,
  //     };
  //     // alert(JSON.stringify(data_to_send))

  //     axios.post(Domain + 'save_token.php', data_to_send).then((res) => {
  //       if (res.status == 200) {
  //         if (res.data == 'same') {
  //           console.log('finish send');
  //         } else {
  //           console.log('error');

  //           // ToastAndroid.showWithGravityAndOffset(
  //           //     "حدث خطأ ما الرجاء المحاوله فى وقت لاحق",
  //           //     ToastAndroid.LONG,
  //           //     ToastAndroid.CENTER,
  //           //     25,
  //           //     50
  //           // );
  //         }
  //       } else {
  //         ToastAndroid.showWithGravityAndOffset(
  //           'حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
  //           ToastAndroid.LONG,
  //           ToastAndroid.CENTER,
  //           25,
  //           50,
  //         );
  //       }
  //     });
  //     if (!fcmToken) {
  //       fcmToken = await firebase.messaging().getToken();
  //       if (fcmToken) {
  //         // user has a device token
  //         await AsyncStorage.setItem('fcmToken', fcmToken);
  //         // alert('aaaaaaaaaaa')
  //       }
  //     }
  //   }

  //   async createNotificationListeners() {
  //     // This listener triggered when notification has been received in foreground
  //     this.notificationListener = firebase.messages().onMessage((msg) => {
  //       // ... your code here
  //       alert(msg);
  //     });
  //     // firebase
  //     //     .notifications()
  //     //     .onNotification((notification) => {
  //     //         let action = notification._data.action;

  //     //         if (action == 'new_challenge') {
  //     //             this.setState({newNotification:true})

  //     //             //   this.setState({
  //     //             //     modalVisible: true,
  //     //             //   });
  //     //         }
  //     //     });

  //     // This listener triggered when app is in backgound and we click, tapped and opened notifiaction
  //     this.notificationOpenedListener = firebase
  //       .notifications()
  //       .onNotificationOpened((notificationOpen) => {
  //         let action = notificationOpen.notification._data.action;
  //         alert(action);
  //         this.setState({newNotification: true});
  //         // this.setState({
  //         //   modalVisible: true,
  //         // });
  //       });

  //     // This listener triggered when app is closed and we click,tapped and opened notification
  //     const notificationOpen = await firebase
  //       .notifications()
  //       .getInitialNotification();

  //     if (notificationOpen) {
  //       // let value = notificationOpen.notification._data['action_to_make'];
  //       let action = notificationOpen.notification._data.action;
  //       // alert('onNotificationOpened3')

  //       if (action == 'new_challenge') {
  //         // alert('onNotificationOpened3')
  //         this.setState({newNotification: true});

  //         // this.setState({
  //         //   modalVisible: true,
  //         // });
  //       }
  //     }
  //   }

  setData = async () => {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('switch', 'Auth');
  };

  info = async () => {
    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));

    let data_to_send = {
      generation_id: this.state.generationId,
      student_id: this.state.studentId,
      subject_id: drInfo.subject_id,
    };

    axios
      .post(AppRequired.Domain + 'get_profile_info.php', data_to_send)
      .then((res) => {
        console.log(res.data)
        if (res.status == 200) {
          if (res.data != 'error') {
            if (Object.keys(res.data).length > 3) {
              this.setState({
                dataa: res.data,
                exams: res.data.exams,
              });
              this.save_points(res.data);
            } else {
              this.setData();
              ToastAndroid.showWithGravityAndOffset(
                'قد تمت إزالتك',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25,
                50,
              );
              this.props.navigation.navigate('Auth');
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
        this.setState({loading: false});
      });
  };

  async save_points(data) {
    let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    studentData.student_points = data.points;
    await AsyncStorage.setItem('AllData', JSON.stringify(studentData));
  }
  _onRefresh = async () => {
    this.info();
  };

  checkLogout = async () => {
    this.setState({checkLogoutLoading: true});
    let data = JSON.parse(await AsyncStorage.getItem('AllData'));
    let data_to_send = {
      student_id: data.student_id,
    };
    axios
      .post(AppRequired.Domain + 'student_logout.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            this.setData();
            this.props.navigation.navigate('Auth');
          } else if (res.data == 'error') {
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجي المحاوله في وقتا لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
            this.setState({checkLogoutLoading: false});
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجي المحاوله في وقتا لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
          this.setState({checkLogoutLoading: false});
        }
      });
  };

  renderResults = () => {
    return (
      <View
        style={{
          padding: 30,
          borderTopRightRadius: 50,
          borderTopLeftRadius: 50,
          backgroundColor: '#fff',
          position: 'absolute',
          width: SIZES.width,
          alignSelf: 'center',
          bottom: 0,
          height: height * 0.6,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <View style={styles.percentage_view}> */}

          <View>
            <Text style={styles.text}>النجاح</Text>
            <View style={styles.view_progress}>
              <ProgressBar
                progress={this.formatPersentage(this.state.dataa?.success_ratio||0)}
                color={'#188038'}
                indeterminateAnimationDuration={1000}
                borderWidth={0.5}
                borderColor={'#188038'}
                height={height * 0.02}
                width={width * 0.7}
              />
              <Text style={styles.Percentage_text}>
                {this.state.dataa?.success_ratio||0} %
              </Text>
            </View>
          </View>

          <View>
            <Text style={styles.text}>الرسوب</Text>
          </View>
          <View style={styles.view_progress}>
            <ProgressBar
              // progress={this.state.failed_ratio}
              progress={this.formatPersentage(this.state.dataa?.failed_ratio||0)}
              color={'#d93025'}
              indeterminateAnimationDuration={60000}
              borderWidth={0.5}
              borderColor={'#d93025'}
              height={height * 0.02}
              width={width * 0.7}
            />
            <Text style={styles.Percentage_text}>
              {this.state.dataa?.failed_ratio||0} %
            </Text>
          </View>

          <View>
            <Text style={styles.text}>التراكمي</Text>
          </View>

          <View style={styles.view_progress}>
            <ProgressBar
              progress={this.formatPersentage(this.state.dataa?.final_ratio||0)}
              color={'#ffb74d'}
              indeterminateAnimationDuration={60000}
              borderWidth={0.5}
              borderColor={'#ffb74d'}
              height={height * 0.02}
              width={width * 0.7}
            />
            <Text style={styles.Percentage_text}>
              {this.state.dataa?.final_ratio||0} %
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: height * 0.08,
            }}>
            <View style={{}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  // flex: 1,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                  alignSelf: 'center',
                  borderRadius: 8,
                  // marginVertical: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.props.navigation.navigate('SeeMore');
                }}>
                <View
                  style={{
                    flex: 1.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 80,
                  }}>
                  <Text style={{fontFamily: FONTS.fontFamily, fontSize: 22}}>
                    الامتحانات المحلوله
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.primary,
                    borderRadius: 7,
                    height: '100%',
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      fontSize: 22,
                      color: '#fff',
                    }}>
                    {this.state.dataa.exams_count}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* </View> */}
        </ScrollView>
      </View>
    );
  };

  formatPersentage = (persentage) => {
    return persentage / 100;
  };

  render() {
    let {translateMainPageX, translateMainPageY} = this.state;

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
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.primary,
        }}>
        <StatusBar backgroundColor={COLORS.secondary} />

        <NavigationEvents onDidFocus={() => this.CustomComponentDidMount()} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.state.loading == true &&
          this.state.connection_Status == 'Online' ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: height * 0.4,
              }}>
              <Image
                source={images.mainLoading}
                style={{
                  width: 100,
                  height: 100,
                  tintColor: '#fff',
                }}
                resizeMode="contain"
              />
            </View>
          ) : this.state.loading == false ? (
            <View style={{flex: 1}}>
              {/*                                           header                                  */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    width: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.goBack();
                    }}>
                    <FontAwesome5
                      name={'arrow-right'}
                      size={24}
                      style={{color: '#fff'}}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {/* {this.state.dataa.points == '1' ? (
                    <Text
                      style={{
                        fontFamily: FONTS.fontFamily,
                        fontSize: 20,
                        color: '#fff',
                      }}>
                      نقطه
                    </Text>
                  ) : this.state.dataa.points == '2' ? (
                    <Text
                      style={{
                        fontFamily: FONTS.fontFamily,
                        fontSize: 20,
                        color: '#fff',
                      }}>
                      نقطتان
                    </Text>
                  ) : this.state.dataa.points == '3' ||
                    this.state.dataa.points == '4' ||
                    this.state.dataa.points == '5' ||
                    this.state.dataa.points == '6' ||
                    this.state.dataa.points == '7' ||
                    this.state.dataa.points == '8' ||
                    this.state.dataa.points == '9' ||
                    this.state.dataa.points == '10' ? (
                    <Text
                      style={{
                        fontFamily: FONTS.fontFamily,
                        fontSize: 20,
                        color: '#fff',
                      }}>
                      {this.state.dataa.points} نقاط
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: FONTS.fontFamily,
                        fontSize: 20,
                        color: '#fff',
                      }}>
                      {this.state.dataa.points} نقطه
                    </Text>
                  )} */}
                </View>

                <View
                  style={{
                    width: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('Notifications');
                    }}>
                    <FontAwesome
                      name="bell"
                      size={24}
                      style={{color: '#fff'}}
                    />
                    <Badge
                      status="success"
                      onPress={() => {
                        this.props.navigation.navigate('Notifications');
                      }}
                      value={this.state.dataa.notification_count}
                      containerStyle={{
                        position: 'absolute',
                        top: -1,
                        left: -2,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/*                                           name & position                                  */}
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: height * 0.08,
                    paddingHorizontal: 15,
                    marginBottom: height * 0.7,
                    // justifyContent:'center'
                  }}>
                  <View
                    style={{
                      width: 110,
                      height: 110,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 100,
                      backgroundColor: '#f5fcff',
                      marginRight: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 30,
                        color: '#000',
                        fontFamily: FONTS.fontFamily,
                      }}>
                      {this.state.dataa.position}
                    </Text>
                  </View>
                  <View style={{justifyContent: 'center'}}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 19,
                        color: '#FFF',
                        alignSelf: 'flex-start',
                        fontFamily: FONTS.fontFamily,
                      }}>
                      {this.state.studentName}
                    </Text>

                    {this.state.dataa.position == '1st' ? (
                      <Text
                        style={{
                          alignSelf: 'flex-start',
                          color: '#fff',
                          textAlign: 'left',
                        }}>
                        U are the Best Never Give Up 💪
                      </Text>
                    ) : null}
                  </View>
                </View>
                {/* <Text>aaaaaaa</Text> */}
              </ScrollView>

              {/*                                           main statistic                                  */}
              {this.renderResults()}
            </View>
          ) : this.state.connection_Status == 'Offline' ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <StatusBar backgroundColor={COLORS.secondary} />
              <Text
                style={{
                  fontFamily: FONTS.fontFamily,
                  fontSize: 22,
                  color: '#fff',
                }}>
                الرجاء التأكد من اتصالك بالأنترنت
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
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
  header: {
    height: 110,
    width: '100%',
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 25,
    paddingHorizontal: 15,
  },

  percentage_view: {
    width: '90%',
    margin: '5%',
    alignSelf: 'center',
    paddingLeft: 10,
    paddingTop: 10,
    // borderColor: '#777',
    borderRadius: 10,
    // borderWidth: 1,
  },
  view_progress: {
    marginVertical: height * 0.01,
    // height: 40,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  Percentage_text: {
    fontSize: 15,
    marginHorizontal: 10,
    marginBottom: 5,
  },
  text: {
    fontSize: 18,
    fontFamily: FONTS.fontFamily,
  },
});
