import * as React from 'react';
import {
  StatusBar,
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  Animated,
  Platform,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ToastAndroid,
  Alert,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';
import NetInfo from '@react-native-community/netinfo';
import {Spinner, Toast, Root} from 'native-base';
import {TextInput} from 'react-native-paper';

import axios from 'axios';

import {images, SIZES, COLORS, FONTS, AppRequired} from '../../constants';
const ITEM_SIZE =
  Platform.OS === 'ios' ? SIZES.width * 0.72 : SIZES.width * 0.74;
const EMPTY_ITEM_SIZE = (SIZES.width - ITEM_SIZE) / 2;
class SelectSubject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollX: new Animated.Value(0),
      loading: true,
      connection_Status: true,
      Subjects: [],
      openLogoutModal: false,
      checkLogoutLoading: false,
      visableSubscribeModal: false,
      selectedItem: {},
      selectedItemIndex: 0,
      subCode: '',
      requestLoading: false,
    };
  }

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected == true) {
        this.setState({
          connection_Status: true,
        });
        this.selectDrs();
      } else {
        this.setState({
          connection_Status: false,
        });
      }
    });
  }

  /////////////////////////////////////////////////////////////    notifications
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    // If Premission granted proceed towards token fetch
    if (enabled) {
      this.getToken();
    } else {
      // If permission hasn’t been granted to our app, request user in requestPermission method.
      this.requestPermission();
    }
  }

  async getToken() {
    let fcmToken = await firebase.messaging().getToken();
    let storeToken = await AsyncStorage.getItem('fcmToken');

    if (fcmToken != storeToken) {
      this.saveToken(fcmToken);
    } else {
      console.log('the same token');
    }
  }

  async saveToken(fcmToken) {
    await AsyncStorage.setItem('fcmToken', fcmToken);

    let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let data_to_send = {
      student_id: studentData.student_id,
      student_token: fcmToken,
    };
    axios
      .post(AppRequired.Domain + 'save_token.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 'same') {
            console.log('finish send');
          } else {
            console.log('error');
          }
        } else {
          console.log('error');
        }
      });
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  async createNotificationListeners() {
    // This listener triggered when notification has been received in foreground
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        const {title, body, data} = notification;
        Alert.alert(
          title,
          body,
          [
            {
              text: 'cancel',
              onPress: () => {},
            },
            {
              text: 'go',
              onPress: () => {
                if (data.page_to_go == 'vs') {
                  this.props.navigation.navigate('PendingChalenge');
                } else if (data.page_to_go == 'exam') {
                  this.props.navigation.navigate('ExamList');
                } else if (data.page_to_go == 'quiz') {
                  this.props.navigation.navigate('QuizList');
                }
              },
            },
          ],
          {
            cancelable: true,
          },
        );
      });

    // This listener triggered when app is in backgound and we click, tapped and opened notifiaction
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const {title, body, data} = notificationOpen.notification;

        if (data.page_to_go == 'vs') {
          this.props.navigation.navigate('PendingChalenge');
        } else if (data.page_to_go == 'exam') {
          this.props.navigation.navigate('ExamList');
        } else if (data.page_to_go == 'quiz') {
          this.props.navigation.navigate('QuizList');
        }
      });

    // This listener triggered when app is closed and we click,tapped and opened notification
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body, data} = notificationOpen.notification;

      if (data.page_to_go == 'vs') {
        this.props.navigation.navigate('PendingChalenge');
      } else if (data.page_to_go == 'exam') {
        this.props.navigation.navigate('ExamList');
      } else if (data.page_to_go == 'quiz') {
        this.props.navigation.navigate('QuizList');
      }
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////
  async selectDrs() {
    const allData = JSON.parse(await AsyncStorage.getItem('AllData'));
    // console.log(allData);
    let data_to_send = {
      generation_id: allData.student_collection_id,
      student_id: allData.student_id,
    };
    axios
      .post(AppRequired.Domain + 'select_subject.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (Array.isArray(res.data.subject)) {
            if (res.data.subject.length == 0) {
              this.setState({
                Subjects: [],
              });
            } else {
              let mainData = res.data.subject;

              let newMainData = [{name: ''}, ...mainData, {name: ''}];
              this.setState({
                Subjects: newMainData,
              });
            }
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'الرجاء المحاولة فى وقت لاحق',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }
  async checkLogout() {
    this.setState({
      checkLogoutLoading: true,
    });
    let data = JSON.parse(await AsyncStorage.getItem('AllData'));
    let data_to_send = {
      student_id: data.student_id,
    };
    axios
      .post(AppRequired.Domain + 'student_logout.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            this.setData();
            this.props.navigation.navigate('Auth');
          } else if (res.data == 'error') {
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجي المحاوله في وقتا لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
            this.setState({
              checkLogoutLoading: false,
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
          this.setState({
            checkLogoutLoading: false,
          });
        }
      });
  }
  async setData() {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('switch', 'Auth');
  }

  async chareSubject() {
    let AllData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let data_to_send = {
      subject_id: this.state.selectedItem.subject_id,
      student_id: AllData.student_id,
      code: this.state.subCode.trim(),
    };

    if (this.state.subCode.trim() == '') {
      ToastAndroid.showWithGravityAndOffset(
        'الرجاء كتابة الكود الخاص بشحن المادة',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }

    if (this.state.subCode.trim().length != 14) {
      ToastAndroid.showWithGravityAndOffset(
        'يجب ان يتكون كود الشحن من 14 رقم',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }

    if (this.state.subCode * 0 != 0) {
      ToastAndroid.showWithGravityAndOffset(
        'يجب ان يتكون كود الشحن من ارقام',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }

    this.setState({
      requestLoading: true,
    });

    axios
      .post(AppRequired.Domain + 'sub_in_subject.php', data_to_send)
      .then((res) => {
        console.log(res.data);
        if (res.status == 200) {
          if (res.data == 'success') {
            let allData = this.state.Subjects;
            allData[this.state.selectedItemIndex].subscribed = '1';
            this.setState({
              Subjects: allData,
            });

            Toast.show({
              text: 'تم الاشتراك فى المادة بنجاح',
              buttonText: 'Okay',
              type: 'success',
              buttonTextStyle: {color: '#008000'},
              buttonStyle: {backgroundColor: '#5cb85c'},
            });
          } else if (res.data == 'used_code') {
            ToastAndroid.showWithGravity(
              'تم شحن الكارت من قبل',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
            );
          } else if (res.data == 'invalid_code') {
            ToastAndroid.showWithGravityAndOffset(
              'الكود الذى ادخلتة غير صحيح',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else {
            ToastAndroid.showWithGravityAndOffset(
              'عفواً حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عفواً حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({
          visableSubscribeModal: false,
          requestLoading: false,
          subCode: '',
        });
      });
  }
  // Backdrop = () => {
  //   const dotPosition = Animated.divide(this.state.scrollX, SIZES.width);

  //   return (
  //     <View style={{height: 30, marginVertical: 20}}>
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           height: 10,
  //         }}>
  //         {this.state.Subjects.slice(1, -1).map((item, index) => {
  //           const opacity = dotPosition.interpolate({
  //             inputRange: [index - 1, index, index + 1],
  //             outputRange: [0.3, 1, 0.3],
  //             extrapolate: 'clamp',
  //           });

  //           const dotSize = dotPosition.interpolate({
  //             inputRange: [index - 1, index, index + 1],
  //             outputRange: [15, 30, 15],
  //             extrapolate: 'clamp',
  //           });

  //           const dotColor = dotPosition.interpolate({
  //             inputRange: [index - 1, index, index + 1],
  //             outputRange: ['darkgray', '#222', 'darkgray'],
  //             extrapolate: 'clamp',
  //           });
  //           return (
  //             <Animated.View
  //               key={index.toString()}
  //               opacity={opacity}
  //               style={{
  //                 borderRadius: 10,
  //                 width: dotSize,
  //                 height: 7,
  //                 marginHorizontal: 6,
  //                 backgroundColor: dotColor,
  //               }}
  //             />
  //           );
  //         })}
  //       </View>
  //     </View>
  //   );
  // };
  renderSubjects = () => {
    const {scrollX} = this.state;
    return (
      <View
        style={{
          flex: 1,
        }}>
        <Animated.FlatList
          showsHorizontalScrollIndicator={false}
          data={this.state.Subjects}
          // data={[]}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          bounces={false}
          decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
          contentContainerStyle={{alignItems: 'center'}}
          snapToInterval={ITEM_SIZE}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={images.empty}
                  style={{
                    width: 200,
                    height: 200,
                    marginRight: SIZES.width * 0.25,
                  }}
                  resizeMode="center"
                />
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: 22,
                    marginRight: SIZES.width * 0.25,
                  }}>
                  لا توجد اى بيانات حتى الأن
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      openLogoutModal: true,
                    });
                  }}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.primary,
                    padding: 7,
                    borderRadius: 7,
                    marginRight: SIZES.width * 0.25,
                    marginVertical: 10,
                  }}>
                  <Text style={{fontFamily: FONTS.fontFamily, fontSize: 20}}>
                    تسجيل الخروج...
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
          snapToAlignment="center"
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {useNativeDriver: false},
          )}
          scrollEventThrottle={16}
          renderItem={({item, index}) => {
            if (!item.subject_photo) {
              return <View style={{width: EMPTY_ITEM_SIZE}} />;
            }
            const inputRange = [
              (index - 1) * ITEM_SIZE,
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
            ];

            const translateY = this.state.scrollX.interpolate({
              inputRange: inputRange,

              outputRange: [50, 50, 50],

              extrapolate: 'clamp',
            });

            return (
              <View style={{width: SIZES.width * 0.74}}>
                <Animated.View
                  style={{
                    marginHorizontal: 10,
                    padding: 10 * 2,
                    alignItems: 'center',
                    transform: [{translateY}],
                    backgroundColor: 'white',
                    borderRadius: 34,
                    elevation: 5,
                  }}>
                  <Image
                    // source={item.subject_image}
                    source={{uri: item.subject_photo}}
                    style={styles.posterImage}
                  />
                  <Text
                    style={{fontSize: 20, fontFamily: FONTS.fontFamily}}
                    numberOfLines={1}>
                    {item.subject_name}
                  </Text>
                  {/* <Text
                    style={{fontSize: 20, fontFamily: FONTS.fontFamily}}
                    numberOfLines={1}>
                    _{item.about_subject}_
                  </Text> */}

                  <TouchableOpacity
                    onPress={async () => {
                      if (item.subscribed == '1') {
                        this.props.navigation.navigate('MainApp');

                        await AsyncStorage.setItem(
                          'drInfo',
                          JSON.stringify(item),
                        );
                      } else {
                        this.setState({
                          visableSubscribeModal: true,
                          selectedItem: item,
                          selectedItemIndex: index,
                        });
                      }
                    }}
                    style={{
                      width: '50%',
                      height: '10%',
                      borderRadius: 8,
                      padding: 8,
                      backgroundColor: COLORS.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: '#fff', fontFamily: FONTS.fontFamily}}>
                      دخول
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            );
          }}
        />
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} />
        <Root>
          {/* {this.Backdrop()} */}

          {/* <View style={{height: SIZES.height * 0.65}}></View> */}

          <LinearGradient
            // start={{x: 0.0, y: 0}}
            // end={{x: 0.1, y: 1.0}}
            // locations={[0, 0.5, 0.8]}
            useAngle={true}
            angle={180}
            angleCenter={{x: 0.5, y: 0.8}}
            colors={[COLORS.primary, COLORS.secondary, COLORS.primary]}
            style={{
              height: '100%',
            }}>
            {this.state.loading && this.state.connection_Status ? (
              <View
                style={{
                  flex: 1,
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
            ) : this.state.connection_Status == false ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <StatusBar backgroundColor={COLORS.secondary} />
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 22,
                  }}>
                  الرجاء التأكد من اتصالك بالأنترنت
                </Text>
              </View>
            ) : this.state.loading == false ? (
              this.renderSubjects()
            ) : null}
          </LinearGradient>

          <Modal
            visible={this.state.openLogoutModal}
            onRequestClose={() => {
              this.setState({
                openLogoutModal: false,
              });
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
                    هل تريد تسجيل الخروج ؟
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
                      this.checkLogout();
                      this.setState({
                        openLogoutModal: false,
                      });
                    }}>
                    <Text
                      style={{
                        fontFamily: FONTS.fontFamily,
                        color: COLORS.primary,
                        fontSize: 20,
                      }}>
                      خروج
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
                      this.setState({
                        openLogoutModal: false,
                      });
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
          <Modal visible={this.state.checkLogoutLoading} transparent={true}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}>
              <Spinner color={COLORS.primary} />
            </View>
          </Modal>

          <Modal
            visible={this.state.visableSubscribeModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              this.setState({
                visableSubscribeModal: false,
              });
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,.5)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  paddingVertical: 20,
                  backgroundColor: '#fff',
                  marginHorizontal: 20,
                  borderRadius: 10,
                  width: '90%',
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: FONTS.fontFamily,
                      marginLeft: 10,
                    }}>
                    يجب الاشتراك اولاً فى المادة
                  </Text>

                  <TextInput
                    autoFocus={true}
                    theme={{
                      colors: {
                        primary: COLORS.primary,
                        underlineColor: 'transparent',
                      },
                    }}
                    value={this.state.subCode}
                    label={'كود الشحن'}
                    autoCapitalize={'none'}
                    onChangeText={(text) => {
                      this.setState({
                        subCode: text,
                      });
                    }}
                    autoCorrect={false}
                    style={{
                      width: '90%',
                      alignSelf: 'center',
                      margin: '5%',
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <TouchableOpacity
                    disabled={this.state.requestLoading}
                    onPress={() => {
                      this.chareSubject();
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: COLORS.secondary,
                      width: '35%',
                      height: 50,
                      padding: 10,
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}>
                    {this.state.requestLoading ? (
                      <Spinner color="#fff" size={18} />
                    ) : (
                      <Text
                        style={{
                          fontSize: 18,
                          fontFamily: FONTS.fontFamily,
                          color: '#fff',
                        }}>
                        شحن
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={this.state.requestLoading}
                    onPress={() => {
                      this.setState({
                        visableSubscribeModal: false,
                        subCode: '',
                      });
                    }}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'red',
                      width: '35%',
                      height: 50,

                      padding: 10,
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: FONTS.fontFamily,
                        color: '#fff',
                      }}>
                      إلغاء
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </Root>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
  },
});

export default SelectSubject;
