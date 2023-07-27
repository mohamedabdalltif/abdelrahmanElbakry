import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Animated,
  ScrollView,
  Alert,
  Linking,
  SafeAreaView,
  StatusBar,
  Button,
  FlatList,
  BackHandler,
  Image,
  NativeModules,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {
  Left,
  Right,
  Toast,
  Root,
  // Icon,
  Spinner,
  Header,
  Body,
  Title,
} from 'native-base';
// import ProgressCircle from 'react-native-progress-circle'
import ProgressCircle from 'rn-animated-progress-circle';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import Icons from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import ProgressBar from 'react-native-progress/Bar';
import LinearGradient from 'react-native-linear-gradient';

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Counter from 'react-native-animated-counter';
import NetInfo from '@react-native-community/netinfo';
const {width, height} = Dimensions.get('window');
// import {Domain} from '../Domain';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {AppRequired, COLORS, FONTS, images} from '../../constants';
export default class QuizInOnePageWithTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      status: 'not_done',
      fullDegree: 0,
      studenDegree: 0,
      visibleModal: false,
      percent: '',
      correctCount: 0,
      color: '#ddd',

      activeQuestionIndex: 0,
      answered: false,
      answerCorrect: false,
      count: 1,
      AnswerIndex: '',
      AllAnswers: [],
      visibleModalAnswer: false,
      FinshExam: false,
      change: true,
      disabel: false,
      time: 40,

      loading: true,

      stopTimer: true,
      index: '',
      quizId: this.props.navigation.getParam('quiz_id'),
      examName: this.props.navigation.getParam('quiz_name'),
      failed_video: this.props.navigation.getParam('failed_video'),
      pass_video: this.props.navigation.getParam('pass_video'),
      good_video: this.props.navigation.getParam('good_video'),
      very_good_video: this.props.navigation.getParam('very_good_video'),
      excellent_video: this.props.navigation.getParam('excellent_video'),
      examTimer: this.props.navigation.getParam('timer'),
      student_id: '',
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Online',
      LogoutModal: false,
      failedmarkFunctionQuizModal: false,
      URLarray: [
        {
          id: '1',
          url: 'https://youtu.be/r226svjTVn0?list=PL91xPELaCszXD_jG9hT_Jmzm5qYAiXPIm',
          image: images.Camp,
        },
        {
          id: '2',
          url: 'https://youtu.be/OKLdBdE3CTQ?list=PL91xPELaCszVM16GIqkiK0qgCQcghbZyj',
          image: images.Camp,
        },
        {
          id: '3',
          url: 'https://youtu.be/rKu_--bS1fQ?list=PL91xPELaCszVM16GIqkiK0qgCQcghbZyj',
          image: images.Camp,
        },
        {
          id: '4',
          url: 'https://youtu.be/i7nx2Gw2ffs?list=PL91xPELaCszVM16GIqkiK0qgCQcghbZyj',
          image: images.Camp,
        },
      ],
    };
    this._subscription;
  }

  componentWillUnmount() {
    // let refrish = this.props.navigation.getParam('refrish')
    // refrish()
    // this.forbidFunction();
    this.forbidFunction();
    this.backHandler.remove();
    // this._subscription && this._subscription()
  }
  async componentDidMount() {
    // this._subscription = NetInfo.addEventListener(
    //   this._handelConnectionInfoChange,
    // );
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    if (data != null) {
      this.setState({
        student_id: data.student_id,
      });
      this.getQuestions();
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

  forbidFunction = async () => {
    try {
      const result = await NativeModules.PreventScreenshotModule.forbid();
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  // _handelConnectionInfoChange = async (NetInfoState) => {
  //   const data = JSON.parse(await AsyncStorage.getItem('AllData'));
  //   if (NetInfoState.isConnected == true) {
  //     this.setState(({}) => ({
  //       connection_Status: 'Online',
  //     }));
  //     if (data != null) {
  //       this.setState({
  //         student_id: data.student_id,
  //       });
  //       this.getQuestions();
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
  //   this.backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     this.backAction,
  //   );
  // };

  backAction = () => {
    if (this.state.visibleModal == true) {
      this.props.navigation.goBack();
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
      //         this.markFunction();
      //       },
      //     },
      //   ],
      // );
      return true;
    }
  };

  getQuestions() {
    let dataToSend = {
      id: this.state.quizId,
    };

    axios
      .post(AppRequired.Domain + 'select_questions.php', dataToSend)
      .then((res) => {
        // alert(JSON.stringify(res.data))
        if (Array.isArray(res.data.questions)) {
          this.setState({data: res.data.questions});
        }

        this.setState({loading: false});
      });
  }
  chooseTheAnswer(opjectIndex, answerIndex) {
    let newArray = this.state.data;
    newArray[opjectIndex].chosen_answer =
      newArray[opjectIndex].real_answers2[answerIndex].text;
    this.setState({data: newArray});
  }
  CloseModelDegree() {
    this.setState({visibleModal: false, FinshExam: true, disabel: true});
    let newArray = this.state.data;
    if (
      newArray[this.state.count - 1].chosen_answer ==
      newArray[this.state.count - 1].question_valid_answer
    ) {
      this.setState({
        color: '#0f0',
        change: true,
      });
    } else {
      this.setState({
        color: '#f00',
        change: false,
      });
    }
  }

  checkAnswer() {
    let newArray = this.state.data;
    // let CorrectArray=this.state.data[this.state.count-1].answers
    // alert(newArray[this.state.count - 1].chosen_answer )
    if (this.state.connection_Status == 'Online') {
      if (
        newArray[this.state.count - 1].chosen_answer ==
        newArray[this.state.count - 1].question_valid_answer
      ) {
        this.setState({
          color: '#0f0',
          change: true,
          stopTimer: false,
        });
      } else {
        this.setState({
          color: '#f00',
          change: false,
          stopTimer: false,
        });
      }
    } else {
      this.setState({failedmarkFunctionQuizModal: true});
    }
    this.setState({disabel: true});
  }
  renderAnswers(item) {
    // if(item.chosen_answer==''){
    //   this.setState({
    //     index:this.state.data.indexOf(item)
    //   })
    // }

    return (
      <View
        style={{
          width: '100%',
          // alignSelf: 'center',
          // padding: 10,
          // marginTop: 10,
        }}>
        <ScrollView>
          <View
            style={{
              backgroundColor: COLORS.primary,
              width: '100%',
            }}>
            <Animatable.View animation="fadeInUp" delay={100}>
              <View
                style={{
                  backgroundColor: '#fff',
                  width: '90%',
                  alignSelf: 'center',
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                  marginTop: 10,
                  marginBottom: item.question_image == null ? 20 : null,
                  borderBottomLeftRadius:
                    item.question_image == null ? 10 : null,
                  borderBottomRightRadius:
                    item.question_image == null ? 10 : null,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    paddingTop: 10,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#000',
                      // fontWeight: 'bold',
                      marginBottom: 5,
                      fontFamily: FONTS.fontFamily,
                    }}>
                    سؤال {this.state.count} من {this.state.data.length}
                  </Text>

                  <View
                    style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <CountdownCircleTimer
                      isPlaying={this.state.stopTimer}
                      duration={
                        this.state.FinshExam == true ? 0 : this.state.examTimer
                      }
                      onComplete={() => this.checkAnswer()}
                      strokeWidth={5}
                      trailColor={'#DDD'}
                      size={60}
                      colors={[
                        ['#39A40E', 0.4],
                        ['#F7B801', 0.4],
                        ['#A30000', 0.2],
                      ]}>
                      {({remainingTime, animatedColor}) => (
                        <Animated.Text style={{color: animatedColor}}>
                          {remainingTime}
                        </Animated.Text>
                      )}
                    </CountdownCircleTimer>
                  </View>
                </View>

                <View
                  style={{
                    marginVertical: 10,
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <ProgressBar
                    progress={this.state.count / this.state.data.length}
                    color={
                      this.state.data.length / 2 < this.state.count
                        ? '#6CC644'
                        : COLORS.primary
                    }
                    indeterminateAnimationDuration={60000}
                    borderWidth={0.2}
                    borderColor={'#000'}
                    height={12}
                    width={width / 1.5}
                  />
                </View>

                <View style={{padding: 10, marginLeft: 10}}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      fontSize: 18,
                      color: '#000',
                      fontWeight: 'bold',
                      marginBottom: 10,
                    }}>
                    {item.question_text}
                  </Text>
                </View>
              </View>
            </Animatable.View>

            {item.question_image == null ? null : (
              <>
                <Animatable.View animation="fadeInDown" delay={100}>
                  <View
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      borderBottomRightRadius: 10,
                      borderBottomLeftRadius: 10,
                      backgroundColor: '#fff',
                      height: 90,
                      marginBottom: 100,
                    }}>
                    <View style={{width: '100%'}}>
                      <View style={{width: '100%', height: 200}}>
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
                            borderRadius: 10,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </Animatable.View>
              </>
            )}
          </View>

          <View style={{marginTop: 30}}>
            {item.real_answers2.map((item1, index) => (
              <TouchableOpacity
                disabled={this.state.disabel}
                style={{
                  // borderColor: 'black',
                  borderColor: 'black',
                  borderWidth: 1,
                  marginVertical: 5,
                  flexDirection: 'row',
                  borderRadius: 15,
                  width: '95%',
                  alignSelf: 'center',
                  padding: 12,

                  borderColor:
                    item1.text == item.chosen_answer ? '#5cb85c' : 'black',
                  backgroundColor:
                    item1.text == item.chosen_answer
                      ? this.state.color
                      : this.state.change == false
                      ? item1.color
                      : '#fff',
                }}
                onPress={() => {
                  if (
                    this.state.data[this.state.data.indexOf(item)]
                      .chosen_answer != '' &&
                    this.state.data[this.state.data.indexOf(item)]
                      .chosen_answer == item1.text
                  ) {
                    let newArray = this.state.data;
                    newArray[newArray.indexOf(item)].chosen_answer = '';
                    this.setState({data: newArray});
                  } else {
                    let array =
                      this.state.data[this.state.data.indexOf(item)]
                        .real_answers2;
                    this.chooseTheAnswer(
                      this.state.data.indexOf(item),
                      array.indexOf(item1),
                    );
                  }
                }}>
                <Left
                  style={{
                    paddingLeft: 8,

                    flex: 5,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    {item1.text == item.chosen_answer ? (
                      <View
                        style={{
                          borderRadius: 15,
                          alignContent: 'center',
                          justifyContent: 'center',
                          marginRight: 8,
                          borderWidth: 0.2,
                          height: 30,
                          width: 30,
                          alignSelf: 'center',
                        }}>
                        <Icon
                          name="check"
                          style={{
                            fontSize: 20,
                            color: 'green',
                            alignSelf: 'center',
                            padding: 4,
                          }}
                        />
                      </View>
                    ) : (
                      <View
                        style={{
                          borderWidth: 0.2,
                          marginRight: 8,
                          borderRadius: 50,
                          alignContent: 'center',
                          alignSelf: 'center',
                          justifyContent: 'center',
                          height: 30,
                          width: 30,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            padding: 4,
                            fontFamily: FONTS.fontFamily,
                          }}>
                          {index + 1}
                        </Text>
                      </View>
                    )}

                    <View
                      style={{
                        alignContent: 'center',
                        alignSelf: 'center',
                        width: '100%',
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: FONTS.fontFamily,
                          // textAlign: item1.text == item.chosen_answer ? "center" : null
                        }}>
                        {item1.text}
                      </Text>
                    </View>
                  </View>
                </Left>
                <Right
                  style={{
                    paddingRight: 1,
                    height: 30,
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}></Right>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  FinshExam() {
    Toast.show({
      text: ' لقد انهيت الاختبار بالفعل ',
      textStyle: {fontSize: 15, textAlign: 'left'},
      duration: 7000,
      // Enter: 'danger',
      buttonText: 'شكرا',
      buttonTextStyle: {fontSize: 15, textAlign: 'left'},
    });
  }

  async markFunction() {
    if (this.state.connection_Status == 'Online') {
      let validate = 0;
      let newArray = this.state.data;
      let length = newArray.length;
      let fullMark = newArray.length;
      this.setState({fullDegree: fullMark});

      for (var i = 0; i < length; i++) {
        if (newArray[i].chosen_answer != '') {
          validate++;
        }
      }

      let dataToSend = {};

      if (validate == length) {
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

        let precent = (studenDegree / fullMark) * 100;
        this.setState({
          studenDegree: studenDegree,
          visibleModal: true,
          percent: precent,
          status: 'done',
        });
        let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));

        dataToSend = {
          id: this.state.quizId,
          score: studenDegree + '/' + this.state.data.length,
          student_id: this.state.student_id,
          all_question: AllQuestionString,
          subject_id: drInfo.subject_id,
        };
      } else {
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

        let precent = (studenDegree / fullMark) * 100;
        this.setState({
          studenDegree: studenDegree,
          visibleModal: true,
          percent: precent,
          status: 'done',
        });
        let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));

        dataToSend = {
          id: this.state.quizId,
          score: studenDegree + '/' + this.state.data.length,
          student_id: this.state.student_id,
          all_question: AllQuestionString,
          subject_id: drInfo.subject_id,
        };
      }

      if (this.state.connection_Status == 'Online') {
        this.setState({loading: true});
        axios
          .post(AppRequired.Domain + 'upload_score.php', dataToSend)
          .then((res) => {
            // alert(JSON.stringify(res.data))
            if (res.data != 'error') {
              // console.log('------------' + res.data);
            } else {
              Toast.show({
                text: ' حدث خطأ ما  ',
                textStyle: {fontSize: 15, textAlign: 'left'},
                duration: 7000,
                // Enter: 'danger',
                buttonText: 'شكرا',
                buttonTextStyle: {fontSize: 15, textAlign: 'left'},
              });
            }

            this.setState({loading: false});
          });
      } else {
        this.setState({loading: false});
        this.setState({loading: false, failedmarkFunctionQuizModal: true});
      }
    } else {
      this.setState({failedmarkFunctionQuizModal: true});
    }
  }

  NextFunction() {
    this.setState({
      disabel: false,
      change: true,
      color: '#ddd',
      time: 40,
      stopTimer: true,
    });
    if (this.state.connection_Status == 'Online') {
      if (this.state.count == this.state.data.length) {
        this.markFunction();
      } else {
        this.setState({count: this.state.count + 1});
      }
    } else {
      this.setState({loading: false, failedmarkFunctionQuizModal: true});
    }
  }
  ConfirmCheck() {
    Alert.alert(
      AppRequired.appName + '',
      'لم تجب عن السؤال هل انت متأكد ',
      [
        {
          text: 'شكرا',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      {cancelable: false},
    );
  }

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
        <Text
          style={{
            fontFamily: FONTS.fontFamily,
            fontSize: 18,
            color: '#293077',
            fontWeight: 'bold',
          }}>
          {index + 1} ) {item.question_text}
        </Text>
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
                      textAlign: 'left',
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

    var UrlIndex =
      Math.floor(Math.random() * (this.state.URLarray.length - 1 - 0 + 1)) + 0;

    return (
      <Root>
        <View style={styles.container}>
          <Modal
            animationType="slide"
            // transparent={true}
            visible={this.state.visibleModalAnswer}
            onRequestClose={() => {
              this.setState({visibleModalAnswer: false});
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
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({visibleModalAnswer: false});
                    // this.props.navigation.goBack();
                  }}>
                  <Icon
                    name="arrow-right"
                    size={20}
                    style={{color: '#fff'}}></Icon>
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
                    fontSize: 22,
                  }}>
                  الأجابات
                </Text>
              </View>
              <View style={{flex: 1}}></View>
            </View>
            <ScrollView style={{marginBottom: 0}}>
              <FlatList
                data={this.state.data}
                numColumns={1}
                renderItem={({item, index}) =>
                  this.renderExamQuestionsWithAnswers(item, index)
                }
              />

              <TouchableOpacity
                style={{
                  marginTop: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '88%',
                  height: 50,
                  backgroundColor: COLORS.primary,
                  alignSelf: 'center',
                  borderRadius: 10,
                  marginBottom: 30,
                }}
                onPress={() => this.setState({visibleModalAnswer: false})}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 25,
                    color: '#FFF',
                    fontFamily: FONTS.fontFamily,
                  }}>
                  اغلاق
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Modal>

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
                              (parseInt(this.state.studenDegree) /
                                parseInt(this.state.fullDegree)) *
                              (width * 0.85) *
                              -1,
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
                              (parseInt(this.state.studenDegree) /
                                parseInt(this.state.fullDegree)) *
                              (width * 0.85) *
                              -1,
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
                    style={{
                      backgroundColor: '#D2DFE0',
                      height: 40,
                      width: '50%',
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: '#FCD98D',
                      height: 40,
                      width: '15%',
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: '#E6F1CD',
                      height: 40,
                      width: '10%',
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: '#B5DCC9',
                      height: 40,
                      width: '10%',
                    }}
                  />

                  <View
                    style={{
                      backgroundColor: '#99B7DF',
                      height: 40,
                      width: '15%',
                    }}
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
                              -(
                                this.state.studenDegree / this.state.fullDegree
                              ) *
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
                              -(
                                this.state.studenDegree / this.state.fullDegree
                              ) *
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
                              -(
                                this.state.studenDegree / this.state.fullDegree
                              ) *
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

                {/* -------------------------------------------------- */}

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

                {/* ---------------------------------------------------- */}

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
                    this.setState({visibleModalAnswer: true});
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

          <Header
            style={{backgroundColor: COLORS.primary}}
            androidStatusBarColor={COLORS.primary}>
            <Left style={{flex: 1}}>
              <TouchableOpacity
                onPress={() => {
                  this.backAction();
                }}>
                <Icon
                  name="arrow-right"
                  style={{fontSize: 20, color: '#fff', marginLeft: 10}}
                />
              </TouchableOpacity>
            </Left>
            <Body
              style={{
                flex: 2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Title
                numberOfLines={2}
                style={{
                  fontSize: 17,
                  fontFamily: FONTS.fontFamily,
                  alignSelf: 'center',
                  textAlign: 'center',
                }}>
                {this.state.examName.slice(0, 22)}
              </Title>
            </Body>
            <Right />
          </Header>
          {/* <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
              padding: 10,
            }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#DDD',
                width: '90%',
                padding: 10,
                elevation: 2,
                backgroundColor: '#FFF',
              }}> */}
          <ScrollView>
            {this.state.loading == true &&
            this.state.connection_Status == 'Online' ? (
              <Spinner color={COLORS.primary} style={{marginTop: 100}} />
            ) : this.state.loading == false ? (
              this.state.data.map((item, index) =>
                this.state.count == this.state.count &&
                index == this.state.count - 1
                  ? this.renderAnswers(item)
                  : null,
              )
            ) : null}
            {/* </View>
          </View> */}
            {this.state.loading == false ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.primary,
                    width: '85%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 50,
                    marginBottom: 30,
                    borderRadius: 10,
                  }}
                  // disabled={this.state.count == this.state.data.length ? true : false}
                  onPress={() => {
                    {
                      this.state.disabel == false
                        ? this.state.data[this.state.count - 1].chosen_answer ==
                          ''
                          ? this.ConfirmCheck()
                          : this.checkAnswer()
                        : this.state.FinshExam == false
                        ? this.NextFunction()
                        : this.FinshExam();
                    }
                  }}>
                  {/* {} */}
                  {this.state.disabel == false ? (
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 18,
                        fontFamily: FONTS.fontFamily,
                      }}>
                      تأكيد
                    </Text>
                  ) : this.state.count != this.state.data.length ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          color: '#FFF',
                          fontSize: 18,
                          fontFamily: FONTS.fontFamily,
                          // marginRight:30,
                          // textAlign:"center"
                        }}>
                        التالى
                      </Text>
                      <View style={{justifyContent: 'center', marginLeft: 30}}>
                        <Icons
                          name="arrow-left"
                          size={15}
                          color={'#fff'}
                          style={{}}
                        />
                      </View>
                    </View>
                  ) : this.state.loading == false ? (
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 18,
                        fontFamily: FONTS.fontFamily,
                      }}>
                      انهاء
                    </Text>
                  ) : (
                    <Spinner color="#FFF" style={{marginTop: 10}} />
                  )}
                </TouchableOpacity>
              </View>
            ) : null}
          </ScrollView>
        </View>
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
                    this.markFunction();
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
          visible={this.state.failedmarkFunctionQuizModal}
          onRequestClose={() => {
            this.setState({failedmarkFunctionQuizModal: false});
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
                    this.setState({failedmarkFunctionQuizModal: false});
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
      </Root>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    flex: 1,
    // paddingHorizontal: 20,
  },
  text: {
    color: '#fff',
    fontSize: 25,
    textAlign: 'center',
    letterSpacing: -0.02,
    fontWeight: '600',
  },
  safearea: {
    flex: 1,
    marginTop: 100,
    justifyContent: 'space-between',
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
