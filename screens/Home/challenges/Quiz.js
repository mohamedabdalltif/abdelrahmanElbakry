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
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Spinner,
} from 'native-base';
import ProgressBar from 'react-native-progress/Bar';
import {AppRequired, COLORS} from '../../../constants';
// import Tabs from "native-base";
const {width, height} = Dimensions.get('window');

export default class Quiz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Quizarr: [],
      isloading: false,
    };
  }

  componentDidMount() {
    this.getdata();
  }

  async getdata() {
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));

    let data_to_send = {
      generation_id: StudentData.student_generation_id,
      student_id: StudentData.student_id,
    };

    axios
      .post(AppRequired.Domain + 'select_my_solved_quiz.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          // alert(JSON.stringify(res.data.exams))

          if (res.data != 'error') {
            this.setState({
              Quizarr: res.data.exams,
              isloading: true,
            });
          } else {
            this.setState({isloading: true});
            Alert.alert('عذرا يرجي المحاوله في وقتا لاحق');

            this.setState({
              Quizarr: [],
              isloading: true,
            });
          }
        } else {
          this.setState({isloading: true});
          Alert.alert('عذرا يرجي المحاوله في وقتا لاحق');
        }
      });
  }

  render() {
    return (
      <>
        <StatusBar
          backgroundColor="transparent"
          translucent={true}
          barStyle="dark-content"></StatusBar>

        <View style={{backgroundColor: '#fff', flex: 1}}>
          {this.state.isloading == true ? (
            this.state.Quizarr.length > 0 ? (
              <ScrollView>
                <View style={{marginBottom: 100}}>
                  {this.state.Quizarr.map((items, index) => (
                    <View key={index}>
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate(
                            'Seloved_Student_Exam',
                          );
                        }}
                        style={styles.QuizContainerView}>
                        <View style={styles.QuizNameView}>
                          <View style={styles.IndexView}>
                            <Text>{index + 1}</Text>
                          </View>
                          <View style={{width: '92%'}}>
                            <Text style={styles.QuizText}>
                              {items.exam_name}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.ProgressBar_view}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <View>
                              <ProgressBar
                                progress={items.score_amount * 0.01}
                                color={
                                  items.score_amount > 50
                                    ? '#0f9d58'
                                    : items.score_amount >= 30
                                    ? '#ffb74d'
                                    : '#d93025'
                                }
                                indeterminateAnimationDuration={60000}
                                borderWidth={0.5}
                                borderColor={
                                  items.score_amount >= 50
                                    ? '#0f9d58'
                                    : items.score_amount >= 30
                                    ? '#ffb74d'
                                    : '#d93025'
                                }
                              />
                            </View>
                            <Text style={styles.Percentage_text}>
                              {items.score_amount}%
                            </Text>
                          </View>
                          <View style={styles.number_of_total_view}>
                            <Text style={styles.number_of_total_text}>
                              {items.solved_exam_score}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            width: '50%',
                            marginLeft: 15,
                            flexDirection: 'row',
                          }}>
                          <Text style={[styles.ExamText, {marginRight: 10}]}>
                            التقدير العام
                          </Text>

                          <Text style={[styles.ExamText, {color: '#898484'}]}>
                            {items.solved_exam_degree}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
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
                  }}>
                  لا يوجد كويزات محلولة
                </Text>
              </View>
            )
          ) : (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Spinner size={40} color={COLORS.primary} />
            </View>
          )}
        </View>
      </>
    );
  }
}
const styles = StyleSheet.create({
  QuizContainerView: {
    width: width - 15,
    alignSelf: 'center',
    marginVertical: 10,
    borderRadius: 15,
    borderColor: COLORS.primary,
    borderWidth: 1,
    justifyContent: 'flex-start',
    paddingBottom: 20,
  },
  IndexView: {
    height: 20,
    width: 20,
    borderColor: '#777',
    borderWidth: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  QuizNameView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  QuizText: {
    fontSize: 18,
  },
  ProgressBar_view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    justifyContent: 'space-between',
  },
  Percentage_text: {
    fontSize: 15,
    marginLeft: 10,
  },
  number_of_total_view: {
    marginRight: 15,
    alignItems: 'center',
    width: '20%',
    borderColor: COLORS.primary,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  number_of_total_text: {
    fontSize: 18,
    marginBottom: 5,
  },
});
