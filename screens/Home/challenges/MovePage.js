import * as React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';

import Icon from 'react-native-vector-icons/FontAwesome5';
import {NavigationEvents} from 'react-navigation';

import {Spinner} from 'native-base';
import {AppRequired, COLORS, FONTS, images} from '../../../constants';

export default class TabViewExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      student_id: '',
      allCount: {},
      loadingPage: true,
    };
  }

  async componentDidMount() {
    this.getAllCount();
  }
  getAllCount = async () => {
    let data = JSON.parse(await AsyncStorage.getItem('AllData'));
    this.setState({
      student_id: data.student_id,
    });
    let data_to_send = {
      student_id: data.student_id,
    };
    axios
      .post(
        AppRequired.Domain + 'challenge/select_challanges_count.php',
        data_to_send,
      )
      .then((res) => {
        if (res.status == 200) {
          if (res.data != 'error') {
            this.setState({
              allCount: res.data,
              loadingPage: false,
            });
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
            this.setState({
              loadingPage: false,
            });
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
          this.setState({
            loadingPage: false,
          });
        }
      });
  };
  render() {
    return (
      <View style={styles.conatiner}>
        <StatusBar
          barStyle="light-content"
          // translucent={true}
          backgroundColor={COLORS.secondary}
        />
        <NavigationEvents onDidFocus={() => this.getAllCount()} />

        {/* <View style={styles.rotateHeader} /> */}

        {this.state.loadingPage ? (
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.3)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 140,
                height: 140,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                borderRadius: 7,
              }}>
              <Spinner color={COLORS.primary} />
            </View>
          </View>
        ) : (
          <>
            <LinearGradient
              colors={[COLORS.primary, '#a66c', COLORS.primary]}
              start={{x: 0, y: 0.5}}
              end={{x: 2, y: 0}}
              style={styles.rotateHeader}
            />

            <View
              style={{
                flexDirection: 'row',
                // justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                // position: 'absolute',
                // alignSelf:'center',
                // left:12,
                // marginTop: 50,
                paddingRight: 8,
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}>
                  <Icon
                    name="arrow-right"
                    style={{fontSize: 24, color: '#fff'}}
                  />
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
                    fontSize: 19,
                  }}>
                  {' '}
                  التحديات
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    color: '#fff',
                    fontSize: 17,
                  }}>
                  كودك
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    color: '#fff',
                    fontSize: 17,
                  }}>
                  {this.state.student_id}
                </Text>
              </View>
              {/* <TouchableOpacity style={{ paddingVertical: 6, paddingHorizontal: 15, }}
          onPress={() => {
            this.props.navigation.navigate("Home");
          }}
        >
          <Icon name='arrow-right' size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={{
          fontSize: 25, fontWeight: 'bold',
          color: "#fff"
        }}>
          التحديات
        </Text> */}
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.partsOfChanallenge}>
                <Animatable.View
                  animation="fadeInRight"
                  duration={1000}
                  delay={400}
                  style={styles.sectionContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('PendingChalenge', {
                        refrish: this.getAllCount,
                      });
                    }}
                    style={{
                      width: '100%',
                      height: 130,
                      justifyContent: 'center',
                      alignItems: 'center',
                      // backgroundColor: COLORS.primary,
                      flexDirection: 'row',
                      padding: 10,
                      paddingLeft: 20,
                    }}>
                    <View style={styles.rightViewText}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: '#000',
                          fontWeight: 'bold',
                          fontStyle: 'normal',
                        }}>
                        صفحة الانتظار
                      </Text>
                    </View>
                    <View style={styles.leftViewImage}>
                      <Image
                        source={images.waitingChallenges}
                        style={{width: '100%', height: 100}}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.smallView}>
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: FONTS.fontFamily,
                        }}>
                        {this.state.allCount.pendding_count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animatable.View>

                <Animatable.View
                  animation="fadeInRight"
                  duration={1750}
                  delay={600}
                  style={styles.sectionContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('VSpage', {
                        refrish: this.getAllCount,
                      });
                    }}
                    style={{
                      width: '100%',
                      height: 130,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      padding: 10,
                      paddingLeft: 20,
                    }}>
                    <View style={styles.rightViewText}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: '#000',
                          fontWeight: 'bold',
                          fontStyle: 'normal',
                        }}>
                        دخول التحدى
                      </Text>
                    </View>
                    <View style={styles.leftViewImage}>
                      <Image
                        source={images.enterChallenges}
                        style={{width: '100%', height: 100}}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.smallView}>
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: FONTS.fontFamily,
                        }}>
                        {this.state.allCount.accept_count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animatable.View>

                <Animatable.View
                  animation="fadeInRight"
                  duration={2500}
                  delay={800}
                  style={styles.sectionContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('FinishChallenge', {
                        refrish: this.getAllCount,
                      });
                    }}
                    style={{
                      width: '100%',
                      height: 130,
                      justifyContent: 'center',
                      alignItems: 'center',
                      // backgroundColor: COLORS.primary,
                      flexDirection: 'row',
                      padding: 10,
                      paddingLeft: 20,
                    }}>
                    <View style={styles.rightViewText}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: '#000',
                          fontWeight: 'bold',
                          fontStyle: 'normal',
                        }}>
                        التحديات المنتهية
                      </Text>
                    </View>
                    <View style={styles.leftViewImage}>
                      <Image
                        source={images.completedChallenges1}
                        style={{width: '100%', height: 110}}
                        resizeMode="contain"
                      />
                    </View>
                    <View style={styles.smallView}>
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: FONTS.fontFamily,
                        }}>
                        {this.state.allCount.finished_count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </Animatable.View>
              </View>

              <View
                style={{
                  // backgroundColor: '#f0f',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 0.6,
                }}>
                <Animatable.View
                  animation="fadeInUp" // slideInUp | bounceInUp ==> Choose what U need
                  duration={2500}
                  delay={500}
                  style={{
                    width: '60%',
                    height: 50,
                    alignSelf: 'center',
                    // marginBottom: 20,
                    // marginTop: 10,
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginVertical: '17.7%',
                  }}>
                  <LinearGradient
                    colors={['#8b3983', '#a66c', '#8b3983']}
                    start={{x: 0, y: 0.5}}
                    end={{x: 2, y: 0}}>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        this.props.navigation.navigate('StudentChallenge');
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        paddingHorizontal: 25,
                        // backgroundColor: '#,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: '#FFFFFF',
                          fontWeight: 'bold',
                          fontStyle: 'normal',
                        }}>
                        تحدى جديد
                      </Text>
                      <Icon name="plus" size={20} color={'#fff'} />
                    </TouchableOpacity>
                  </LinearGradient>
                </Animatable.View>
              </View>
            </ScrollView>
          </>
        )}

        {/* <ScrollView> */}

        {/* </ScrollView> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  conatiner: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingTop:20
  },
  partsOfChanallenge: {
    // backgroundColor: '#f00',// Constants.containerColor,
    justifyContent: 'space-between',
    flex: 1.6,
    // paddingVertical: 20,
    marginTop: 10,
  },
  rotateHeader: {
    backgroundColor: COLORS.primary,
    height: Dimensions.get('window').height * 0.4,
    shadowOffset: {width: 2, height: 2},
    // elevation: 1,
    borderRadius: 60,
    width: '86%',
    overflow: 'hidden',
    position: 'absolute',
    transform: [
      {
        rotate: '40deg',
      },
    ],
    alignSelf: 'flex-end',
    marginTop: -100,
    right: -15,
  },
  innerViewHeader: {
    flexDirection: 'row',
    width: '96%',
    height: '90%',
    // backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,

    fontWeight: 'bold',
  },
  backBtn: {
    justifyContent: 'center',
    // backgroundColor: 'red',
    // alignItems: 'flex-end',
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    position: 'absolute',
    right: 7,
  },
  sectionContainer: {
    width: '90%',
    margin: '5%',
    justifyContent: 'space-between',
    borderWidth: 0.6,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.8,
    // elevation: 1,
    borderColor: '#ddd',
    // padding: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  rightViewText: {
    flex: 1.3,
    justifyContent: 'center',
    // alignItems: 'center',
    // paddingLeft: 10
  },
  leftViewImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallView: {
    backgroundColor: COLORS.primary,
    position: 'absolute',
    width: 45,
    height: 45,
    left: 0,
    top: 0,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
