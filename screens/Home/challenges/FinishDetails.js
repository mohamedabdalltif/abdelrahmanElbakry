import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
  FlatList,
} from 'react-native';
import {Container} from 'native-base';

import ProgressBarAnimated from 'react-native-progress-bar-animated';

import * as Animatable from 'react-native-animatable';
import {COLORS, images} from '../../../constants';

export default class FinishDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numofmistake: this.props.navigation.getParam('data').challange_details
        .sender_fault_count,
      numofmistakeChallenge: this.props.navigation.getParam('data')
        .challange_details.receiver_fault_count,
      numofpoint: this.props.navigation.getParam('data').challange_details
        .sender_success_count,
      numofpointchallenge: this.props.navigation.getParam('data')
        .challange_details.receiver_success_count,
      time_sender: '',
      time_reciver: '',
      name_of_sender: this.props.navigation.getParam('data').nameStudent,
      name_of_challenger: this.props.navigation.getParam('data').nameOfChalenge,
      winner: this.props.navigation.getParam('data').winner,
      numberExamQuestions: this.props.navigation.getParam('data')
        .challange_details.questions_count,
      challengTime: this.props.navigation.getParam('data').challange_time,
      pure_timer_sender: '',
      pure_timer_resever: '',
    };
  }

  componentDidMount() {
    let data = this.props.navigation.getParam('data');
    console.log(JSON.stringify(this.props.navigation.getParam('data')));

    function secondsToTime(e) {
      var h = Math.floor(e / 3600)
          .toString()
          .padStart(2, '0'),
        m = Math.floor((e % 3600) / 60)
          .toString()
          .padStart(2, '0'),
        s = Math.floor(e % 60)
          .toString()
          .padStart(2, '0');

      return h + ':' + m + ':' + s;
    }
    var sender_time = secondsToTime(data.challange_sender_time_score);
    var resever_Time = secondsToTime(data.challange_receiver_time_score);

    this.setState({
      time_sender: sender_time,
      time_reciver: resever_Time,
      pure_timer_sender: data.challange_sender_time_score,
      pure_timer_resever: data.challange_receiver_time_score,
    });
  }
  render() {
    return (
      <>
        <StatusBar backgroundColor={COLORS.secondary}></StatusBar>

        <View
          style={{
            width: '100%',
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.primary,
          }}>
          <Text style={{fontSize: 25, fontWeight: 'bold', color: '#fff'}}>
            تفاصيل التحدي
          </Text>
        </View>

        <Container style={{backgroundColor: '#fff'}}>
          <>
            {/* <View style={{ height: height / -80, width: width - 20, backgroundColor: "#fff", alignSelf: "center", borderRadius: 8, marginTop: 10, elevation: 10 }}> */}

            <View
              style={{
                marginTop: 10,
                width: '98%',
                // backgroundColor: '#f00',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-around',
                padding: 10,
              }}>
              <Animatable.View
                animation="fadeInRight"
                duration={2300}
                delay={250}
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 5,
                }}>
                <Text
                  numberOfLines={1}
                  style={{fontSize: 19, textAlign: 'center', width: 80}}>
                  {this.state.name_of_sender} {/* +++ .slice(0, 8)).trim()*/}
                </Text>

                {this.state.winner == 'equel' ? (
                  <>
                    <View style={{alignSelf: 'center'}}>
                      <Image
                        source={images.equality}
                        style={{
                          width: 80,
                          height: 45,
                          marginTop: 10,
                          alignSelf: 'center',
                        }}></Image>
                    </View>
                  </>
                ) : this.state.winner == 'sender' ? (
                  <>
                    <Image
                      source={images.Rank1}
                      style={{
                        width: 45,
                        height: 45,
                        marginTop: 10,
                        alignSelf: 'center',
                      }}></Image>
                  </>
                ) : (
                  <>
                    <Image
                      source={images.Rank2}
                      style={{
                        width: 45,
                        height: 45,
                        marginTop: 5,
                        alignSelf: 'center',
                      }}></Image>
                  </>
                )}
              </Animatable.View>

              <Image
                source={images.versus}
                style={{width: 60, height: 60, marginTop: 20}}></Image>

              <Animatable.View
                animation="fadeInLeft"
                duration={2300}
                delay={250}
                style={{
                  // backgroundColor: '#f0f',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 5,
                }}>
                <Text
                  numberOfLines={1}
                  style={{fontSize: 19, textAlign: 'center', width: 80}}>
                  {this.state.name_of_challenger} {/* +++ .slice(0, 8).trim()*/}
                </Text>

                {this.state.winner == 'equel' ? (
                  <>
                    <View style={{alignSelf: 'center'}}>
                      <Image
                        source={images.equality}
                        style={{
                          width: 80,
                          height: 45,
                          marginTop: 10,
                          alignSelf: 'center',
                        }}></Image>
                    </View>
                  </>
                ) : this.state.winner == 'receiver' ? (
                  <>
                    <Image
                      source={images.Rank1}
                      style={{
                        width: 50,
                        height: 50,
                        marginTop: 5,
                        alignSelf: 'center',
                      }}></Image>
                  </>
                ) : (
                  <>
                    <Image
                      source={images.Rank2}
                      style={{
                        width: 50,
                        height: 50,
                        marginTop: 5,
                        alignSelf: 'center',
                      }}></Image>
                  </>
                )}
              </Animatable.View>
            </View>

            <View
              style={{
                height: 40,
                marginTop: 20,
                width: '98%',
                backgroundColor: '#fff',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    alignSelf: 'flex-start',
                    marginLeft: 17,
                  }}>
                  {this.state.numofmistake}
                </Text>
              </View>

              <Text style={{fontSize: 20, fontWeight: 'bold', marginTop: 10}}>
                عدد الاخطاء
              </Text>

              <View>
                <Text style={{fontSize: 17, marginRight: 17}}>
                  {this.state.numofmistakeChallenge}
                </Text>
              </View>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 15,
              }}>
              <View style={{transform: [{rotate: '180deg'}]}}>
                <ProgressBarAnimated
                  width={155}
                  value={(
                    (parseInt(this.state.numofmistake) /
                      parseInt(this.state.numberExamQuestions)) *
                    100
                  ).toString()}
                  // backgroundColorOnComplete="#6CC644"
                  backgroundColor={COLORS.primary}
                  height={12}
                />
              </View>
              {/* <View style={{ width: 2, height: 40, backgroundColor: COLORS.primary }}></View> */}
              <ProgressBarAnimated
                width={155}
                value={(
                  (parseInt(this.state.numofmistakeChallenge) /
                    parseInt(this.state.numberExamQuestions)) *
                  100
                ).toString()}
                // backgroundColorOnComplete="#6CC644"
                backgroundColor="#81abba"
                height={12}
              />
            </View>

            <View
              style={{
                height: 40,
                marginTop: 20,
                width: '98%',
                backgroundColor: '#fff',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    alignSelf: 'flex-start',
                    marginLeft: 17,
                  }}>
                  {this.state.numofpoint}
                </Text>
              </View>

              <Text style={{fontSize: 20, fontWeight: 'bold'}}>عدد النقاط</Text>

              <View>
                <Text style={{fontSize: 17, marginRight: 17}}>
                  {this.state.numofpointchallenge}
                </Text>
              </View>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 15,
              }}>
              <View style={{transform: [{rotate: '180deg'}]}}>
                <ProgressBarAnimated
                  width={155}
                  value={(this.state.numofpoint / 5) * 100}
                  // backgroundColorOnComplete="#6CC644"
                  backgroundColor={COLORS.primary}
                  height={12}
                />
              </View>

              {/* <View style={{ width: 2, height: 40, backgroundColor: COLORS.primary }}></View> */}
              <ProgressBarAnimated
                width={155}
                value={(this.state.numofpointchallenge / 5) * 100}
                // backgroundColorOnComplete="#6CC644"
                // backgroundColor=COLORS.primary
                backgroundColor="#81abba"
                height={12}
              />
            </View>

            <View
              style={{
                height: 40,
                marginTop: 20,
                width: '98%',
                backgroundColor: '#fff',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    alignSelf: 'flex-start',
                    marginLeft: 17,
                  }}>
                  {this.state.time_sender}
                </Text>
              </View>

              {/* <View style={{ width: 2, height: 40, backgroundColor: COLORS.primary }}></View> */}
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                الوقت المستغرق
              </Text>

              <View>
                <Text style={{fontSize: 17, marginRight: 17}}>
                  {this.state.time_reciver}
                </Text>
              </View>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 15,
              }}>
              <View style={{transform: [{rotate: '180deg'}]}}>
                <ProgressBarAnimated
                  width={155}
                  value={
                    (this.state.pure_timer_sender / this.state.challengTime) *
                    100
                  }
                  // backgroundColorOnComplete="#6CC644"
                  backgroundColor={COLORS.primary}
                  height={12}
                />
              </View>

              {/* <View style={{ width: 2, height: 40, backgroundColor: COLORS.primary }}></View> */}
              <ProgressBarAnimated
                width={155}
                value={
                  (this.state.pure_timer_resever / this.state.challengTime) *
                  100
                }
                // backgroundColorOnComplete="#6CC644"
                // backgroundColor=COLORS.primary
                backgroundColor="#81abba"
                height={12}
              />
            </View>

            <View style={{marginTop: 25}}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('QuestionDetails', {
                    data: this.props.navigation.getParam('data')
                      .challange_details.questions,
                    name_of_sender: this.state.name_of_sender,
                    name_of_challenger: this.state.name_of_challenger,
                  });
                }}
                style={{width: '100%', marginTop: 50}}>
                <View
                  style={{
                    width: '90%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: COLORS.primary,
                    alignSelf: 'center',
                    marginBottom: 20,
                    marginTop: 1,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontStyle: 'normal',
                    }}>
                    عرض تفاصيل الاسئلة
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* </View> */}
          </>
        </Container>
        {/* <Modal
          // animationType="slide"
          // transparent={true}
          visible={false}
          onRequestClose={() => {
            this.setState({ visibleModal: false });
          }}>
          <ScrollView >
            <Container>
              <Header
                style={{ backgroundColor: "#126888" }}
                androidStatusBarColor={"#126888"}>
                <Left style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() => {
                      // this.props.navigation.goBack()
                      this.setState({ visibleModal: false })
                    }}>
                    <Icon

                      name='arrow-right'
                      style={{ fontSize: 20, color: '#fff', marginLeft: 10 }}
                    />
                  </TouchableOpacity>
                </Left>
                <Body
                  style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                  <Title
                    numberOfLines={2}
                    style={{
                      fontSize: 22,
                      // fontFamily: fontFamily,
                      alignSelf: 'center',
                      textAlign: 'center',
                      fontWeight: 'bold'
                    }}>
                    النتائج
            </Title>
                </Body>
                <Right />
              </Header>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  marginTop: 17,
                  // height: height * 0.06,
                  marginBottom: 10,
                  alignSelf: 'center',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    width: '40%',
                    // borderRightWidth: 2,
                    justifyContent: 'center',
                    // borderBottomStartRadius: 10,
                    // borderTopStartRadius: 10,
                    padding: 10,
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
                    }}>
                    محمد محمود محمد
                          </Text>
                </View>
                <View
                  style={{
                    backgroundColor: 'white',
                    width: '20%',
                    justifyContent: 'center',

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
                      fontSize: 25,
                      fontWeight: 'bold',
                    }}>
                    VS
                          </Text>
                </View>

                <View
                  style={{
                    backgroundColor: 'white',
                    width: '40%',
                    // borderRightWidth: 2,
                    justifyContent: 'center',
                    // borderBottomStartRadius: 10,
                    // borderTopStartRadius: 10,
                    padding: 10,
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
                    }}>
                    محمد محمود محمد
                          </Text>
                </View>
              </View>
              <ScrollView>

                {
                  this.state.Questions.map((items) => (
                    <View
                      style={{
                        width: '90%',
                        flexDirection: 'row',
                        // height: height * 0.5,
                        borderRadius: 20,
                        // marginBottom: 10,
                        alignSelf: 'center',

                      }}>
                      <View
                        style={{
                          overflow: 'hidden',
                          backgroundColor: items.color,
                          width: '25%',
                          //  borderTopLeftRadius:this.state.Questions.indexOf(items)==0?10:0,
                          padding: 20,
                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 6,
                          },
                          shadowOpacity: 0.37,
                          shadowRadius: 7.49,
                          elevation: 12,
                          //  borderTopRightRadius:this.state.Questions.indexOf(items)==0?10:0,

                        }}>

                        {items.correct == true ? (

                          <Icon
                            name={'check'}
                            style={{
                              textAlign: 'center',
                              fontSize: 25,
                              fontWeight: 'bold',
                              marginTop: 10,
                              color: "green"
                              // borderBottomWidth: .7,
                              // marginBottom: 10,
                            }}>
                          </Icon>
                        ) : (
                            <Icon
                              name={'times'}
                              style={{
                                textAlign: 'center',
                                fontSize: 25,
                                fontWeight: 'bold',
                                marginTop: 10,
                                color: "red"
                                // borderBottomWidth: .7,
                                // marginBottom: 10,
                              }}>
                            </Icon>
                          )}
                      </View>
                      <View
                        style={{
                          backgroundColor: items.color,
                          width: '50%',
                          // borderRightWidth: 2,
                          justifyContent: 'center',
                          // borderBottomStartRadius: 10,
                          // borderTopStartRadius: 10,
                          padding: 10,
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
                            fontSize: 22,
                            fontWeight: 'bold',
                            // borderBottomWidth: .7,
                            // marginBottom: 10,
                          }}>
                          {items.name}
                        </Text>

                      </View>

                      <View
                        style={{
                          backgroundColor: items.color,
                          width: '25%',
                          justifyContent: 'center',
                          // borderTopEndRadius: 10,
                          // borderBottomEndRadius: 10,
                          padding: 10,

                          shadowColor: '#000',
                          shadowOffset: {
                            width: 0,
                            height: 6,
                          },
                          shadowOpacity: 0.37,
                          shadowRadius: 7.49,

                          elevation: 12,
                        }}>
                        {items.correctChalenge == true ? (

                          <Icon
                            name={'check'}
                            style={{
                              textAlign: 'center',
                              fontSize: 25,
                              fontWeight: 'bold',
                              marginTop: 10,
                              color: "green"
                              // borderBottomWidth: .7,
                              // marginBottom: 10,
                            }}>
                          </Icon>
                        ) : (
                            <Icon
                              name={'times'}
                              style={{
                                textAlign: 'center',
                                fontSize: 25,
                                fontWeight: 'bold',
                                marginTop: 10,
                                color: "red"
                                // borderBottomWidth: .7,
                                // marginBottom: 10,
                              }}>
                            </Icon>
                          )}
                      </View>
                    </View>
                  ))
                }
              </ScrollView>

            </Container>
          </ScrollView>
              </Modal> */}
      </>
    );
  }
}
