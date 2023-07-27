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
  ToastAndroid,
  RefreshControl,
  Modal,
  StatusBar,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {Container, Spinner, Root} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';

import axios from 'axios';

const {width, height} = Dimensions.get('window');
import NetInfo from '@react-native-community/netinfo';
import {NavigationEvents} from 'react-navigation';
// import {Domain} from '../Domain';

// i will import modal for cash solution;
// import Modal from 'react-native-modalbox';
import {ScrollView} from 'react-native-gesture-handler';
import {AppRequired, COLORS, FONTS, images} from '../../constants';

export default class ExamList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      generation_id: '',
      student_id: '',
      exams: [],
      loading: true,
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: '',
      confirmModalVisible: false,
      disableModal: false,
      loadingModal: true,
      refreshing: false,
      AlertBeforeExam: false,
      item: {},
      selected_exams_type: 0,
      drInfo: {},
    };
  }

  async CustomcomponentDidMount() {
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));
    this.setState({
      drInfo,
    });
    if (data != null) {
      this.setState({
        student_id: data.student_id,
        generation_id: data.student_generation_id,
        studentName: data.student_name,
      });
      // alert( data.student_id)
      this.get_exams(data.student_generation_id, data.student_id);
    }

    const unsubscribe = NetInfo.addEventListener(async (state) => {
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
          loading: false,
        });
        Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
      }
    });
  }

  _onRefresh = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));
    this.setState({
      drInfo,
    });
    if (data != null) {
      this.setState({
        student_id: data.student_id,
        generation_id: data.student_generation_id,
        studentName: data.student_name,
      });
      this.get_exams(data.student_generation_id, data.student_id);
    }
  };

  get_exams(generation_id, student_id) {
    // this.setState({disabled: true});
    this.setState({loading: true});

    let data_to_send = {
      generation_id: generation_id,
      student_id: student_id,
      subject_id: this.state.drInfo.subject_id,
    };
    let domainName =
      this.state.selected_exams_type == 0
        ? `select_exam.php`
        : 'select_exam_video.php';
    axios.post(AppRequired.Domain + domainName, data_to_send).then((res) => {
      // alert(JSON.stringify(res.data))
      this.setState({loading: false});
      if (res.status == 200) {
        // alert(JSON.stringify(res.data))
        if (res.data != 'error') {
          if (Array.isArray(res.data.exams)) {
            if (res.data.exams.length > 0) {
              this.setState({
                exams: res.data.exams,
                refreshing: false,
              });
            } else {
              this.setState({
                exams: [],
                refreshing: false,
              });
            }
            // console.log(this.state.exams)
          } else {
            this.setState({
              exams: [],
              refreshing: false,
            });
          }
        } else {
          Alert.alert(
            AppRequired.appName + '',
            'عذرا يرجي المحاوله في وقتا لاحق',
          );
          this.setState({
            refreshing: false,
          });
        }
      } else {
        Alert.alert(
          AppRequired.appName + '',
          'عذرا يرجي المحاوله في وقتا لاحق',
        );
        this.setState({
          refreshing: false,
        });
      }
      // this.setState({loading: false})
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
    this.setState({AlertBeforeExam: false});
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    this.setState({
      loading: true,
    });
    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));

    // if (this.state.connection_Status == 'Online') {
    let data_to_send = {
      quizId: quizID,
      student_id: data.student_id,
      score: 0,
      subject_id: drInfo.subject_id,
    };
    // console.log(data_to_send);
    axios
      .post(AppRequired.Domain + 'add_first_score_exam_quiz.php', data_to_send)
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
        // this.setState({
        //   confirmModalVisible: false,
        //   disableModal: false,
        //   loadingModal: false,
        // });
      });
    // } else {
    //   Alert.alert(appName + '', 'لا يوجد اتصال بالانترنت!');
    // }
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
      <Root>
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
                الامتحانات
              </Text>
            </View>
            <View style={{flex: 1}} />
          </View>

          {/* <View
            style={{
              // flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginVertical: 10,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                this.setState({
                  selected_exams_type: 0,
                });
                this._onRefresh();
              }}
              style={{
                width: '40%',
                paddingVertical: 10,
                borderRadius: 100,
                backgroundColor:
                  this.state.selected_exams_type == 0 ? COLORS.primary : '#fff',
                elevation: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: FONTS.fontFamily,
                  fontSize: 18,
                  color: this.state.selected_exams_type == 0 ? '#fff' : '#000',
                }}>
                الحصص
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                this.setState({
                  selected_exams_type: 1,
                });
                this._onRefresh();
              }}
              activeOpacity={0.8}
              style={{
                width: '40%',
                paddingVertical: 10,
                borderRadius: 100,
                backgroundColor:
                  this.state.selected_exams_type == 1 ? COLORS.primary : '#fff',
                elevation: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: FONTS.fontFamily,
                  fontSize: 18,
                  color: this.state.selected_exams_type == 1 ? '#fff' : '#000',
                }}>
                الفيديوهات
              </Text>
            </TouchableOpacity>
          </View> */}

          {
            // <Text>{item.exam_name}</Text>
          }
          {this.state.loading == true ? (
            <View
              style={{
                width: width,
                height: height * 0.5,
                alignItems: 'center',
                justifyContent: 'center',
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
          ) : this.state.loading == false ? (
            <View>
              {this.state.exams.length == 0 ? (
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
                      height: height * 0.8,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 25,
                        color: COLORS.fontColor,
                        fontFamily: FONTS.fontFamily,
                      }}>
                      لا توجد امتحانات
                    </Text>
                  </View>
                </ScrollView>
              ) : (
                <>
                  <View style={{marginVertical: 15}}>
                    <FlatList
                      refreshControl={
                        <RefreshControl
                          colors={[COLORS.primary, COLORS.primary]}
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh.bind(this)}
                        />
                      }
                      data={this.state.exams}
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
                                index == this.state.exams.length - 1 ? 60 : 10,
                            }}
                            onPress={() => {
                              this.setState({
                                AlertBeforeExam: true,
                                item: item,
                              });
                            }}>
                            <View style={{width: '85%'}}>
                              <Text
                                style={{
                                  fontSize: 22,
                                  color: '#16181B',
                                  fontFamily: FONTS.fontFamily,
                                }}>
                                {item.exam_name}
                              </Text>
                              {item.exam_time_type == 0 ? null : ( // =======>  notEdit
                                <Text
                                  style={{
                                    textAlign: 'left',
                                    marginTop: 15,
                                    color: '#767D80',
                                  }}>
                                  {item.exam_time_type == 0
                                    ? null
                                    : item.exam_time / 60 == 1
                                    ? item.exam_time / 60 + ' Minute'
                                    : item.exam_time / 60 + ' Minutes'}
                                </Text>
                              )}
                            </View>
                            <View style={{justifyContent: 'center'}}>
                              {item.exam_time_type == 0 ? (
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
                      keyExtractor={(item) => item.exam_id}
                      extraData={this.state.exams}
                    />
                  </View>
                </>
              )}
            </View>
          ) : this.state.connection_Status != 'Offline' ? null : (
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
          <ViewConnectionMsg ConnectionEnter="لا يوجد اتصال بالأنترنت" />

          <Modal
            visible={this.state.AlertBeforeExam}
            onRequestClose={() => {
              this.setState({AlertBeforeExam: false});
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
                    لاحظ انه سيتم احتساب النتيجه صفر لحين حل الامتحان لذا يجب
                    عليك حل الامتحان مع عدم الخروج منه{' '}
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
                      if (this.state.item.exam_type == '000') {
                        // alert(item.exam_type);

                        // showToastAlertExam();
                        let quiz_id = 'Exam_' + this.state.item.exam_id;
                        let quiz_name = this.state.item.exam_name;
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
                      } else if (this.state.item.exam_type == '001') {
                        // alert(item.exam_type);

                        // showToastAlertExam();
                        let quiz_id = 'Exam_' + this.state.item.exam_id;
                        let quiz_name = this.state.item.exam_name;
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
                      } else if (this.state.item.exam_type == '010') {
                        // alert(item.exam_type);

                        // showToastAlertExam();
                        let quiz_id = 'Exam_' + this.state.item.exam_id;
                        let quiz_name = this.state.item.exam_name;
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
                          this.state.item.exam_time,
                        );
                      } else if (this.state.item.exam_type == '011') {
                        // alert(item.exam_type);

                        // showToastAlertExam();
                        let quiz_id = 'Exam_' + this.state.item.exam_id;
                        let quiz_name = this.state.item.exam_name;
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
                          this.state.item.exam_time,
                        );
                      } else if (this.state.item.exam_type == '100') {
                        // alert(item.exam_type);

                        // showToastAlertExam();
                        let quiz_id = 'Exam_' + this.state.item.exam_id;
                        let quiz_name = this.state.item.exam_name;
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
                      } else if (this.state.item.exam_type == '101') {
                        // alert(item.exam_type);

                        // showToastAlertExam();
                        let quiz_id = 'Exam_' + this.state.item.exam_id;
                        let quiz_name = this.state.item.exam_name;
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
                      } else if (this.state.item.exam_type == '110') {
                        // alert(item.exam_type);

                        // showToastAlertExam();
                        let quiz_id = 'Exam_' + this.state.item.exam_id;
                        let quiz_name = this.state.item.exam_name;
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
                          this.state.item.exam_time, // ===========> Edit
                        );
                      } else if (this.state.item.exam_type == '111') {
                        // alert(item.exam_type);

                        // showToastAlertExam();
                        let quiz_id = 'Exam_' + this.state.item.exam_id;
                        let quiz_name = this.state.item.exam_name;
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
                          this.state.item.exam_time,
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
                      this.setState({AlertBeforeExam: false});
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
      </Root>
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
