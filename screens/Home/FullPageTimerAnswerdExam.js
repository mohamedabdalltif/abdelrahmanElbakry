import * as React from 'react';

import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  Animated,
  Modal,
  BackHandler,
  Dimensions,
  NativeModules,
  Linking,
  ToastAndroid,
} from 'react-native';
import {Container, Left, Spinner} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

import NetInfo, {NetInfoSubscription} from '@react-native-community/netinfo';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';
import ProgressCircle from 'rn-animated-progress-circle';
import LinearGradient from 'react-native-linear-gradient';
import Counter from 'react-native-animated-counter';
import CountDown from 'react-native-countdown-component';
import axios from 'axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

import {AppRequired, COLORS, FONTS, images} from '../../constants';
export default class FullPageTimerAnswerdExam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 'not_done',
      fullDegree: '',
      studenDegree: '',
      visibleModal: false,
      percent: 0,
      visibleAnswerModal: false,
      quizId: this.props.navigation.getParam('quiz_id'),
      quiz_name: this.props.navigation.getParam('quiz_name'),
      failed_video: this.props.navigation.getParam('failed_video'),
      pass_video: this.props.navigation.getParam('pass_video'),
      good_video: this.props.navigation.getParam('good_video'),
      very_good_video: this.props.navigation.getParam('very_good_video'),
      excellent_video: this.props.navigation.getParam('excellent_video'),
      timer: this.props.navigation.getParam('timer'),
      loading: true,
      buttonLoading: false,
      student_id: '',
      refrish: this.props.navigation.getParam('refrish'),
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Offline',
      index: 1,
      oldIndex: 0,
      questions: [],
      arr: [],
      LogoutModal: false,
      failedgetDegreeOfExamModal: false,
      EndScroll: 1,
    };
  }

  componentWillUnmount() {
    this.backHandler.remove();
    // this._subscription && this._subscription()
    // let refrish = this.props.navigation.getParam('refrish')
    // refrish()
  }
  scrollToIndexFailed(error) {
    const offset = error.averageItemLength * error.index;
    this.flatListRef.scrollToOffset({offset});
    setTimeout(() => {
      this.flatListRef.scrollToIndex({index: error.index});
    }, 2500);
  }
  praviousFunction() {
    this.setState({
      index: this.state.index - 1,
      oldIndex: this.state.oldIndex - 1,
    });
    this.scrollToIndex();
  }
  NextFunction() {
    this.setState({
      index: this.state.index + 1,
      oldIndex: this.state.oldIndex + 1,
    });
    this.scrollToIndex();
  }
  async componentDidMount() {
    // var m = this.state.questions.length / 10;
    // m = Math.ceil(m);
    // var arr = [];
    // console.log('=================' + m);
    // for (var i = 1; i <= m; i++) {
    //   arr.push(i + '');
    // }
    // this.setState({arr: arr});
    // this._subscription = NetInfo.addEventListener(
    //   this._handelConnectionInfoChange,
    // );
    // this.forbidFunction();
    this.forbidFunction();
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    if (data != null) {
      this.setState({
        student_id: data.student_id,
      });
      this.selectQuestions();
    }

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

    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  allowFunction = async () => {
    try {
      const result = await NativeModules.PreventScreenshotModule.allow();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  forbidFunction = async () => {
    try {
      const result = await NativeModules.PreventScreenshotModule.forbid();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };
  backAction = () => {
    if (this.state.visibleModal == true) {
      BackHandler.exitApp();
    } else {
      this.setState({LogoutModal: true});
      // Alert.alert(
      //   appName + '',
      //   'اذا خرجت الان سيتم اعتبار هذا الامتحان محلولا,هل ما زلت تريد الخروج ؟',
      //   [
      //     {
      //       text: 'لا',
      //       onPress: () => null,
      //       style: 'cancel',
      //     },
      //     {
      //       text: 'نعم',
      //       onPress: () => {
      //         this.getDegreeOfExam();
      //       },
      //     },
      //   ],
      // );
      return true;
    }
  };
  selectQuestions() {
    let data_to_send = {id: this.state.quizId};

    // this.setState({loading: true});

    axios
      .post(AppRequired.Domain + 'select_questions.php', data_to_send)
      .then((res) => {
        this.setState({loading: false});

        if (res.data) {
          console.log(res.data);
          if (res.data == 'error') {
            Alert.alert(
              AppRequired.appName + '',
              'هناك خطأ ما في اتسترجاع بينات المتحان',
            );
          } else {
            var m = res.data.questions.length / 10;
            m = Math.ceil(m);
            var arr = [];
            console.log('=================' + m);
            for (var i = 1; i <= m; i++) {
              arr.push(i + '');
            }
            this.setState({arr: arr});
            this.setState({questions: res.data.questions});
          }
        }
      });
  }

  renderModal() {
    return (
      <Modal
        animationType="slide"
        // transparent={true}
        visible={this.state.visibleModal}>
        <ScrollView style={{marginBottom: 0}}>
          <View style={{height: 40}} />
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              justifyContent: 'center',
              padding: 20,
              // alignItems: 'center',
            }}>
            <View style={{alignItems: 'flex-start'}}>
              {this.state.percent == '' ? (
                <Animated.Text
                  style={{
                    fontSize: 12,
                    fontWeight: '900',
                    fontFamily: FONTS.fontFamily,
                    // marginBottom: 8,
                    textAlign: 'right',

                    transform: [
                      {
                        translateX:
                          -(this.state.studenDegree / this.state.fullDegree) *
                          (width * 0.85),
                      },
                    ],
                  }}>
                  0%
                </Animated.Text>
              ) : (
                <Animated.Text
                  style={{
                    fontSize: 12,
                    fontWeight: '900',
                    fontFamily: FONTS.fontFamily,
                    // marginBottom: 8,
                    textAlign: 'right',

                    transform: [
                      {
                        translateX:
                          -(this.state.studenDegree / this.state.fullDegree) *
                          (width * 0.85),
                      },
                    ],
                  }}>
                  {parseInt(this.state.percent)}%
                </Animated.Text>
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                height: 40,
                position: 'absolute',
                top: 40,
                alignSelf: 'center',
                width: width * 0.9,
              }}>
              <View
                style={{backgroundColor: '#D2DFE0', height: 40, width: '50%'}}
              />
              <View
                style={{backgroundColor: '#FCD98D', height: 40, width: '15%'}}
              />
              <View
                style={{backgroundColor: '#E6F1CD', height: 40, width: '10%'}}
              />
              <View
                style={{backgroundColor: '#B5DCC9', height: 40, width: '10%'}}
              />

              <View
                style={{backgroundColor: '#99B7DF', height: 40, width: '15%'}}
              />

              <View
                style={{
                  // flexDirection: 'row',
                  alignItems: 'flex-start',
                  position: 'absolute',
                  top: -2,
                  left: 0,
                  justifyContent: 'space-around',

                  // justifyContent: 'space-around',
                }}>
                <Animated.Image
                  source={images.arrow}
                  style={{
                    width: 15,
                    height: 15,

                    transform: [
                      {
                        translateX:
                          -(this.state.studenDegree / this.state.fullDegree) *
                          (width * 0.85),
                      },
                    ],
                  }}
                />
                <Animated.View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 20,
                    backgroundColor: 'transparent',
                    marginTop: 3,
                    marginLeft: 5,
                    transform: [
                      {
                        translateX:
                          -(this.state.studenDegree / this.state.fullDegree) *
                          (width * 0.85),
                      },
                    ],
                  }}
                />

                <Animated.Image
                  source={images.arrowUp}
                  style={{
                    width: 15,
                    height: 15,

                    // marginTop: 3,

                    transform: [
                      {
                        translateX:
                          -(this.state.studenDegree / this.state.fullDegree) *
                          (width * 0.85),
                      },
                    ],
                  }}
                />
              </View>
            </View>

            <Text
              style={{
                fontSize: 12,
                fontWeight: '900',
                marginTop: '14%',
                fontFamily: FONTS.fontFamily,
                // textAlign:'right'
              }}>
              100%
            </Text>
            {/* --------------------------------- */}

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
                marginBottom: 20,
              }}>
              {this.state.percent >= 0 && this.state.percent < 50 ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: 80,
                    // backgroundColor: '#',
                    marginTop: 20,
                    marginBottom: 40,
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      padding: 10,
                      width: '50%',
                    }}>
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontFamily: FONTS.fontFamily,
                        fontSize: 20,
                        marginBottom: 20,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}>
                      راسب
                    </Text>
                    {/* <Text
                      style={{
                        color: COLORS.primary,
                        fontFamily: FONTS.fontFamily,
                        fontSize: 20,
                        textAlign: 'center',
                      }}>
                      فيديو موصى به:
                    </Text> */}
                  </View>
                  {/* <TouchableOpacity
                    style={{
                      width: '100%',
                      padding: 7,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#fff',
                      borderRadius: 7,
                      borderWidth: 1,
                      borderColor: COLORS.primary,
                    }}
                    onPress={async () => {
                      const supported = await Linking.canOpenURL(
                        this.state.failed_video,
                      );
                      if (supported) {
                        await Linking.openURL(this.state.failed_video);
                      } else {
                        ToastAndroid.showWithGravityAndOffset(
                          'اللينك غير متاح',
                          ToastAndroid.SHORT,
                          ToastAndroid.BOTTOM,
                          25,
                          50,
                        );
                      }
                    }}>
                    <View
                      style={{
                        width: '60%',
                      }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          color: '#00f',
                          textDecorationLine: 'underline',
                          textDecorationColor: '#000',
                          fontFamily: FONTS.fontFamily,
                        }}>
                        بدء المشاهده
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '33%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // backgroundColor: '#f00'
                      }}>
                      <Image
                        source={images.AppLogo}
                        style={{
                          width: 55,
                          height: 70,
                          // marginTop: 5
                        }}
                      />
                    </View>
                  </TouchableOpacity> */}
                </View>
              ) : this.state.percent >= 50 && this.state.percent < 75 ? (
                this.state.percent >= 50 && this.state.percent < 60 ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: 80,
                      // backgroundColor: '#',
                      marginTop: 20,
                      marginBottom: 40,
                    }}>
                    <View
                      style={{
                        alignSelf: 'center',
                        padding: 10,
                        width: '50%',
                      }}>
                      <Text
                        style={{
                          color: COLORS.primary,
                          fontFamily: FONTS.fontFamily,
                          fontSize: 20,
                          marginBottom: 20,
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}>
                        مقبول
                      </Text>
                      {/* <Text
                        style={{
                          color: COLORS.primary,
                          fontFamily: FONTS.fontFamily,
                          fontSize: 20,
                          textAlign: 'center',
                        }}>
                        فيديو موصى به:
                      </Text> */}
                    </View>
                    {/* <TouchableOpacity
                      style={{
                        width: '100%',
                        padding: 7,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#fff',
                        borderRadius: 7,
                        borderWidth: 1,
                        borderColor: COLORS.primary,
                      }}
                      onPress={async () => {
                        const supported = await Linking.canOpenURL(
                          this.state.pass_video,
                        );
                        if (supported) {
                          await Linking.openURL(this.state.pass_video);
                        } else {
                          ToastAndroid.showWithGravityAndOffset(
                            'اللينك غير متاح',
                            ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM,
                            25,
                            50,
                          );
                        }
                      }}>
                      <View
                        style={{
                          width: '60%',
                        }}>
                        <Text
                          numberOfLines={2}
                          style={{
                            color: '#00f',
                            textDecorationLine: 'underline',
                            textDecorationColor: '#000',
                            fontFamily: FONTS.fontFamily,
                          }}>
                          بدء المشاهده
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '33%',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          // backgroundColor: '#f00'
                        }}>
                        <Image
                          source={images.AppLogo}
                          style={{
                            width: 55,
                            height: 70,
                            // marginTop: 5
                          }}
                        />
                      </View>
                    </TouchableOpacity> */}
                  </View>
                ) : (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      height: 80,
                      // backgroundColor: '#',
                      marginTop: 20,
                      marginBottom: 40,
                    }}>
                    <View
                      style={{
                        alignSelf: 'center',
                        padding: 10,
                        width: '50%',
                      }}>
                      <Text
                        style={{
                          color: COLORS.primary,
                          fontFamily: FONTS.fontFamily,
                          fontSize: 20,
                          marginBottom: 20,
                          textAlign: 'center',
                          fontWeight: 'bold',
                        }}>
                        جيد
                      </Text>
                      {/* <Text
                        style={{
                          color: COLORS.primary,
                          fontFamily: FONTS.fontFamily,
                          fontSize: 20,
                          textAlign: 'center',
                        }}>
                        فيديو موصى به:
                      </Text> */}
                    </View>
                    {/* <TouchableOpacity
                      style={{
                        width: '100%',
                        padding: 7,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#fff',
                        borderRadius: 7,
                        borderWidth: 1,
                        borderColor: COLORS.primary,
                      }}
                      onPress={async () => {
                        const supported = await Linking.canOpenURL(
                          this.state.good_video,
                        );
                        if (supported) {
                          await Linking.openURL(this.state.good_video);
                        } else {
                          ToastAndroid.showWithGravityAndOffset(
                            'اللينك غير متاح',
                            ToastAndroid.SHORT,
                            ToastAndroid.BOTTOM,
                            25,
                            50,
                          );
                        }
                      }}>
                      <View
                        style={{
                          width: '60%',
                        }}>
                        <Text
                          numberOfLines={2}
                          style={{
                            color: '#00f',
                            textDecorationLine: 'underline',
                            textDecorationColor: '#000',
                            fontFamily: FONTS.fontFamily,
                          }}>
                          بدء المشاهده
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '33%',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          // backgroundColor: '#f00'
                        }}>
                        <Image
                          source={images.AppLogo}
                          style={{
                            width: 55,
                            height: 70,
                            // marginTop: 5
                          }}
                        />
                      </View>
                    </TouchableOpacity> */}
                  </View>
                )
              ) : this.state.percent >= 75 && this.state.percent < 90 ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: 80,
                    // backgroundColor: '#',
                    marginTop: 20,
                    marginBottom: 40,
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      padding: 10,
                      width: '50%',
                    }}>
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontFamily: FONTS.fontFamily,
                        fontSize: 20,
                        marginBottom: 20,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}>
                      جيد جدا
                    </Text>
                    {/* <Text
                      style={{
                        color: COLORS.primary,
                        fontFamily: FONTS.fontFamily,
                        fontSize: 20,
                        textAlign: 'center',
                      }}>
                      فيديو موصى به:
                    </Text> */}
                  </View>
                  {/* <TouchableOpacity
                    style={{
                      width: '100%',
                      padding: 7,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#fff',
                      borderRadius: 7,
                      borderWidth: 1,
                      borderColor: COLORS.primary,
                    }}
                    onPress={async () => {
                      const supported = await Linking.canOpenURL(
                        this.state.very_good_video,
                      );
                      if (supported) {
                        await Linking.openURL(this.state.very_good_video);
                      } else {
                        ToastAndroid.showWithGravityAndOffset(
                          'اللينك غير متاح',
                          ToastAndroid.SHORT,
                          ToastAndroid.BOTTOM,
                          25,
                          50,
                        );
                      }
                    }}>
                    <View
                      style={{
                        width: '60%',
                      }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          color: '#00f',
                          textDecorationLine: 'underline',
                          textDecorationColor: '#000',
                          fontFamily: FONTS.fontFamily,
                        }}>
                        بدء المشاهده
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '33%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // backgroundColor: '#f00'
                      }}>
                      <Image
                        source={images.AppLogo}
                        style={{
                          width: 55,
                          height: 70,
                          // marginTop: 5
                        }}
                      />
                    </View>
                  </TouchableOpacity> */}
                </View>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: 80,
                    // backgroundColor: '#',
                    marginTop: 20,
                    marginBottom: 40,
                  }}>
                  <View
                    style={{
                      alignSelf: 'center',
                      padding: 10,
                      width: '50%',
                    }}>
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontFamily: FONTS.fontFamily,
                        fontSize: 20,
                        marginBottom: 20,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}>
                      امتياز
                    </Text>
                    {/* <Text
                      style={{
                        color: COLORS.primary,
                        fontFamily: FONTS.fontFamily,
                        fontSize: 20,
                        textAlign: 'center',
                      }}>
                      فيديو موصى به:
                    </Text> */}
                  </View>
                  {/* <TouchableOpacity
                    style={{
                      width: '100%',
                      padding: 7,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#fff',
                      borderRadius: 7,
                      borderWidth: 1,
                      borderColor: COLORS.primary,
                    }}
                    onPress={async () => {
                      const supported = await Linking.canOpenURL(
                        this.state.excellent_video,
                      );
                      if (supported) {
                        await Linking.openURL(this.state.excellent_video);
                      } else {
                        ToastAndroid.showWithGravityAndOffset(
                          'اللينك غير متاح',
                          ToastAndroid.SHORT,
                          ToastAndroid.BOTTOM,
                          25,
                          50,
                        );
                      }
                    }}>
                    <View
                      style={{
                        width: '60%',
                      }}>
                      <Text
                        numberOfLines={2}
                        style={{
                          color: '#00f',
                          textDecorationLine: 'underline',
                          textDecorationColor: '#000',
                          fontFamily: FONTS.fontFamily,
                        }}>
                        بدء المشاهده
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '33%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // backgroundColor: '#f00'
                      }}>
                      <Image
                        source={images.AppLogo}
                        style={{
                          width: 55,
                          height: 70,
                          // marginTop: 5
                        }}
                      />
                    </View>
                  </TouchableOpacity> */}
                </View>
              )}
            </View>

            {/* --------------------------- */}

            <View
              style={{
                // transform: [{rotateY: '180deg', rotate: '180deg'}],
                marginTop: 20,
              }}>
              <ProgressCircle
                style={{alignSelf: 'center'}}
                value={this.state.percent / 100}
                size={120}
                thickness={6}
                color={
                  this.state.percent > 0 && this.state.percent < 50
                    ? 'red'
                    : this.state.percent >= 50 && this.state.percent < 75
                    ? '#f2dc1a'
                    : '#5cb85c'
                }
                unfilledColor="#293077"
                animationMethod="timing"
                shouldAnimateFirstValue={true}
                animationConfig={{duration: 2000, dely: 500}}>
                <View
                  style={{
                    marginTop: 20,
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: -40,
                    }}>
                    <Text
                      style={{
                        color: COLORS.primary,
                        fontSize: 25,
                        fontWeight: 'bold',
                        fontFamily: FONTS.fontFamily,
                      }}>
                      %
                    </Text>
                    <Counter
                      start={0}
                      end={parseInt(this.state.percent)}
                      style={{
                        color: COLORS.primary,
                        fontSize: 25,
                        fontWeight: 'bold',
                      }}
                      duration={2000}
                    />
                  </View>

                  <Text
                    style={{
                      color: COLORS.primary,
                      marginTop: 10,
                      fontFamily: FONTS.fontFamily,
                    }}>
                    {this.state.studenDegree}
                    {''} /{''} {this.state.fullDegree}
                  </Text>
                </View>
              </ProgressCircle>
            </View>

            <TouchableOpacity
              style={{
                marginTop: 60,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                // height: 50,
                backgroundColor: COLORS.primary,
                alignSelf: 'center',
                borderRadius: 50,
                marginBottom: 20,
              }}
              onPress={() => {
                this.setState({visibleModal: false, buttonLoading: false}),
                  this.props.navigation.goBack();
              }}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary, COLORS.primary]}
                style={{
                  // marginTop: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: 50,
                  // backgroundColor: COLORS.primary,
                  alignSelf: 'center',
                  borderRadius: 50,
                  // marginBottom: 30,
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 25,
                    color: '#FFF',
                    fontFamily: FONTS.fontFamily,
                  }}>
                  اغلاق
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setState({visibleAnswerModal: true});
              }}
              style={{
                // borderColor: 'black',
                borderWidth: 0.5,
                // marginTop: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: COLORS.primary,
                backgroundColor: '#FFF',
                width: '100%',
                height: 50,
                alignSelf: 'center',
                marginTop: 10,
                borderRadius: 50,
                justifyContent: 'center',
                marginBottom: 20,
                elevation: 1,
              }}>
              <Text
                style={{
                  fontSize: 18,
                  //   fontFamily: fontFamily,
                  alignSelf: 'center',
                  textAlign: 'center',
                  marginTop: 5,
                  fontFamily: FONTS.fontFamily,
                }}>
                عرض الامتحان بالاجابات الصحيحه
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    );
  }
  renderModalForAnswers() {
    return (
      <Modal
        animationType="slide"
        // transparent={true}
        visible={this.state.visibleAnswerModal}
        onRequestClose={() => {
          this.setState({visibleAnswerModal: false});
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
                this.setState({visibleAnswerModal: false});
                // this.props.navigation.goBack();
              }}>
              <Icon name="arrow-right" size={20} style={{color: '#fff'}}></Icon>
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
              الأجابات
            </Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>

        <ScrollView style={{marginBottom: 0, backgroundColor: '#fff'}}>
          <FlatList
            ref={(ref) => (this.flatListRef = ref)}
            data={this.state.questions}
            numColumns={1}
            renderItem={({item, index}) =>
              this.renderExamQuestionsWithAnswers(item, index)
            }
            // style={{marginBottom:20}}
          />
          <TouchableOpacity
            disabled={this.state.buttonLoading}
            style={{
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
              width: '88%',
              height: 50,
              backgroundColor: COLORS.primary,
              alignSelf: 'center',
              borderRadius: 10,
              marginBottom: 50,
            }}
            onPress={() => this.setState({visibleAnswerModal: false})}>
            {this.state.buttonLoading == true ? (
              <Spinner color="#fff" size={30} style={{marginTop: 5}} />
            ) : (
              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 25,
                  color: '#FFF',
                  fontFamily: FONTS.fontFamily,
                }}>
                اغلاق
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    );
  }

  scrollToIndex = () => {
    var randomIndex = this.state.index * 10 - 10;

    this.flatListRef.scrollToIndex({index: randomIndex});
  };

  renderExamQuestionsWithAnswers(item, index) {
    return (
      <View
        style={{
          //  backgroundColor:"#ddd",
          width: '90%',
          alignSelf: 'center',
          padding: 10,
          marginTop: 10,
          // borderWidth: 1,
          // borderColor: "#293077"
        }}>
        {item.question_image == null ? null : (
          <View style={{flex: 1, width: '100%', height: 200, marginTop: 30}}>
            <Image
              source={{uri: item.question_image}}
              style={{
                flex: 1,
                width: null,
                height: null,
                // width: '100%',
                // height: 200,
                // alignSelf: 'center',
                // marginTop: 10,
                marginBottom: 30,
                resizeMode: 'contain',
              }}
            />
          </View>
        )}

        <Text
          style={{
            fontSize: 18,
            color: '#293077',
            fontWeight: 'bold',
            fontFamily: FONTS.fontFamily,
          }}>
          {index + 1} ) {item.question_text}
        </Text>

        {item.real_answers.map((index) => {
          return (
            <TouchableOpacity
              disabled={true}
              style={{
                flex: 1,
                // borderColor: 'black',
                borderRadius: 50,
                marginTop: 5,
                flexDirection: 'row',
                // borderColor: COLORS.primary,
                backgroundColor: '#fff',
                elevation: 2,
                borderWidth: 1,
                paddingVertical: 10,
                borderColor:
                  index == item.question_valid_answer
                    ? '#5cb85c'
                    : index == item.chosen_answer
                    ? 'red'
                    : '#ddd',
              }}>
              <Left
                style={{
                  paddingHorizontal: 10,
                  flex: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {index == item.question_valid_answer ? (
                    <View
                      style={{
                        borderColor: '#5cb85c',
                        borderWidth: 1,
                        height: 30,
                        width: 30,
                        borderRadius: 20,
                        backgroundColor: '#5cb85c',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <MaterialIcons
                        name="check"
                        style={{
                          fontSize: 25,
                          color: '#FFF',
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                  ) : index == item.chosen_answer ? (
                    <View
                      style={{
                        borderColor: 'red',
                        borderWidth: 1,
                        height: 30,
                        width: 30,
                        borderRadius: 20,
                        backgroundColor: '#f00',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <MaterialIcons
                        name="close"
                        style={{
                          fontSize: 25,
                          color: '#FFF',
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        borderRadius: 20,
                        backgroundColor: '#ddd',
                      }}
                    />
                  )}
                </View>
                <View style={{flex: 4}}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: FONTS.fontFamily,
                    }}>
                    {index}
                  </Text>
                </View>
              </Left>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  _rowRenderer(data, index) {
    if (index >= this.state.oldIndex * 10 && index < this.state.index * 10) {
      return (
        <View>
          <Animatable.View
            // animation="fadeInRight"
            // delay={100}
            style={{
              //  backgroundColor:"#ddd",
              width: '90%',
              alignSelf: 'center',
              padding: 10,
              marginTop: 10,
              // borderWidth: 1,
              // borderColor: "#293077"
            }}>
            <Text
              style={{
                fontSize: 18,
                color: '#293077',
                fontWeight: 'bold',
                fontFamily: FONTS.fontFamily,
              }}>
              {index + 1} ) {data.question_text}
            </Text>

            {data.question_image == null ? null : (
              <View
                style={{flex: 1, width: '100%', height: 200, marginTop: 30}}>
                <Image
                  source={{uri: data.question_image}}
                  style={{
                    flex: 1,
                    width: null,
                    height: null,
                    // width: '100%',
                    // height: 200,
                    // alignSelf: 'center',
                    // marginTop: 10,
                    marginBottom: 30,
                    resizeMode: 'contain',
                  }}
                />
              </View>
            )}
            {data.real_answers.map((item) => {
              return (
                <TouchableOpacity
                  // animation="fadeInRight"
                  disabled={this.state.buttonLoading}
                  onPress={() => {
                    if (
                      this.state.questions[this.state.questions.indexOf(data)]
                        .chosen_answer != '' &&
                      this.state.questions[this.state.questions.indexOf(data)]
                        .chosen_answer == item
                    ) {
                      let newArray = this.state.questions;
                      newArray[newArray.indexOf(data)].chosen_answer = '';
                      this.setState({questions: newArray});
                    } else {
                      let array =
                        this.state.questions[this.state.questions.indexOf(data)]
                          .real_answers;
                      this.chooseTheAnswer(
                        this.state.questions.indexOf(data),
                        array.indexOf(item),
                      );
                    }
                  }}
                  style={{
                    // borderColor: 'black',
                    // borderWidth: 1,
                    // borderRadius: 50,
                    // marginTop: 5,
                    // flexDirection: 'row',
                    // // borderColor: COLORS.primary,
                    // backgroundColor: '#fff',
                    // elevation: 2,

                    backgroundColor: '#fff',
                    elevation: 1,
                    width: '90%',
                    alignSelf: 'center',
                    // height: 50,
                    marginTop: 20,
                    padding: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 20,
                    flex: 1,

                    // paddingBottom: 10,
                    // paddingLeft: 10,
                    // paddingTop: 10,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {item != data.chosen_answer ? (
                      <View
                        style={{
                          borderColor: COLORS.primary,
                          // borderWidth: 1,
                          marginRight: 10,
                          height: 30,
                          width: 30,
                          borderRadius: 20,
                          backgroundColor: '#DDD',
                        }}></View>
                    ) : (
                      <View
                        style={{
                          height: 30,
                          width: 30,
                          borderRadius: 20,
                          backgroundColor: '#5cb85c',
                          marginRight: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <MaterialIcons
                          name="check"
                          style={{fontSize: 26, color: '#FFF'}}
                        />
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      flex: 4,
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        textAlign: 'left',
                        fontFamily: FONTS.fontFamily,
                        // color:'#FFF'
                      }}>
                      {item}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </Animatable.View>
          {index + 1 == this.state.questions.length &&
          this.state.status == 'not_done' ? (
            <TouchableOpacity
              disabled={this.state.buttonLoading}
              style={{
                marginTop: 40,
                alignItems: 'center',
                justifyContent: 'center',
                width: '88%',
                height: 50,
                backgroundColor: COLORS.primary,
                alignSelf: 'center',
                borderRadius: 10,
                marginBottom: 30,
              }}
              onPress={() => this.getDegreeOfExam()}>
              {this.state.buttonLoading == true ? (
                <Spinner color="#fff" size={30} style={{marginTop: 5}} />
              ) : (
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 25,
                    color: '#FFF',
                    fontFamily: FONTS.fontFamily,
                  }}>
                  انهاء
                </Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>
      );
    }
  }

  chooseTheAnswer(opjectIndex, answerIndex) {
    let newArray = this.state.questions;
    newArray[opjectIndex].chosen_answer =
      newArray[opjectIndex].real_answers[answerIndex];
    this.setState({questions: newArray});
  }
  async getDegreeOfExam() {
    if (this.state.connection_Status == 'Online') {
      let validate = 0;
      let newArray = this.state.questions;
      let length = newArray.length;
      let fullMark = newArray.length;

      for (var i = 0; i < length; i++) {
        if (newArray[i].chosen_answer != '') {
          validate++;
        }
      }

      let studenDegree = 0;
      let AllQuestionString = '';
      for (let i = 0; i < length; i++) {
        if (newArray[i].chosen_answer == newArray[i].question_valid_answer) {
          studenDegree++;
          if (i == newArray.length - 1) {
            AllQuestionString +=
              newArray[i].question_id +
              '***' +
              '1' +
              '***' +
              newArray[i].chosen_answer;
          } else {
            AllQuestionString +=
              newArray[i].question_id +
              '***' +
              '1' +
              '***' +
              newArray[i].chosen_answer +
              '***camp_coding***';
          }
        } else {
          if (i == newArray.length - 1) {
            AllQuestionString +=
              newArray[i].question_id +
              '***' +
              '0' +
              '***' +
              newArray[i].chosen_answer;
          } else {
            AllQuestionString +=
              newArray[i].question_id +
              '***' +
              '0' +
              '***' +
              newArray[i].chosen_answer +
              '***camp_coding***';
          }
        }
      }
      let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));

      let data_to_send = {
        id: this.state.quizId,
        student_id: this.state.student_id,
        score: studenDegree + '/' + fullMark,
        all_question: AllQuestionString,
        subject_id: drInfo.subject_id,
      };

      this.setState({buttonLoading: true});
      if (this.state.connection_Status == 'Online') {
        axios
          .post(AppRequired.Domain + 'upload_score.php', data_to_send)
          .then((res) => {
            this.setState({buttonLoading: false});

            if (res.data) {
              // console.log(res.data);
              if (res.data == 'success') {
                let precent = (studenDegree / fullMark) * 100;
                this.setState({
                  visibleModal: true,
                  percent: precent,
                  status: 'done',
                });
              } else {
                Alert.alert(
                  AppRequired.appName + '',
                  'هناك خطأ ما في استرجاع بيانات الامتحان',
                );
              }
            }
          });
      } else {
        this.setState({buttonLoading: false});
        Alert.alert(
          AppRequired.appName + '',
          'من فضلك تحقق من اتصالك بالأنترنت',
          [
            {
              text: '',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'حسنا', onPress: () => console.log('OK Pressed')},
          ],
        );
      }

      this.setState({fullDegree: fullMark, studenDegree: studenDegree});
    } else {
      this.setState({failedgetDegreeOfExamModal: true});
    }
  }

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
      <Container style={{backgroundColor: '#f8f8f8', paddingBottom: 20}}>
        {/* {alertheaderText(this.state.questions.length)} */}
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
                this.setState({LogoutModal: true});
                // Alert.alert(
                //   appName + '',
                //   'اذا خرجت الان سيتم اعتبار هذا الامتحان محلولا,هل ما زلت تريد الخروج ؟',
                //   [
                //     {
                //       text: 'لا',
                //       onPress: () => console.log('Cancel Pressed'),
                //       style: 'cancel',
                //     },
                //     { text: 'نعم', onPress: () => this.getDegreeOfExam() },
                //   ],
                //   { cancelable: false },
                // );
                // this.props.navigation.goBack();
              }}>
              <Icon name="arrow-right" size={20} style={{color: '#fff'}}></Icon>
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
              {this.state.quiz_name}
            </Text>
          </View>
          <View style={{flex: 1}}></View>
        </View>
        {this.state.loading == true &&
        this.state.connection_Status == 'Online' ? (
          <Spinner color={COLORS.primary} size={30} style={{marginTop: 200}} />
        ) : this.state.loading == false ? (
          <View>
            <View
              style={{
                alignSelf: 'center',
                height: 50,
                width: '60%',
                borderWidth: 2,
                borderColor: '#ddd',
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                marginBottom: 10,
                borderRadius: 50,
              }}>
              {/* <MaterialIcons
                  name="timer"
                  size={25}
                  style={{ color: " #8A3982", marginTop: 10, margin: 10 }}
                /> */}
              {this.state.status == 'not_done' ? (
                <CountDown
                  style={{
                    width: 100,
                    opacity: this.state.status == 'not_done' ? 1 : 0,
                    alignSelf: 'center',
                  }}
                  size={20}
                  until={this.state.timer}
                  onFinish={() => {
                    this.state.status == 'not_done'
                      ? this.getDegreeOfExam()
                      : null;
                  }}
                  digitStyle={{width: 30, height: 40}}
                  digitTxtStyle={{color: COLORS.primary}}
                  timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
                  separatorStyle={{color: 'green'}}
                  timeToShow={['S', 'M', 'H']}
                  timeLabels={{h: null, m: null, s: ''}}
                  showSeparator
                />
              ) : (
                <Text
                  style={{
                    color: '#293077',
                    width: 110,
                    height: 35,
                    fontSize: 20,
                    fontWeight: 'bold',
                    marginTop: 8,
                  }}>
                  00 : 00 : 00
                </Text>
              )}
            </View>
            {/* <ScrollView style={{marginBottom: 0}}> */}
            {this.state.status == 'not_done' ? (
              <View
                style={{
                  width: width,
                  height: height * 0.755,
                  paddingBottom: 50,
                }}>
                <FlatList
                  ref={(ref) => (this.flatListRef = ref)}
                  onScrollToIndexFailed={this.scrollToIndexFailed.bind(this)}
                  data={this.state.questions}
                  numColumns={1}
                  renderItem={({item, index}) => this._rowRenderer(item, index)}
                  onEndReached={() => {
                    if (
                      this.state.index ==
                        Math.ceil(this.state.questions.length / 10) &&
                      this.state.EndScroll == 1
                    ) {
                      this.scrollToIndex();
                    }
                  }}
                  onScrollEndDrag={() => {
                    if (
                      this.state.index ==
                      Math.ceil(this.state.questions.length / 10)
                    ) {
                      this.setState({EndScroll: 2});
                    } else {
                      this.setState({EndScroll: 1});
                    }
                  }}
                />
              </View>
            ) : null}
            {/* </ScrollView> */}
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

        <View style={styles.footer}>
          {this.state.oldIndex != 0 ? (
            <TouchableOpacity
              onPress={() => {
                this.praviousFunction();
              }}
              style={{
                height: 30,
                width: 30,
                borderRadius: 20,
                marginLeft: '3%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="arrow-right" size={20} style={{color: '#fff'}}></Icon>
            </TouchableOpacity>
          ) : (
            <View style={{width: 30, marginLeft: '3%'}} />
          )}
          {this.state.questions.length / 10 >= 10 ? (
            <ScrollView
              style={{
                flexWrap: 'nowrap',
                flexDirection: 'row',
                paddingHorizontal: 20,
                width: '100%',
                //   backgroundColor: 'red',
              }}
              horizontal={true}>
              {this.state.arr.map((item) => (
                <TouchableOpacity
                  onPress={() => {
                    this.scrollToIndex(),
                      this.setState({
                        index: this.state.arr.indexOf(item) + 1,
                        oldIndex: this.state.arr.indexOf(item),
                      });
                    // alert("hi")
                    // alert(this.state.arr.indexOf(item)+1)
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    backgroundColor:
                      this.state.oldIndex == index ? COLORS.primary : '#FFF',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 5,
                    elevation: 1,
                  }}>
                  <Text
                    style={{
                      color: this.state.oldIndex == index ? '#fff' : '#000',
                      fontSize: 18,
                      fontFamily: FONTS.fontFamily,
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={{flexDirection: 'row'}}>
              {this.state.arr.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    this.scrollToIndex(),
                      this.setState({
                        index: this.state.arr.indexOf(item) + 1,
                        oldIndex: this.state.arr.indexOf(item),
                      });
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    backgroundColor:
                      this.state.oldIndex == index ? '#fff' : COLORS.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 5,
                    borderWidth: 1,
                    borderColor: '#fff',

                    elevation: 1,
                  }}>
                  <Text
                    style={{
                      color: this.state.oldIndex == index ? '#000' : '#FFF',
                      fontSize: 18,
                      fontFamily: FONTS.fontFamily,
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {this.state.oldIndex == this.state.arr.length - 1 ? (
            <View style={{width: 30, marginRight: '3%'}} />
          ) : (
            <TouchableOpacity
              onPress={() => {
                this.NextFunction();
              }}
              style={{
                height: 30,
                width: 30,
                borderRadius: 20,
                marginRight: '3%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="arrow-left" size={20} style={{color: '#fff'}}></Icon>
            </TouchableOpacity>
          )}
        </View>
        {this.renderModal()}
        {this.renderModalForAnswers()}
        <Modal
          visible={this.state.LogoutModal}
          onRequestClose={() => {
            this.setState({LogoutModal: false});
          }}
          transparent={true}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                width: '90%',
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
                  اذا خرجت الان سيتم اعتبار هذا الامتحان محلولا,هل ما زلت تريد
                  الخروج ؟
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
                  marginTop: 7,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRightWidth: 1,
                    borderRightColor: '#ddd',
                  }}
                  onPress={() => {
                    this.getDegreeOfExam();
                    this.setState({LogoutModal: false});
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.primary,
                      fontSize: 20,
                    }}>
                    نعم
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderLeftWidth: 1,
                    borderLeftColor: '#ddd',
                  }}
                  onPress={() => {
                    this.setState({LogoutModal: false});
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
        <Modal
          visible={this.state.failedgetDegreeOfExamModal}
          onRequestClose={() => {
            this.setState({failedgetDegreeOfExamModal: false});
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
                  الرجاء التحقق من أتصال الانترنت
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
                    this.setState({failedgetDegreeOfExamModal: false});
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
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  footer: {
    width: '100%',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
  },
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
