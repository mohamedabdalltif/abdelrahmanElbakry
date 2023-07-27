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
  NativeModules,
  ToastAndroid,
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
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import {AppRequired, COLORS, FONTS, images, SIZES} from '../../constants';
import {StatusBar} from 'react-native';
const {width, height} = Dimensions.get('window');

export default class SummaryList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      generation_id: '',
      student_id: '',
      summary: [],
      loading: true,
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Online',
      drInfo: {},
    };
    this._subscription;
  }

  async componentDidMount() {
    // alert(await AsyncStorage.getItem('switch'))
    // this._subscription = NetInfo.addEventListener(
    //   this._handelConnectionInfoChange,
    // );

    const data = JSON.parse(await AsyncStorage.getItem('AllData'));

    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));
    this.setState({
      drInfo,
    });
    if (data != null) {
      this.setState({
        generation_id: data.student_generation_id,
        student_id: data.student_id,
      });
      this.get_summary();
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
        });
        Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
      }
    });
  }

  get_summary() {
    this.setState({loading: true});

    let data_to_send = {
      generation_id: this.state.generation_id,
      student_id: this.state.student_id,
      subject_id: this.state.drInfo.subject_id,
    };
    axios
      .post(AppRequired.Domain + `select_summary.php`, data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data != 'error') {
            if (res.data.summary.length > 0) {
              this.setState({
                summary: res.data.summary,
              });
            } else {
              this.setState({
                summary: [],
              });
            }
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجي المحاوله في وقتا لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجي المحاوله في وقتا لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
        this.setState({loading: false});
      });
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
      <Container style={{backgroundColor: '#fff'}}>
        <StatusBar backgroundColor={COLORS.secondary} />
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
              الملخصات
            </Text>
          </View>
          <View style={{flex: 1}} />
        </View>

        {
          // <Text>{item.exam_name}</Text>
        }
        {this.state.loading == true &&
        this.state.connection_Status == 'Online' ? (
          <Image
            source={images.mainLoading}
            style={{
              width: 100,
              height: 100,
              alignSelf: 'center',
              marginTop: SIZES.height * 0.3,
            }}
            resizeMode="contain"
          />
        ) : this.state.loading == false ? (
          <View>
            {this.state.summary.length == 0 ? (
              <View
                style={{
                  width: width,
                  height: height - 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: COLORS.primary,
                    fontFamily: FONTS.fontFamily,
                  }}>
                  لا يوجد ملخصات
                </Text>
              </View>
            ) : (
              <View style={{marginVertical: 15}}>
                <FlatList
                  data={this.state.summary}
                  renderItem={({item, index}) => {
                    if (index == this.state.summary.length - 1) {
                      return (
                        <TouchableOpacity
                          style={{
                            width: '90%',
                            alignSelf: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 12,
                            paddingVertical: 15,
                            borderRadius: 7,
                            backgroundColor: '#EAEFF2',
                            marginBottom: 100,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                          onPress={() => {
                            this.props.navigation.navigate('Viewer', {
                              sum_name: item.summary_name,
                              sum_link: item.summary_link,
                              refrish: this.componentDidMount,
                            });
                          }}>
                          <View
                            style={{
                              width: '100%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              // flexWrap: 'wrap',
                            }}>
                            <View style={{width: '80%'}}>
                              <Text
                                style={{
                                  fontSize: 22,
                                  color: '#444',
                                  fontFamily: FONTS.fontFamily,
                                }}>
                                {item.summary_name}
                              </Text>
                            </View>
                            <View style={{width: '12%'}}>
                              <Icon
                                name="file"
                                style={{
                                  fontSize: 35,
                                  color: COLORS.primary,
                                  marginLeft: 10,
                                }}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    } else {
                      return (
                        <TouchableOpacity
                          style={{
                            width: '90%',
                            alignSelf: 'center',
                            paddingHorizontal: 12,
                            paddingVertical: 15,
                            borderRadius: 7,
                            backgroundColor: '#EAEFF2',
                            marginBottom: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                          onPress={() => {
                            this.props.navigation.navigate('Viewer', {
                              sum_name: item.summary_name,
                              sum_link: item.summary_link,
                              refrish: this.componentDidMount,
                            });
                          }}>
                          <View
                            style={{
                              width: '100%',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              // flexWrap: 'wrap',
                            }}>
                            <View style={{width: '80%'}}>
                              <Text
                                style={{
                                  fontSize: 22,
                                  color: '#444',
                                  fontFamily: FONTS.fontFamily,
                                }}>
                                {item.summary_name}
                              </Text>
                            </View>
                            <View style={{width: '12%'}}>
                              <Icon
                                name="file"
                                style={{
                                  fontSize: 35,
                                  color: COLORS.primary,
                                  marginLeft: 10,
                                }}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    }
                  }}
                />
              </View>
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
