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
  FlatList,
  Image,
  NativeModules,
  BackHandler,
} from 'react-native';
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
import AsyncStorage from '@react-native-community/async-storage';
import ProgressCircle from 'rn-animated-progress-circle';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CountDown from 'react-native-countdown-component';

import Counter from 'react-native-animated-counter';
import NetInfo from '@react-native-community/netinfo';
const {width, height} = Dimensions.get('window');

import {AppRequired, COLORS, FONTS, images} from '../../../constants';
export default class ExamPageQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      status: 'not_done',
      fullDegree: '',
      studenDegree: '',
      visibleModal: false,
      percent: '',
      correctCount: 0,
      activeQuestionIndex: 0,
      answered: false,
      answerCorrect: false,
      count: 1,
      AnswerIndex: '',
      AllAnswers: [],
      visibleModalAnswer: false,
      FinshExam: false,
      loading: true,
      quizId: this.props.navigation.getParam('quiz_id'),
      examName: this.props.navigation.getParam('quiz_name'),
      challange_time: this.props.navigation.getParam('challange_time'),
      student_id: '',
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Online',
      localTimer: 0,
    };
    this._subscription;
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }
  async componentDidMount() {
    setInterval(() => {
      this.setState({
        localTimer: this.state.localTimer + 1,
      });
    }, 1000);
    let today = new Date();
    let currentDate =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    await AsyncStorage.setItem('currentDate', JSON.stringify(currentDate));
    this.forbidFunction();

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

  backAction = () => {
    if (this.state.visibleModal == true) {
      this.props.navigation.goBack();
    } else {
      Alert.alert(
        AppRequired.appName + '',
        'اذا خرجت الان سيتم اعتبار هذا الامتحان محلولا,هل ما زلت تريد الخروج ؟',
        [
          {
            text: 'لا',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'نعم',
            onPress: () => {
              this.markFunction();
            },
          },
        ],
      );
      return true;
    }
  };

  getQuestions() {
    let dataToSend = {
      challange_id: this.props.navigation.getParam('challenge_id'),
      student_id: this.state.student_id,
    };

    console.log(JSON.stringify(dataToSend));
    axios
      .post(
        AppRequired.Domain + 'challenge/select_challange_questions.php',
        dataToSend,
      )
      .then((res) => {
        console.log(JSON.stringify(res.data));
        // alert(JSON.stringify(res.data));
        if (Array.isArray(res.data)) {
          this.setState({data: res.data});
        }
        this.setState({loading: false});
      });
  }

  chooseTheAnswer(opjectIndex, answerIndex) {
    let newArray = this.state.data;
    newArray[opjectIndex].chosen_answer =
      newArray[opjectIndex].real_answers[answerIndex];
    this.setState({data: newArray});
  }

  renderAnswers(item) {
    return (
      <View
        style={{width: '90%', alignSelf: 'center', padding: 10, marginTop: 10}}>
        <ScrollView>
          <Text
            style={{
              fontFamily: FONTS.fontFamily,
              fontSize: 18,
              color: '#293077',
              // fontWeight: 'bold',
              marginBottom: 10,
            }}>
            سؤال {this.state.count} من {this.state.data.length}
          </Text>

          <Text
            style={{
              fontFamily: 'sans-serif-condensed',
              fontSize: 18,
              color: '#293077',
              fontWeight: 'bold',
            }}>
            {item.question_text}
          </Text>

          {item.question_image == null ? null : (
            <View style={{flex: 1, width: '100%', height: 200, marginTop: 30}}>
              <Image
                source={{uri: item.question_image}}
                style={{
                  flex: 1,
                  width: null,
                  height: null,

                  marginBottom: 30,
                  resizeMode: 'contain',
                }}
              />
            </View>
          )}
          <View style={{marginTop: 30}}>
            {item.real_answers.map((item1) => (
              <TouchableOpacity
                style={{
                  borderColor: 'black',
                  borderWidth: 1,
                  marginTop: 10,
                  flexDirection: 'row',

                  borderColor:
                    item1 == item.chosen_answer ? COLORS.primary : 'black',
                  backgroundColor:
                    item1 == item.chosen_answer ? '#ddd' : '#fff',
                }}
                onPress={() => {
                  if (
                    this.state.data[this.state.data.indexOf(item)]
                      .chosen_answer != '' &&
                    this.state.data[this.state.data.indexOf(item)]
                      .chosen_answer == item1
                  ) {
                    let newArray = this.state.data;
                    newArray[newArray.indexOf(item)].chosen_answer = '';
                    this.setState({data: newArray});
                  } else {
                    let array = this.state.data[this.state.data.indexOf(item)]
                      .real_answers;
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
                  <Text style={{fontSize: 14, fontFamily: FONTS.fontFamily}}>
                    {item1}
                  </Text>
                </Left>
                <Right
                  style={{
                    paddingRight: 8,
                    height: 50,
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}>
                  {item1 == item.chosen_answer ? (
                    <Icon name="check" style={{fontSize: 20, color: 'green'}} />
                  ) : null}
                </Right>
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

  markFunction() {
    let timer = this.state.localTimer;

    let validate = 0;
    let newArray = this.state.data;
    // alert(JSON.stringify(newArray));
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
              newArray[i].challanges_question_id + '//camp//' + '1';
          } else {
            AllQuestionString +=
              newArray[i].challanges_question_id +
              '//camp//' +
              '1' +
              '**CAMP**';
          }
        } else {
          if (i == newArray.length - 1) {
            AllQuestionString +=
              newArray[i].challanges_question_id + '//camp//' + '0';
          } else {
            AllQuestionString +=
              newArray[i].challanges_question_id +
              '//camp//' +
              '0' +
              '**CAMP**';
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
      // console.log("Q1 / "+studenDegree)
      dataToSend = {
        challange_id: this.props.navigation.getParam('challenge_id'),
        student_id: this.state.student_id,
        score: AllQuestionString,
        timer,
      };
    } else {
      let studenDegree = 0;
      let AllQuestionString = '';
      for (let i = 0; i < length; i++) {
        if (newArray[i].chosen_answer == newArray[i].question_valid_answer) {
          studenDegree++;
          if (i == newArray.length - 1) {
            AllQuestionString +=
              newArray[i].challanges_question_id + '//camp//' + '1';
          } else {
            AllQuestionString +=
              newArray[i].challanges_question_id +
              '//camp//' +
              '1' +
              '**CAMP**';
          }
        } else {
          if (i == newArray.length - 1) {
            AllQuestionString +=
              newArray[i].challanges_question_id + '//camp//' + '0';
          } else {
            AllQuestionString +=
              newArray[i].challanges_question_id +
              '//camp//' +
              '0' +
              '**CAMP**';
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
      // console.log("2 / "+this.state.studenDegree)
      dataToSend = {
        challange_id: this.props.navigation.getParam('challenge_id'),
        student_id: this.state.student_id,
        score: AllQuestionString,
        timer,
      };
    }

    console.log(dataToSend);

    // if (this.state.connection_Status == 'Online') {
    axios
      .post(
        AppRequired.Domain + 'challenge/upload_challange_score.php',
        dataToSend,
      )
      .then((res) => {
        // alert(JSON.stringify(res.data));
        if (res.data != 'error') {
          console.log('------------' + res.data);
        } else {
          Toast.show({
            text: ' حدث خطأ ما',
            textStyle: {fontSize: 15, textAlign: 'left'},
            duration: 7000,
            // Enter: 'danger',
            buttonText: 'شكرا',
            buttonTextStyle: {fontSize: 15, textAlign: 'left'},
          });
        }

        this.setState({loading: false});
      });
  }

  NextFunction() {
    if (this.state.connection_Status == 'Online') {
      if (this.state.count == this.state.data.length) {
        this.markFunction();
      } else {
        this.setState({count: this.state.count + 1});
      }
    } else {
      this.setState({loading: false});
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
  }
  ConfirmCheck() {
    Alert.alert(
      AppRequired.appName + '',
      'يجب ان تختار اجابة ',
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
  }
  renderExamQuestionsWithAnswers(item) {
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
        {this.state.data[this.state.data.indexOf(item)].chosen_answer != '' ? (
          <View>
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 18,
                color: '#293077',
                fontWeight: 'bold',
              }}>
              {item.question_text}
            </Text>
            {item.question_image == null ? null : (
              <View
                style={{flex: 1, width: '100%', height: 200, marginTop: 30}}>
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
          </View>
        ) : (
          <View>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="times"
                style={{fontSize: 30, color: 'red', marginRight: 10}}
              />

              <Text
                style={{
                  fontFamily: FONTS.fontFamily,
                  fontSize: 18,
                  color: '#293077',
                  fontWeight: 'bold',
                  marginTop: 5,
                }}>
                {item.question_text}
              </Text>
            </View>
            {item.question_image == null ? null : (
              <View
                style={{flex: 1, width: '100%', height: 200, marginTop: 30}}>
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
          </View>
        )}

        {item.real_answers.map((index) => {
          return (
            <TouchableOpacity
              disabled={true}
              style={{
                borderColor: 'black',
                borderWidth: 1,
                marginTop: 5,
                flexDirection: 'row',

                borderColor:
                  index == item.question_valid_answer
                    ? '#5cb85c'
                    : index == item.chosen_answer
                    ? 'red'
                    : 'black',
                backgroundColor:
                  index == item.question_valid_answer
                    ? '#ddd'
                    : index == item.chosen_answer
                    ? '#ddd'
                    : '#fff',
              }}>
              <Left style={{paddingLeft: 6, flex: 5}}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FONTS.fontFamily,
                  }}>
                  {index}
                </Text>
              </Left>
              <Right
                style={{
                  paddingRight: 8,
                  height: 50,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                {index == item.question_valid_answer ? (
                  <Icon name="check" style={{fontSize: 20, color: '#5cb85c'}} />
                ) : index == item.chosen_answer ? (
                  <Icon name="times" style={{fontSize: 20, color: 'red'}} />
                ) : null}
              </Right>
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
            <Header
              style={{backgroundColor: COLORS.primary}}
              androidStatusBarColor={COLORS.secondary}>
              <Left style={{flex: 1}}>
                <TouchableOpacity
                  onPress={() => this.setState({visibleModalAnswer: false})}>
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
                  الإجابات
                </Title>
              </Body>
              <Right />
            </Header>

            <ScrollView style={{marginBottom: 0}}>
              <FlatList
                data={this.state.data}
                numColumns={1}
                renderItem={({item}) =>
                  this.renderExamQuestionsWithAnswers(item)
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
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  backgroundColor: '#fff',
                }}>
                <View
                  style={{
                    // transform: [{ rotateY: '180deg', rotate: '180deg' }],
                    marginTop: 10,
                  }}>
                  <ProgressCircle
                    style={{alignSelf: 'center'}}
                    value={this.state.percent / 100}
                    size={280}
                    thickness={13}
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
                      style={
                        {
                          // transform: [{ rotateY: '180deg', rotate: '180deg' }],
                        }
                      }>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            color: COLORS.primary,
                            fontSize: 18,
                            fontWeight: 'bold',
                          }}>
                          %
                        </Text>
                        <Counter
                          start={0}
                          end={this.state.percent}
                          style={{
                            color: COLORS.primary,
                            fontSize: 18,
                            fontWeight: 'bold',
                          }}
                          duration={2000}
                        />
                      </View>
                      <Text style={{textAlign: 'center'}}>
                        {this.state.studenDegree}/{this.state.fullDegree}
                      </Text>
                    </View>
                  </ProgressCircle>
                </View>
                <View style={{width: '90%', alignSelf: 'center'}}>
                  <Text
                    style={{
                      fontSize: 16,
                      alignSelf: 'center',
                      // marginTop: 20,
                      color: '#293077',
                      marginTop: 20,
                      textAlign: 'center',
                      fontFamily: FONTS.fontFamily,
                    }}>
                    لقد انهيت التحدي بالتوفيق في التحدي القادم
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    marginTop: 30,
                    marginBottom: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '88%',
                    height: 50,
                    backgroundColor: COLORS.primary,
                    alignSelf: 'center',
                    borderRadius: 10,
                    marginBottom: 30,
                  }}
                  onPress={
                    () => {
                      this.props.navigation.goBack();
                    } //,this.props.navigation.goBack()}
                  }>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 25,
                      color: '#FFF',
                      fontFamily: FONTS.fontFamily,
                    }}>
                    حسنا
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => {
                    this.setState({ visibleModalAnswer: true });
                  }}
                  style={{
                    // borderColor: 'black',
                    borderWidth: 1,
                    // marginTop: 5,
                    flexDirection: 'row',
                    borderColor: 'black',
                    backgroundColor: '#ddd',
                    width: '87%',
                    height: 40,
                    alignSelf: 'center',
                    marginTop: 40,
                    borderRadius: 7,
                    justifyContent: 'center'
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'serif',
                      alignSelf: "center",
                      textAlign: 'center',
                      marginTop: 5
                    }}>
                    عرض الامتحان بالاجابات الصحيحه
              </Text>
                </TouchableOpacity> */}
              </View>
            </ScrollView>
          </Modal>

          <Header
            style={{backgroundColor: COLORS.primary}}
            androidStatusBarColor={COLORS.secondary}>
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
              style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
              <Title
                numberOfLines={2}
                style={{
                  fontSize: 17,
                  fontFamily: FONTS.fontFamily,
                  alignSelf: 'center',
                  textAlign: 'center',
                }}>
                {/* {this.state.examName.slice(0, 22)} */}
                التحدى
              </Title>
            </Body>
            <Right />
          </Header>
          <CountDown
            style={{
              width: 100,
              opacity: this.state.status == 'not_done' ? 1 : 0,
              alignSelf: 'center',
            }}
            size={20}
            until={this.state.challange_time}
            onFinish={() => {
              this.state.status == 'not_done' ? this.markFunction() : null;
            }}
            digitStyle={{width: 30, height: 40}}
            digitTxtStyle={{color: COLORS.primary}}
            timeLabelStyle={{color: 'red', fontWeight: 'bold'}}
            separatorStyle={{color: 'green'}}
            timeToShow={['S', 'M', 'H']}
            timeLabels={{h: null, m: null, s: ''}}
            showSeparator
          />

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
                  resizeMode="contain"
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
                  }}
                  // disabled={this.state.count == this.state.data.length ? true : false}
                  onPress={() => {
                    this.state.FinshExam == false
                      ? this.state.data[this.state.count - 1].chosen_answer ==
                        ''
                        ? this.ConfirmCheck()
                        : this.NextFunction()
                      : this.FinshExam();
                  }}>
                  {this.state.count != this.state.data.length ? (
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 18,
                        fontFamily: FONTS.fontFamily,
                      }}>
                      التالى
                    </Text>
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
        <ViewConnectionMsg ConnectionEnter="لا يوجد اتصال بالأنترنت" />
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
    backgroundColor: '#492E41',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
