import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  Animated,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  NativeModules,
} from 'react-native';
import axios from 'axios';

import NetInfo from '@react-native-community/netinfo';
import {Spinner} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';

import {AppRequired, COLORS, FONTS, images} from '../../constants';

const {width, height} = Dimensions.get('window');

export default class Seloved_Student_Exam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xValue: new Animated.Value(0),
      position: 0,
      show: false,
      connection_Status: true,
      bottomConnectionMsg: new Animated.Value(-100),
      student_id: this.props.navigation.getParam('student_id'),
      exam_quiz_id: this.props.navigation.getParam('exam_quiz_id'),
      isLoading: false,
      Exam_Quiz_Data_Array: [],
      data_status: '',
    };
    this._subscription;
  }

  async componentDidMount() {
    // alert(this.state.exam_quiz_id + ' +  ' + this.state.student_id);
    // console.log(res.data)

    this.getSolvedExams();
    // this.forbidFunction();
    this.forbidFunction();

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      console.log('Connection value ' + state.isConnected);
      console.log('Connection type ' + state.type);
      if (state.isConnected == true) {
        this.setState({
          connection_Status: true,
        });
        Animated.spring(this.state.bottomConnectionMsg, {
          toValue: -100,
        }).start();
      } else {
        this.setState({
          connection_Status: false,
        });
        Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
      }
    });
  }

  // allowFunction = async () => {
  //   try {
  //     const result = await NativeModules.PreventScreenshotModule.allow();
  //     console.log(result);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // forbidFunction = async () => {
  //   try {
  //     const result = await NativeModules.PreventScreenshotModule.forbid();
  //     console.log(result);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  async getSolvedExams() {
    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));

    this.setState({isLoading: true});
    // alert(this.state.student_id);

    let data_to_send = {
      student_id: this.state.student_id,
      exam_quiz_id: this.state.exam_quiz_id,
      subject_id: drInfo.subject_id,
    };

    // console.log(JSON.stringify(data_to_send));

    axios
      .post(
        AppRequired.Domain + 'select_solved_student_exam_quiz.php',
        data_to_send,
      )
      .then((res) => {
        this.setState({
          isLoading: false,
        });

        console.log(res.data);

        if (Array.isArray(res.data)) {
          if (res.data.length > 0) {
            res.data.map((item) => {
              item.question_answers = item.question_answers.split('//CAMP//');
            });
            this.setState({
              Exam_Quiz_Data_Array: res.data,
              data_status: 'have_data',
            });
          } else {
            this.setState({
              Exam_Quiz_Data_Array: res.data,
              data_status: 'no_data',
            });
          }
        } else {
          if (res.data == 'not_found') {
            // alert(res.data)
            Alert.alert(
              AppRequired.appName + '',
              'لم يتم تسجيل الاجابات لهذا الامتحان',
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
          } else if (res.data == 'error') {
            Alert.alert(
              AppRequired.appName + '',
              'لقد حدث خطا ما في استرجاع البيانات...',
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
        }
      });
  }

  renderAnswers(Question, indexOfQuestion) {
    return (
      <FlatList
        data={Question.question_answers}
        renderItem={({index}) => (
          <View>
            {Question.question_answers[index] ==
            Question.question_valid_answer ? (
              <>
                <View style={styles.Answer_view_Green}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        // borderColor:'#' ,
                        // borderWidth: 1,
                        backgroundColor: '#5cb85c',
                        marginRight: 10,
                        borderRadius: 20,
                      }}>
                      <Icon
                        name="check"
                        style={{
                          fontSize: 20,
                          color: '#FFF',
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                    <View style={{flex: 4}}>
                      <Text
                        style={{
                          color: '#777',
                          textAlign: 'left',
                          fontFamily: FONTS.fontFamily,
                        }}>
                        {Question.question_answers[index]}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            ) : Question.question_answers[index] !=
                Question.question_valid_answer &&
              Question.question_answers[index] != Question.choosed_answer ? (
              <View style={styles.Answer_view}>
                <View style={styles.index_view_answer}>
                  {/* <Text style={styles.Text_answer_index}> {index + 1}</Text> */}
                </View>
                <View style={{flex: 4}}>
                  <Text
                    style={{
                      color: '#777',
                      textAlign: 'left',
                      fontFamily: FONTS.fontFamily,
                    }}>
                    {Question.question_answers[index]}
                  </Text>
                </View>
              </View>
            ) : (Question.question_answers[index] !=
                Question.question_valid_answer) !=
              Question.choosed_answer ? (
              <>
                <View style={styles.Answer_view_Red}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        height: 30,
                        width: 30,
                        alignItems: 'center',
                        justifyContent: 'center',
                        // borderColor:'#' ,
                        // borderWidth: 1,
                        backgroundColor: '#F00',
                        marginRight: 10,
                        borderRadius: 20,
                      }}>
                      <Icon
                        name="times"
                        style={{
                          fontSize: 20,
                          color: '#FFF',
                          alignSelf: 'center',
                        }}
                      />
                      {/* <Text style={styles.Text_answer_index}> {index + 1}</Text> */}
                    </View>

                    <View style={{flex: 4}}>
                      <Text
                        style={{
                          color: '#777',
                          alignSelf: 'flex-start',
                          fontFamily: FONTS.fontFamily,
                        }}>
                        {Question.question_answers[index]}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            ) : null}
          </View>
        )}
      />
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
      <>
        <StatusBar backgroundColor={COLORS.secondary}></StatusBar>

        <SafeAreaView>
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
                  style={{fontSize: 20, color: '#fff', marginLeft: 10}}
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
                الاجابات
              </Text>
            </View>
            <View style={{flex: 1}} />
          </View>

          {this.state.connection_Status ? (
            this.state.isLoading ? (
              <View
                style={{
                  //   flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '85%',
                }}>
                <Spinner color={COLORS.primary} />
              </View>
            ) : this.state.data_status == 'have_data' ? (
              <ScrollView>
                {this.state.Exam_Quiz_Data_Array.map((Question, index) => (
                  <View style={styles.Question_View}>
                    <View style={{flexDirection: 'row'}}>
                      <View style={styles.IndexView}>
                        <Text style={styles.IndexText}>({index + 1}</Text>
                      </View>
                      <View style={{width: '100%'}}>
                        <Text style={styles.Question_Text}>
                          {Question.question_text}
                        </Text>
                      </View>
                    </View>
                    {Question.question_image != null ? (
                      <Image
                        style={styles.ImageStyle}
                        source={{uri: Question.question_image}}></Image>
                    ) : null}

                    {this.renderAnswers(Question, index)}
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      {Question.correct_or_not == 0 &&
                      Question.choosed_answer == '' ? (
                        <Text
                          style={{
                            fontFamily: FONTS.fontFamily,
                            marginTop: 10,
                            fontSize: 14,
                            color: 'red',
                            opacity: 0.8,
                          }}>
                          لم يتم الاجابه علي هذا السؤال
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ))}
                <View style={{width: '100%', height: 70}}></View>
              </ScrollView>
            ) : (
              <View
                style={{
                  flex: 1,
                  paddingTop: '70%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: COLORS.primary, fontSize: 20}}>
                  لا يوجد إجابات لهذا الإمتحان
                </Text>
              </View>
            )
          ) : (
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
        </SafeAreaView>
        <ViewConnectionMsg ConnectionEnter="لا يوجد اتصال بالأنترنت" />
      </>
    );
  }
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    width: width - 130,
    height: height + 50,
    marginTop: 55,
    backgroundColor: 'white',
    paddingBottom: 23,
    marginLeft: (width - 70) * -1,
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.7,
    elevation: 1,
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
  Header: {
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    elevation: 5,
    height: height / 12,
    flexDirection: 'row',
    padding: 20,
  },
  Title: {
    fontSize: 20,
    // fontWeight: 'bold',
    fontFamily: FONTS.fontFamily,
    alignSelf: 'center',
    // justifyContent: 'center',
    // marginLeft: '30%',
  },
  Question_View: {
    // width: '90%',
    margin: '5%',
    marginBottom: 10,
    marginTop: 30,
  },
  IndexView: {
    // marginBottom: 10,
    // marginLeft: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 10,
  },
  IndexText: {
    fontSize: 18,
    // fontWeight: 'bold',
    marginRight: 10,
    fontFamily: FONTS.fontFamily,
  },
  Question_Text: {
    fontSize: 18,
    // fontWeight: 'bold',
    fontFamily: FONTS.fontFamily,
    // marginBottom: 10,
    // marginLeft: 10
    width: '85%',
  },
  Answer_view: {
    padding: 12,
    // borderColor: '#f40707',
    // borderWidth: 1,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingRight: 5,
    borderRadius: 50,
  },
  Text_answer: {
    fontSize: 15,
    fontFamily: FONTS.fontFamily,
  },
  index_view_answer: {
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // borderColor:'#' ,
    // borderWidth: 1,
    backgroundColor: '#ddd',
    marginRight: 10,
    borderRadius: 20,
  },
  Text_answer_index: {},
  ImageStyle: {
    height: height / 4,
    width: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  Answer_view_Red: {
    padding: 12,

    // borderColor: '#f40707',
    // borderWidth: 1,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingRight: 5,
    borderRadius: 50,
  },
  Answer_view_Green: {
    // height: height / 12,
    // width: width / 1.24,
    padding: 12,
    // borderColor: '#0bf407',
    // borderWidth: 1,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingRight: 5,
    borderRadius: 50,
  },
});
