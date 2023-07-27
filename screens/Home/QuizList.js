import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
  Animated,
  Image,
  RefreshControl,
  ScrollView,
  NativeModules,
  StatusBar,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Spinner,
} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

import NetInfo from '@react-native-community/netinfo';
import {NavigationEvents} from 'react-navigation';

import {AppRequired, COLORS, FONTS, images} from '../../constants';
const {width, height} = Dimensions.get('window');

export default class QuizList extends React.Component {
  //constructor

  constructor(props) {
    super(props);

    this.state = {
      generation_id: '',
      student_id: '',
      quiz: [],
      loading: true,
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Online',
      AlertBeforeQuiz: false,
      item: {},
    };
    this._subscription;
  }

  async CustomcomponentDidMount() {
    // this._subscription = NetInfo.addEventListener(
    //   this._handelConnectionInfoChange,
    // );

    this.allowFunction();

    const data = JSON.parse(await AsyncStorage.getItem('AllData'));

    if (data != null) {
      this.setState({
        student_id: data.student_id,
        generation_id: data.student_generation_id,
      });
      this.get_quiz();
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
  }

  allowFunction = async () => {
    try {
      const result = await NativeModules.PreventScreenshotModule.allow();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  _onRefresh = async () => {
    this.get_quiz();
  };

  navigationModal(item) {}

  // _handelConnectionInfoChange = async (NetInfoState) => {
  //   const data = JSON.parse(await AsyncStorage.getItem('AllData'));
  //   if (NetInfoState.isConnected == true) {
  //     this.setState(({}) => ({
  //       connection_Status: 'Online',
  //     }));

  //     if (data != null) {
  //       this.setState({
  //         student_id: data.student_id,
  //         generation_id: data.student_generation_id,
  //       });
  //       this.get_quiz();
  //     }

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

  get_quiz() {
    this.setState({loading: true});
    let data_to_send = {
      generation_id: this.state.generation_id,
      student_id: this.state.student_id,
    };
    // let data_to_send = {
    //   generation_id: "12",
    //   student_id: "139",
    // };
    axios
      .post(AppRequired.Domain + `select_quiz.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // alert(JSON.stringify(res.data))
          if (res.data != 'error') {
            if (res.data.Quiz.length > 0) {
              this.setState({
                quiz: res.data.Quiz,
              });
              // console.log(this.state.quiz)
            } else {
              this.setState({
                quiz: [],
              });
            }
          } else {
            Alert.alert(
              AppRequired.appName + '',
              'عذرا يرجي المحاوله في وقتا لاحق',
            );
          }
        } else {
          Alert.alert(
            AppRequired.appName + '',
            'عذرا يرجي المحاوله في وقتا لاحق',
          );
        }
        this.setState({loading: false});
      });
  }

  makeRequestToSaveDefaultScore = async (
    quizID,
    quizName,
    failedVideo,
    passVideo,
    goodVideo,
    veryGoodVideo,
    excellentVideo,
    navigationPage,
    timer,
  ) => {
    this.setState({AlertBeforeQuiz: false});
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));

    if (this.state.connection_Status == 'Online') {
      this.setState({
        loading: true,
      });
      let data_to_send = {
        quizId: quizID,
        student_id: data.student_id,
        score: 0,
      };
      console.log(data_to_send);
      axios
        .post(
          AppRequired.Domain + 'add_first_score_exam_quiz.php',
          data_to_send,
        )
        .then((response) => {
          this.setState({
            loading: false,
          });
          if (response.data.trim() == 'success') {
            this.setState({
              confirmModalVisible: false,
              // disableModal: false,
              loadingModal: false,
            });
            if (timer != '' || timer != undefined || timer != null) {
              this.props.navigation.navigate(navigationPage, {
                quiz_id: quizID,
                quiz_name: quizName,
                failed_video: failedVideo,
                pass_video: passVideo,
                good_video: goodVideo,
                very_good_video: veryGoodVideo,
                excellent_video: excellentVideo,
                timer: timer,
                refrish: this.componentDidMount,
              });
            } else {
              this.props.navigation.navigate(navigationPage, {
                quiz_id: quizID,
                quiz_name: quizName,
                failed_video: failedVideo,
                pass_video: passVideo,
                good_video: goodVideo,
                very_good_video: veryGoodVideo,
                excellent_video: excellentVideo,
                refrish: this.componentDidMount,
              });
            }
          } else {
            this.setState({
              confirmModalVisible: false,
              // disableModal: false,
              loadingModal: false,
            });
            Alert.alert(
              AppRequired.appName + '',
              'حدث خطأ ما. الرجاء المحاوله لاحقا',
            );
          }
        })
        .catch((error) => {
          Alert.alert(
            AppRequired.appName + '',
            'حدث خطأ ما. الرجاء المحاوله لاحقا',
          );
          this.setState({
            confirmModalVisible: false,
            // disableModal: false,
            loadingModal: false,
          });
        });
    } else {
      Alert.alert(AppRequired.appName + '', 'لا يوجد اتصال بالانترنت!');
      this.setState({
        confirmModalVisible: false,
        // disableModal: false,
      });
    }
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

    const showToastAlertExam = () => {
      Alert.alert(
        AppRequired.appName + '',
        'لاحظ انه سيتم احتساب النتيجه صفر لحين حل الامتحان لذا يجب عليك حل الامتحان مع عدم الخروج منه ',
        [
          {
            text: '',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'حسنا', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    };

    return (
      <Container style={{backgroundColor: '#f7f7f7'}}>
        <NavigationEvents onDidFocus={() => this.CustomcomponentDidMount()} />

        <StatusBar
          backgroundColor={COLORS.secondary}
          barStyle="light-content"
        />

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
              <Icon
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
              الواجبات
            </Text>
          </View>
          <View style={{flex: 1}} />
        </View>

        {this.state.loading == true &&
        this.state.connection_Status == 'Online' ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
                colors={[COLORS.primary, COLORS.primary]}
              />
            }>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: height - 50,
              }}>
              <Image
                source={images.mainLoading}
                style={{
                  width: 100,
                  height: 100,
                }}
                resizeMode="contain"
              />
            </View>
          </ScrollView>
        ) : this.state.loading == false ? (
          <View>
            {this.state.quiz.length == 0 ? (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh.bind(this)}
                    colors={[COLORS.primary, COLORS.primary]}
                  />
                }>
                <View
                  style={{
                    width: width,
                    height: height - 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 25,
                      color: COLORS.primary,
                      fontFamily: FONTS.fontFamily,
                    }}>
                    لا يوجد واجبات
                  </Text>
                </View>
              </ScrollView>
            ) : (
              <View style={{marginVertical: 15}}>
                <FlatList
                  refreshControl={
                    <RefreshControl
                      colors={[COLORS.primary, COLORS.primary]}
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh.bind(this)}
                    />
                  }
                  data={this.state.quiz}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        style={{
                          width: '90%',
                          alignSelf: 'center',
                          paddingHorizontal: 12,
                          paddingVertical: 15,
                          borderLeftWidth: 8,
                          borderLeftColor: COLORS.primary,
                          borderRadius: 7,
                          backgroundColor: '#FFF',
                          marginBottom: 10,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom:
                            index == this.state.quiz.length - 1 ? 60 : 10,
                        }}
                        onPress={() => {
                          this.setState({AlertBeforeQuiz: true, item: item});

                          // if (item.quiz_type == '000') {
                          //   showToastAlertExam();
                          //   let quiz_id = 'Quiz_' + item.quiz_id;
                          //   let quiz_name = item.quiz_name;
                          //   this.makeRequestToSaveDefaultScore(
                          //     quiz_id,
                          //     quiz_name,
                          //     'FullPageExam',
                          //   );
                          // } else if (item.quiz_type == '001') {
                          //   showToastAlertExam();
                          //   let quiz_id = 'Quiz_' + item.quiz_id;
                          //   let quiz_name = item.quiz_name;
                          //   this.makeRequestToSaveDefaultScore(
                          //     quiz_id,
                          //     quiz_name,
                          //     'FullPageExamWithAnswers',
                          //   );
                          // } else if (item.quiz_type == '010') {
                          //   showToastAlertExam();
                          //   let quiz_id = 'Quiz_' + item.quiz_id;
                          //   let quiz_name = item.quiz_name;
                          //   this.makeRequestToSaveDefaultScore(
                          //     quiz_id,
                          //     quiz_name,
                          //     'FullPageTimerExam',
                          //     item.quiz_time,
                          //   );
                          // } else if (item.quiz_type == '011') {
                          //   showToastAlertExam();
                          //   let quiz_id = 'Quiz_' + item.quiz_id;
                          //   let quiz_name = item.quiz_name;
                          //   this.makeRequestToSaveDefaultScore(
                          //     quiz_id,
                          //     quiz_name,
                          //     'FullPageTimerAnswerdExam',
                          //     item.quiz_time,
                          //   );
                          // } else if (item.quiz_type == '100') {
                          //   showToastAlertExam();
                          //   let quiz_id = 'Quiz_' + item.quiz_id;
                          //   let quiz_name = item.quiz_name;
                          //   this.makeRequestToSaveDefaultScore(
                          //     quiz_id,
                          //     quiz_name,
                          //     'QuizQutionsWithoutTime',
                          //   );
                          // } else if (item.quiz_type == '101') {
                          //   showToastAlertExam();
                          //   let quiz_id = 'Quiz_' + item.quiz_id;
                          //   let quiz_name = item.quiz_name;
                          //   this.makeRequestToSaveDefaultScore(
                          //     quiz_id,
                          //     quiz_name,
                          //     'QuizQuationWithoutTime2',
                          //   );
                          // } else if (item.quiz_type == '110') {
                          //   showToastAlertExam();
                          //   let quiz_id = 'Quiz_' + item.quiz_id;
                          //   let quiz_name = item.quiz_name;
                          //   this.makeRequestToSaveDefaultScore(
                          //     quiz_id,
                          //     quiz_name,
                          //     'QuizQuationWithTime',
                          //     item.quiz_time,
                          //   );
                          // } else if (item.quiz_type == '111') {
                          //   showToastAlertExam();
                          //   let quiz_id = 'Quiz_' + item.quiz_id;
                          //   let quiz_name = item.quiz_name;
                          //   this.makeRequestToSaveDefaultScore(
                          //     quiz_id,
                          //     quiz_name,
                          //     'QuizPageWithTimeCheck',
                          //     item.quiz_time,
                          //   );
                          // }
                        }}>
                        <View style={{width: '85%'}}>
                          <Text
                            style={{
                              fontSize: 22,
                              color: '#444',
                              fontFamily: FONTS.fontFamily,
                            }}>
                            {item.quiz_name}
                          </Text>
                          {item.quiz_time_type == 0 ? null : (
                            <Text
                              style={{
                                textAlign: 'left',
                                marginTop: 15,
                                color: '#767D80',
                              }}>
                              {item.quiz_time_type == 0
                                ? null
                                : item.quiz_time / 60 == 1
                                ? item.quiz_time / 60 + ' Minute'
                                : item.quiz_time / 60 + ' Minutes'}
                            </Text>
                          )}
                        </View>

                        <View style={{justifyContent: 'center'}}>
                          {/* <Icon2
                            name={
                              item.quiz_time_type == 0 ? 'timer-off' : 'timer'
                            }
                            style={{
                              fontSize: 30,
                              color: color,
                              marginLeft: 10,
                            }}
                          /> */}

                          {item.quiz_time_type == 0 ? (
                            <Image
                              source={images.timeIconOff}
                              style={{
                                width: 40,
                                height: 40,
                                tintColor: COLORS.primary,
                              }}
                            />
                          ) : (
                            <Image
                              source={images.timeIcon}
                              style={{
                                width: 40,
                                height: 40,
                                tintColor: COLORS.primary,
                              }}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
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

        <Modal
          visible={this.state.AlertBeforeQuiz}
          onRequestClose={() => {
            this.setState({AlertBeforeQuiz: false});
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
                  لاحظ انه سيتم احتساب النتيجه صفر لحين حل الامتحان لذا يجب عليك
                  حل الامتحان مع عدم الخروج منه{' '}
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
                    if (this.state.item.quiz_type == '000') {
                      let quiz_id = 'Quiz_' + this.state.item.quiz_id;
                      let quiz_name = this.state.item.quiz_name;
                      let failed_video = this.state.item.failed_video;
                      let pass_video = this.state.item.pass_video;
                      let good_video = this.state.item.good_video;
                      let very_good_video = this.state.item.very_good_video;
                      let excellent_video = this.state.item.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'FullPageExam',
                      );
                    } else if (this.state.item.quiz_type == '001') {
                      let quiz_id = 'Quiz_' + this.state.item.quiz_id;
                      let quiz_name = this.state.item.quiz_name;
                      let failed_video = this.state.item.failed_video;
                      let pass_video = this.state.item.pass_video;
                      let good_video = this.state.item.good_video;
                      let very_good_video = this.state.item.very_good_video;
                      let excellent_video = this.state.item.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'FullPageExamWithAnswers',
                      );
                    } else if (this.state.item.quiz_type == '010') {
                      let quiz_id = 'Quiz_' + this.state.item.quiz_id;
                      let quiz_name = this.state.item.quiz_name;
                      let failed_video = this.state.item.failed_video;
                      let pass_video = this.state.item.pass_video;
                      let good_video = this.state.item.good_video;
                      let very_good_video = this.state.item.very_good_video;
                      let excellent_video = this.state.item.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'FullPageTimerExam',
                        this.state.item.quiz_time,
                      );
                    } else if (this.state.item.quiz_type == '011') {
                      let quiz_id = 'Quiz_' + this.state.item.quiz_id;
                      let quiz_name = this.state.item.quiz_name;
                      let failed_video = this.state.item.failed_video;
                      let pass_video = this.state.item.pass_video;
                      let good_video = this.state.item.good_video;
                      let very_good_video = this.state.item.very_good_video;
                      let excellent_video = this.state.item.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'FullPageTimerAnswerdExam',
                        this.state.item.quiz_time,
                      );
                    } else if (this.state.item.quiz_type == '100') {
                      let quiz_id = 'Quiz_' + this.state.item.quiz_id;
                      let quiz_name = this.state.item.quiz_name;
                      let failed_video = this.state.item.failed_video;
                      let pass_video = this.state.item.pass_video;
                      let good_video = this.state.item.good_video;
                      let very_good_video = this.state.item.very_good_video;
                      let excellent_video = this.state.item.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'QuizQutionsWithoutTime',
                      );
                    } else if (this.state.item.quiz_type == '101') {
                      let quiz_id = 'Quiz_' + this.state.item.quiz_id;
                      let quiz_name = this.state.item.quiz_name;
                      let failed_video = this.state.item.failed_video;
                      let pass_video = this.state.item.pass_video;
                      let good_video = this.state.item.good_video;
                      let very_good_video = this.state.item.very_good_video;
                      let excellent_video = this.state.item.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'QuizQuationWithoutTime2',
                      );
                    } else if (this.state.item.quiz_type == '110') {
                      let quiz_id = 'Quiz_' + this.state.item.quiz_id;
                      let quiz_name = this.state.item.quiz_name;
                      let failed_video = this.state.item.failed_video;
                      let pass_video = this.state.item.pass_video;
                      let good_video = this.state.item.good_video;
                      let very_good_video = this.state.item.very_good_video;
                      let excellent_video = this.state.item.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'QuizQuationWithTime',
                        this.state.item.quiz_time,
                      );
                    } else if (this.state.item.quiz_type == '111') {
                      let quiz_id = 'Quiz_' + this.state.item.quiz_id;
                      let quiz_name = this.state.item.quiz_name;
                      let failed_video = this.state.item.failed_video;
                      let pass_video = this.state.item.pass_video;
                      let good_video = this.state.item.good_video;
                      let very_good_video = this.state.item.very_good_video;
                      let excellent_video = this.state.item.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'QuizPageWithTimeCheck',
                        this.state.item.quiz_time,
                      );
                    }
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.primary,
                      fontSize: 20,
                    }}>
                    دخول
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
                    this.setState({AlertBeforeQuiz: false});
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
