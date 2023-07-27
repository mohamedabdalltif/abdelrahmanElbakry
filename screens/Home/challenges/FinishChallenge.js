import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  ToastAndroid,
  FlatList,
} from 'react-native';
import {Spinner} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import {AppRequired, COLORS, FONTS, images} from '../../../constants';

export default class FinishChallenge extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Results: [],
      isloading: true,
      visibleModal: false,
    };
  }

  componentDidMount() {
    this.getdata();
  }

  async getdata() {
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));

    let data_to_send = {
      student_id: StudentData.student_id,
    };

    axios
      .post(
        AppRequired.Domain + 'challenge/select_finished_challanges.php',
        data_to_send,
      )
      .then((res) => {
        // alert(JSON.stringify(res.data));
        this.setState({
          isloading: false,
        });
        if (res.status == 200) {
          if (res.data != 'error') {
            if (res.data.length > 0) {
              this.setState({
                Results: res.data,
              });
            } else {
              this.setState({
                Results: [],
              });
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
      });
  }

  render() {
    return (
      <>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <StatusBar backgroundColor={COLORS.secondary}></StatusBar>
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
                  fontSize: 19,
                }}>
                التحديات المنتهية
              </Text>
            </View>
            <View style={{flex: 1}} />
          </View>
          {this.state.isloading == false ? (
            this.state.Results.length > 0 ? (
              <View style={{flex: 1}}>
                <FlatList
                  data={this.state.Results}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({item, index}) => (
                    <>
                      <Animatable.View
                        animation={
                          index + (1 % 2) != 0 ? 'fadeInRight' : 'fadeInLeft'
                        }
                        duration={2300}
                        delay={200}
                        style={{
                          width: '90%',
                          margin: '5%',
                          backgroundColor: '#fff',
                          alignSelf: 'center',
                          borderRadius: 8,
                          marginTop: 15,
                          elevation: 10,
                        }}>
                        <View
                          style={{
                            height: 70,
                            marginTop: 10,
                            width: '100%',
                            // backgroundColor: 'red',
                            alignSelf: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <View
                            style={{
                              width: '40%',
                              marginTop: 5,
                              height: 220,
                              alignItems: 'center',
                            }}>
                            <Image
                              source={images.User_Avatar_Transparent}
                              style={{
                                width: 45,
                                height: 45,
                                alignSelf: 'center',
                              }}></Image>

                            <Text
                              numberOfLines={2}
                              style={{
                                fontSize: 16,
                                color: '#aea9a9',
                                textAlign: 'center',
                                marginTop: 5,
                              }}>
                              {item.nameStudent}
                            </Text>

                            <Text
                              style={{
                                fontSize: 20,
                                alignSelf: 'center',
                                color: '#aea9a9',
                                marginTop: 3,
                              }}>
                              {item.challange_sender_id}
                            </Text>
                            {item.status == '1' ||
                            item.status == null ||
                            item.status == undefined ? (
                              item.winner == 'equal' ? (
                                <>
                                  <View style={{alignSelf: 'center'}}>
                                    <Image
                                      source={images.equality}
                                      style={{
                                        width: 110,
                                        height: 65,
                                        marginTop: 15,
                                        marginLeft: 20,
                                      }}></Image>
                                  </View>
                                </>
                              ) : item.winner == 'sender' ? (
                                <>
                                  <Image
                                    source={images.Rank1}
                                    style={{
                                      width: 75,
                                      height: 75,
                                      marginTop: 10,
                                      alignSelf: 'center',
                                    }}></Image>

                                  <Image
                                    source={images.winner}
                                    style={{
                                      width: 150,
                                      height: 150,
                                      alignSelf: 'center',
                                      marginTop: -30,
                                    }}></Image>
                                </>
                              ) : (
                                <>
                                  <Image
                                    source={images.Rank2}
                                    style={{
                                      width: 65,
                                      height: 65,
                                      marginTop: 15,
                                      alignSelf: 'center',
                                    }}></Image>

                                  <Image
                                    source={images.loser}
                                    style={{
                                      width: 150,
                                      height: 150,
                                      alignSelf: 'center',
                                      marginTop: -30,
                                    }}></Image>
                                </>
                              )
                            ) : null}
                          </View>

                          <View
                            style={{
                              width: 40,
                              height: 210,
                              // backgroundColor:"#f0f",
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                width: 2,
                                height: 40,
                                backgroundColor: COLORS.primary,
                              }}></View>
                            <Image
                              source={images.versus} //234.png
                              style={{width: 60, height: 60}}></Image>
                            {item.status == '1' ||
                            item.status == null ||
                            item.status == undefined ? (
                              <>
                                <View
                                  style={{
                                    width: 2,
                                    height: 40,
                                    backgroundColor: COLORS.primary,
                                  }}></View>
                                <Image
                                  source={images.goldenCup} //images (1).png
                                  style={{width: 50, height: 50}}></Image>
                                <View
                                  style={{
                                    width: 2,
                                    height: 30,
                                    backgroundColor: COLORS.primary,
                                  }}></View>
                              </>
                            ) : null}
                          </View>

                          <View
                            style={{
                              width: '40%',
                              // justifyContent: 'center',
                              // alignItems: 'center',
                              marginTop: 5,
                              height: 220,
                              alignItems: 'center',
                            }}>
                            <Image
                              source={images.secondAvatar}
                              style={{
                                width: 50,
                                height: 50,
                                alignSelf: 'center',
                              }}></Image>

                            <Text
                              numberOfLines={2}
                              style={{
                                fontSize: 16,
                                textAlign: 'center',
                                color: '#aea9a9',
                                marginTop: 2,
                              }}>
                              {item.nameOfChalenge}
                            </Text>

                            <Text
                              style={{
                                fontSize: 20,
                                alignSelf: 'center',
                                color: '#aea9a9',
                                marginTop: 3,
                              }}>
                              {item.challange_receiver_id}
                            </Text>

                            {item.status == '1' ||
                            item.status == null ||
                            item.status == undefined ? (
                              item.winner == 'equal' ? (
                                <>
                                  <View style={{alignSelf: 'center'}}>
                                    <Image
                                      source={images.equality}
                                      style={{
                                        width: 110,
                                        height: 65,
                                        marginTop: 15,
                                        marginRight: 20,
                                      }}></Image>
                                  </View>
                                </>
                              ) : item.winner == 'receiver' ? (
                                <>
                                  <Image
                                    source={images.Rank1}
                                    style={{
                                      width: 75,
                                      height: 75,
                                      marginTop: 10,
                                      alignSelf: 'center',
                                    }}></Image>

                                  <Image
                                    source={images.winner}
                                    style={{
                                      width: 150,
                                      height: 150,
                                      alignSelf: 'center',
                                      marginTop: -30,
                                    }}></Image>
                                </>
                              ) : (
                                <>
                                  <Image
                                    source={images.Rank2}
                                    style={{
                                      width: 65,
                                      height: 65,
                                      marginTop: 15,
                                      alignSelf: 'center',
                                    }}></Image>

                                  <Image
                                    source={images.loser}
                                    style={{
                                      width: 150,
                                      height: 150,
                                      alignSelf: 'center',
                                      marginTop: -30,
                                    }}></Image>
                                </>
                              )
                            ) : null}
                          </View>
                        </View>

                        <View style={{marginTop: 130}}>
                          {item.status == '1' ||
                          item.status == null ||
                          item.status == undefined ? (
                            <TouchableOpacity
                              onPress={() => {
                                this.props.navigation.navigate(
                                  'FinishDetails',
                                  {
                                    data: item,
                                  },
                                );
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
                                  عرض تفاصيل التحدي
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <View
                              style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: -50,
                              }}>
                              <Text style={{fontSize: 20}}>
                                في إنتطار نتيجه الطرف الأخر
                              </Text>
                            </View>
                          )}
                        </View>
                      </Animatable.View>
                    </>
                  )}
                />

                {/* <View style={{height: 40, width: '100%'}}></View> */}
              </View>
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
                    fontFamily: FONTS.fontFamily,
                  }}>
                  لا يوجد تحديات منتهية
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
