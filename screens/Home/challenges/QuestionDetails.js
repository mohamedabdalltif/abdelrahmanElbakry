import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

import {
  Container,
  Picker,
  Form,
  Spinner,
  Item,
  Header,
  Left,
  Right,
  Body,
  Title,
} from 'native-base';
import {COLORS, images} from '../../../constants';
const {width, height} = Dimensions.get('window');

export default class QuestionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Questions: [],
      name_of_sender: this.props.navigation.getParam('name_of_sender'),
      name_of_challenger: this.props.navigation.getParam('name_of_challenger'),
    };
  }

  componentDidMount() {
    let data = this.props.navigation.getParam('data');
    // alert(JSON.stringify(data))
    this.setState({Questions: data});
  }

  nameFun(ques) {
    var names = ques.split(' ');
    return (
      names[0] +
      ' ' +
      names[1] +
      ' ' +
      names[2] +
      ' ' +
      names[3] +
      ' ' +
      names[4] +
      ' ' +
      names[5] +
      ' ' +
      names[6] +
      ' ' +
      names[7]
    );
  }

  render() {
    return (
      <>
        <Container>
          <Header
            style={{backgroundColor: COLORS.primary, height: 60}}
            androidStatusBarColor={COLORS.secondary}>
            <Left style={{flex: 1}}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
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
                  fontSize: 25,
                  // fontFamily: fontFamily,
                  alignSelf: 'center',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                النتائج
              </Title>
            </Body>
            <Right />
          </Header>
          <LinearGradient
            colors={[COLORS.primary, '#a66c', COLORS.primary]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{
              width: '90%',
              flexDirection: 'row',
              marginTop: 17,
              // height: height * 0.06,
              marginBottom: 10,
              alignSelf: 'center',
              borderRadius: 10,
            }}>
            <View
              style={{
                // backgroundColor: 'white',
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
                  color: '#fff',
                }}>
                {this.state.name_of_sender}
              </Text>
            </View>
            <View
              style={{
                // backgroundColor: 'white',
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
              {/* <Text

                                        style={{
                                            textAlign: 'center',
                                            fontSize: 25,
                                            fontWeight: 'bold',
                                            color: "#fff",
                                        }}>
                                        VS
                          </Text> */}

              <Image
                source={images.versus}
                style={{width: 60, height: 60}}></Image>
            </View>

            <View
              style={{
                // backgroundColor: 'white',
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
                  color: '#fff',
                }}>
                {this.state.name_of_challenger}
              </Text>
            </View>
          </LinearGradient>
          <View style={{alignSelf: 'center'}}>
            <Text
              style={{color: COLORS.primary, fontSize: 20, marginBottom: 10}}>
              السؤال
            </Text>
          </View>

          <FlatList
            data={this.state.Questions}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    width: '90%',
                    flexDirection: 'row',
                    // height: height * 0.5,
                    borderRadius: 5,
                    marginBottom: 5,
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderColor: '#ddd',
                  }}>
                  <View
                    style={{
                      overflow: 'hidden',
                      backgroundColor: item.color,
                      width: '25%',
                      padding: 20,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 6,
                      },
                      shadowOpacity: 0.37,
                      shadowRadius: 7.49,
                      elevation: 12,
                      //  borderTopRightRadius:this.state.Questions.indexOf(item)==0?10:0,
                    }}>
                    {item.sender_score == true ? (
                      <View
                        // name={'circle'}
                        style={{
                          textAlign: 'center',
                          height: 25,
                          width: 25,
                          marginTop: 10,
                          backgroundColor: 'green',
                          borderRadius: 50,
                          // borderBottomWidth: .7,
                          // marginBottom: 10,
                        }}></View>
                    ) : (
                      <View
                        // name={'circle'}
                        style={{
                          textAlign: 'center',
                          height: 25,
                          width: 25,
                          marginTop: 10,
                          backgroundColor: 'red',
                          borderRadius: 50,
                          // borderBottomWidth: .7,
                          // marginBottom: 10,
                        }}></View>
                    )}
                  </View>
                  <View
                    style={{
                      backgroundColor: item.color,
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
                        fontSize: 15,
                        fontWeight: 'bold',
                        // borderBottomWidth: .7,
                        // marginBottom: 10,
                      }}>
                      {/* {this.nameFun(item.question_text)}...... */}
                      {item.question_text}
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: item.color,
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
                    {item.receiver_score == true ? (
                      <View
                        // name={'circle'}
                        style={{
                          // textAlign: 'center',
                          height: 25,
                          width: 25,
                          marginTop: 10,
                          backgroundColor: 'green',
                          borderRadius: 50,
                          alignSelf: 'center',

                          // borderBottomWidth: .7,
                          // marginBottom: 10,
                        }}></View>
                    ) : (
                      <View
                        // name={'circle'}
                        style={{
                          alignSelf: 'center',
                          // textAlign: 'center',
                          height: 25,
                          width: 25,
                          marginTop: 10,
                          backgroundColor: 'red',
                          borderRadius: 50,
                          // borderBottomWidth: .7,
                          // marginBottom: 10,
                        }}></View>
                    )}
                  </View>
                </View>
              );
            }}
          />
        </Container>
      </>
    );
  }
}
