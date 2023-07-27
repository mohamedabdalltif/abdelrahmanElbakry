import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  Platform,
  ImageBackground,
  Modal,
  ToastAndroid,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Video from 'react-native-af-video-player-updated';
import Orientation from 'react-native-orientation';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {NavigationEvents} from 'react-navigation';
import axios from 'axios';
// import firebase from 'react-native-firebase';
import {AppRequired, COLORS, FONTS, images, SIZES} from '../../constants';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Spinner,
  Title,
} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
const ITEM_SIZE =
  Platform.OS === 'ios' ? SIZES.width * 0.72 + 40 : SIZES.width * 0.74 + 40;
const SEPACER_ITEM_SIZE = (SIZES.width - ITEM_SIZE - 10) / 2;
// import Modal from 'react-native-modalbox';
export default class MainPage extends React.Component {
  constructor() {
    super();
    this.state = {
      connection_Status: 'Online',
      studentMoney: '',
      isWantSubscripe: false,
      openStreamsModal: false,
      openInvidualModal: false,
      selectedItem: {},
      streamsOfMonth: [{}],
      individualVideos: [],
      loading: true,
      submit: false,
      payButtonLoading: false,
      submitStatus: 0,
      refreshing: false,
      single_video_details: {},
      selected_individual_video_index: 0,
      alertBeforeWatchingSingleModal: false,
      checkInsertSingelViewFun: false,
      chainDetails: {},
      alertBeforeWatchingChainModal: false,
      //
      open_search_modal: false,
      search_type: '',
      searchField: '',
      streamsOfMonthFilterArray: [],
      streamsOfMonthMainFilterArray: [],
      individualVideosMainFilterArray: [],
      individualVideosFilterArray: [],
      end_sub: '',
      visableEndSub: false,
      subject_name: '',
    };
  }

  async componentWillUnmount() {
    Orientation.lockToPortrait();
  }

  ///////////////////////////////////////////////////    notification

  async componentDidMount() {
    let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));

    // this.checkPermission();
    // this.createNotificationListeners();

    // Register all listener for notification
  }

  info = async () => {
    let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));

    let data_to_send = {
      generation_id: studentData.student_generation_id,
      student_id: studentData.student_id,
      subject_id: drInfo.subject_id,
    };

    axios
      .post(AppRequired.Domain + 'get_profile_info.php', data_to_send)
      .then((res) => {
        console.log(res.data);
        if (res.status == 200) {
          if (res.data != 'error') {
            if (Object.keys(res.data).length > 3) {
              this.setState({
                dataa: res.data,
                exams: res.data.exams,
                end_sub: res.data.end_date,
              });
              this.save_points(res.data);
            } else {
              this.setData();
              ToastAndroid.showWithGravityAndOffset(
                'قد تمت إزالتك',
                ToastAndroid.LONG,
                ToastAndroid.CENTER,
                25,
                50,
              );
              this.props.navigation.navigate('Auth');
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
        this.setState({loading: false});
      });
  };
  setData = async () => {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('switch', 'Auth');
  };

  async save_points(data) {
    let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    studentData.student_points = data.points;
    await AsyncStorage.setItem('AllData', JSON.stringify(studentData));
  }

  // async checkPermission() {
  //   const enabled = await firebase.messaging().hasPermission();
  //   // If Premission granted proceed towards token fetch
  //   if (enabled) {
  //     this.getToken();
  //   } else {
  //     // If permission hasn’t been granted to our app, request user in requestPermission method.
  //     this.requestPermission();
  //   }
  // }

  // async getToken() {
  //   let fcmToken = await firebase.messaging().getToken();
  //   let storeToken = await AsyncStorage.getItem('fcmToken');

  //   if (fcmToken != storeToken) {
  //     this.saveToken(fcmToken);
  //   } else {
  //     console.log('the same token');
  //   }
  // }

  // async saveToken(fcmToken) {
  //   await AsyncStorage.setItem('fcmToken', fcmToken);

  //   let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
  //   let data_to_send = {
  //     student_id: studentData.student_id,
  //     student_token: fcmToken,
  //   };
  //   axios
  //     .post(AppRequired.Domain + 'save_token.php', data_to_send)
  //     .then((res) => {
  //       if (res.status == 200) {
  //         if (res.data == 'same') {
  //           console.log('finish send');
  //         } else {
  //           console.log('error');
  //         }
  //       } else {
  //         console.log('error');
  //       }
  //     });
  // }

  // async requestPermission() {
  //   try {
  //     await firebase.messaging().requestPermission();
  //     // User has authorised
  //     this.getToken();
  //   } catch (error) {
  //     // User has rejected permissions
  //     console.log('permission rejected');
  //   }
  // }

  // async createNotificationListeners() {
  //   // This listener triggered when notification has been received in foreground
  //   this.notificationListener = firebase
  //     .notifications()
  //     .onNotification((notification) => {
  //       const {title, body, data} = notification;
  //       Alert.alert(
  //         title,
  //         body,
  //         [
  //           {
  //             text: 'cancel',
  //             onPress: () => {},
  //           },
  //           {
  //             text: 'go',
  //             onPress: () => {
  //               if (data.page_to_go == 'vs') {
  //                 this.props.navigation.navigate('PendingChalenge');
  //               } else if (data.page_to_go == 'exam') {
  //                 this.props.navigation.navigate('ExamList');
  //               } else if (data.page_to_go == 'quiz') {
  //                 this.props.navigation.navigate('QuizList');
  //               }
  //             },
  //           },
  //         ],
  //         {
  //           cancelable: true,
  //         },
  //       );
  //     });

  //   // This listener triggered when app is in backgound and we click, tapped and opened notifiaction
  //   this.notificationOpenedListener = firebase
  //     .notifications()
  //     .onNotificationOpened((notificationOpen) => {
  //       const {title, body, data} = notificationOpen.notification;

  //       if (data.page_to_go == 'vs') {
  //         this.props.navigation.navigate('PendingChalenge');
  //       } else if (data.page_to_go == 'exam') {
  //         this.props.navigation.navigate('ExamList');
  //       } else if (data.page_to_go == 'quiz') {
  //         this.props.navigation.navigate('QuizList');
  //       }
  //     });

  //   // This listener triggered when app is closed and we click,tapped and opened notification
  //   const notificationOpen = await firebase
  //     .notifications()
  //     .getInitialNotification();
  //   if (notificationOpen) {
  //     const {title, body, data} = notificationOpen.notification;

  //     if (data.page_to_go == 'vs') {
  //       this.props.navigation.navigate('PendingChalenge');
  //     } else if (data.page_to_go == 'exam') {
  //       this.props.navigation.navigate('ExamList');
  //     } else if (data.page_to_go == 'quiz') {
  //       this.props.navigation.navigate('QuizList');
  //     }
  //   }
  // }

  ///////////////////////////////////////////////////   end notification

  async CustomComponentDidMount() {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected == true) {
        this.setState({
          connection_Status: 'Online',
        });
        this.getData();
        this.getCurrentBalence();
        this.info();
      } else {
        this.setState({
          connection_Status: 'Offline',
        });
      }
    });
  }
  search_lesson_onStreams(search_text) {
    this.setState({
      searchField: search_text,
    });

    let text = search_text.toLowerCase();
    let trucks = this.state.streamsOfMonthMainFilterArray;
    let filteredName = trucks.filter((item) => {
      return item.chain_name.toLowerCase().match(search_text);
    });
    if (!text || text === '') {
      this.setState({
        streamsOfMonthFilterArray: filteredName,
      });
    } else if (!Array.isArray(filteredName) && !filteredName.length) {
      this.setState({
        streamsOfMonthFilterArray: this.state.streamsOfMonthMainFilterArray,
      });
    } else if (Array.isArray(filteredName)) {
      this.setState({
        streamsOfMonthFilterArray: filteredName,
      });
    }
  }

  search_lesson_onIndividual(search_text) {
    this.setState({
      searchField: search_text,
    });

    let text = search_text.toLowerCase();
    let trucks = this.state.individualVideosMainFilterArray;

    let filteredName = trucks.filter((item) => {
      return item.video_title.toLowerCase().match(search_text);
    });
    if (!text || text === '') {
      this.setState({
        individualVideosFilterArray: filteredName,
      });
    } else if (!Array.isArray(filteredName) && !filteredName.length) {
      this.setState({
        individualVideosFilterArray: this.state.individualVideosMainFilterArray,
      });
    } else if (Array.isArray(filteredName)) {
      this.setState({
        individualVideosFilterArray: filteredName,
      });
    }
  }

  getCurrentBalence = async () => {
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let data_to_send = {
      student_id: StudentData.student_id,
    };

    axios
      .post(AppRequired.Domain + 'select_balance.php', data_to_send)
      .then(async (res) => {
        if (res.status == 200) {
          if (res.data * 0 == 0) {
            this.setState({
              studentMoney: parseFloat(res.data),
            });
          } else {
            ToastAndroid.showWithGravity(
              'عذرا حدث خطأ ما',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          }
        } else {
          ToastAndroid.showWithGravity(
            'عذرا حدث خطأ ما',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }
      });
  };

  getData = async () => {
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));
    this.setState({
      subject_name: drInfo.subject_name,
    });

    let data_to_send = {
      generation_id: StudentData.student_generation_id,
      student_id: StudentData.student_id,
      subject_id: drInfo.subject_id,
    };

    axios
      .post(AppRequired.Domain + 'select_home.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (
            // Array.isArray(res.data.videos) &&
            Array.isArray(res.data.chains)
          ) {
            // let videosArray = res.data.videos;
            let videosArray = [];

            let chainsArray = res.data.chains;

            // this.setState({
            //   individualVideos: [
            //     {key: 'left-spacer', video_title: ''},
            //     ...videosArray,
            //     {key: 'right-spacer', video_title: ''},
            //   ],
            //   streamsOfMonth: [
            //     {key: 'left-spacer', chain_name: ''},
            //     ...chainsArray,
            //     {key: 'right-spacer', chain_name: ''},
            //   ],

            //   streamsOfMonthFilterArray: [
            //     {key: 'left-spacer', chain_name: ''},
            //     ...chainsArray,
            //     {key: 'right-spacer', chain_name: ''},
            //   ],
            //   individualVideosFilterArray: [
            //     {key: 'left-spacer', video_title: ''},
            //     ...videosArray,
            //     {key: 'right-spacer', video_title: ''},
            //   ],

            //   streamsOfMonthMainFilterArray: [
            //     {key: 'left-spacer', chain_name: ''},
            //     ...chainsArray,
            //     {key: 'right-spacer', chain_name: ''},
            //   ],
            //   individualVideosMainFilterArray: [
            //     {key: 'left-spacer', video_title: ''},
            //     ...videosArray,
            //     {key: 'right-spacer', video_title: ''},
            //   ],
            // });
            this.setState({
              individualVideos: videosArray,
              streamsOfMonth: chainsArray,
              streamsOfMonthFilterArray: chainsArray,
              individualVideosFilterArray: videosArray,
              streamsOfMonthMainFilterArray: chainsArray,
              individualVideosMainFilterArray: videosArray,
            });
          } else {
            this.setState({
              streamsOfMonthMainFilterArray: [],
              individualVideosMainFilterArray: [],
              individualVideosFilterArray: [],
              streamsOfMonthFilterArray: [],
              streamsOfMonth: [],
              individualVideos: [],
            });
            ToastAndroid.showWithGravityAndOffset(
              'عذرا يرجى المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          }
        } else {
          this.setState({
            streamsOfMonthMainFilterArray: [],
            individualVideosMainFilterArray: [],
            individualVideosFilterArray: [],
            streamsOfMonthFilterArray: [],
            streamsOfMonth: [],
            individualVideos: [],
          });
          ToastAndroid.showWithGravityAndOffset(
            'عذرا يرجى المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
          refreshing: false,
        });
      });
  };
  insert_one_view_singel = async () => {
    this.setState({checkInsertSingelViewFun: true});
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));

    let videoData = this.state.single_video_details;
    let data_to_send = {
      video_id: videoData.video_id,
      student_id: data.student_id,
    };
    axios
      .post(AppRequired.Domain + 'insert_one_view.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            this.setState({
              checkInsertViewFun: false,
              alertBeforeWatchingSingleModal: false,
              open_search_modal: false,
              searchField: '',
            });
            videoData.view_count = (
              parseInt(videoData.view_count) + 1
            ).toString();
            let allVideos = this.state.individualVideos;
            allVideos[this.state.selected_individual_video_index] = videoData;
            this.setState({
              individualVideos: allVideos,
              checkInsertSingelViewFun: false,
              open_search_modal: false,
              searchField: '',
            });
            this.props.navigation.navigate('WatchIndvidualVideo', {
              vedio_details: videoData,
            });
          } else if (res.data == 'error') {
            this.setState({checkInsertViewFun: false});

            this.setState({
              wrongSingleModal: true,
              WrongModalReason: 'error',
              alertBeforeWatchingSingleModal: false,
              open_search_modal: false,
              searchField: '',
            });
          }
        } else {
          this.setState({
            wrongSingleModal: true,
            WrongModalReason: 'res!=200',
            checkInsertSingelViewFun: false,
            alertBeforeWatchingSingleModal: false,
            open_search_modal: false,
            searchField: '',
          });
        }
      });
  };
  async payStreamVideos() {
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));

    let data_to_send = {
      playlist_id: this.state.selectedItem.chain_id,
      student_id: StudentData.student_id,
    };
    this.setState({
      payButtonLoading: true,
    });

    axios
      .post(AppRequired.Domain + 'buy_chain_from_balance.php', data_to_send)
      .then(async (res) => {
        if (res.status == 200) {
          this.setState({
            payButtonLoading: false,
            openStreamsModal: false,
            isWantSubscripe: false,
          });
          if (res.data == 'success') {
            this.getData();
            this.getCurrentBalence();

            this.setState({
              submit: true,
              submitStatus: 1,
              studentMoney: newMoney,
            });
          } else if (res.data == 'cash_down') {
            this.setState({
              submit: true,
              submitStatus: 2,
            });
          } else if (res.data == 'error') {
            this.setState({
              submit: true,
              submitStatus: 4,
            });
          } else if (res.data == 'buy_before') {
            this.setState({
              submit: true,
              submitStatus: 5,
            });
          } else {
            this.setState({
              submit: true,
              submitStatus: 4,
            });
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا الرجاء المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      });
  }

  async payInduvedualVideos() {
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));

    let data_to_send = {
      video_id: this.state.selectedItem.video_id,
      student_id: StudentData.student_id,
    };
    this.setState({
      payButtonLoading: true,
    });

    axios
      .post(AppRequired.Domain + 'buy_video_from_balance.php', data_to_send)
      .then(async (res) => {
        if (res.status == 200) {
          this.setState({
            payButtonLoading: false,
            openInvidualModal: false,
            isWantSubscripe: false,
          });
          if (res.data == 'success') {
            this.getData();
            let AllData = JSON.parse(await AsyncStorage.getItem('AllData'));
            let newMoney =
              AllData.studentMoney - this.state.selectedItem.video_price;
            AllData.studentMoney = newMoney;
            await AsyncStorage.setItem('AllData', JSON.stringify(AllData));

            this.setState({
              submit: true,
              submitStatus: 1,
              studentMoney: newMoney,
            });
          } else if (res.data == 'cash_down') {
            this.setState({
              submit: true,
              submitStatus: 2,
            });
          } else if (res.data == 'error') {
            this.setState({
              submit: true,
              submitStatus: 4,
            });
          } else if (res.data == 'buy_before') {
            this.setState({
              submit: true,
              submitStatus: 5,
            });
          } else {
            this.setState({
              submit: true,
              submitStatus: 4,
            });
          }
        } else {
          ToastAndroid.showWithGravityAndOffset(
            'عذرا الرجاء المحاوله فى وقت لاحق',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      });
  }

  underHeader = () => {
    return (
      <View
        style={{
          ...styles.underHeaderContainer,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            padding: 4,
            borderRadius: 7,
          }}
          onPress={() => {
            this.setState({
              open_search_modal: true,
              search_type: 'stream',
            });
          }}>
          <Text
            style={{
              color: '#fff',
              fontFamily: FONTS.fontFamily,
              fontSize: 18,
            }}>
            {'<'} مسارات الشهور
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderStreamsOfMonth = () => {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={this.state.streamsOfMonth}
        snapToInterval={ITEM_SIZE}
        // keyExtractor={(item) => item.key}
        keyExtractor={(i, k) => k.toString()}
        // horizontal

        bounces={false}
        contentContainerStyle={{
          alignItems: 'center',
          marginBottom: 100,
        }}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: '#fff',
                width: SIZES.width,
                // height: 70,
              }}>
              <Image
                source={images.empty}
                style={{
                  width: 200,
                  height: 200,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: FONTS.fontFamily,
                  fontSize: 20,
                }}>
                لا توجد فيديوهات متاحه
              </Text>
            </View>
          );
        }}
        snapToAlignment="center"
        scrollEventThrottle={16}
        renderItem={({item, index}) => {
          if (!item.preview_photo) {
            return <View style={{width: SEPACER_ITEM_SIZE}} />;
          }
          return (
            <View
              style={{
                width: ITEM_SIZE,
                marginVertical: 15,
              }}>
              <View
                style={{
                  ...styles.item_of_month_stream,
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.type == 'subscribed') {
                      this.props.navigation.navigate('WatchStreamVideo', {
                        chain_id: item.chain_id,
                      });

                      this.setState({
                        alertBeforeWatchingChainModal: false,
                        open_search_modal: false,
                        searchField: '',
                      });
                      // this.setState({
                      //   alertBeforeWatchingChainModal: true,
                      //   chainDetails: item,
                      // });
                    } else {
                      this.setState({
                        openStreamsModal: true,
                        selectedItem: item,
                      });
                    }
                  }}
                  style={{flex: 1}}>
                  <ImageBackground
                    source={{uri: item.preview_photo}}
                    style={{
                      height: 200,
                      width: '100%',
                      alignItems: 'flex-end',
                    }}
                    resizeMode="cover">
                    <LinearGradient
                      start={{x: 0.0, y: 0}}
                      end={{x: 0.1, y: 1.0}}
                      locations={[0, 0.5, 0.8]}
                      useAngle={true}
                      angle={90}
                      angleCenter={{x: 0.5, y: 0.5}}
                      colors={[
                        '#fff',
                        'rgba(255,255,255,0.9)',
                        'rgba(255,255,255,0.01)',
                      ]}
                      style={{...styles.LinearGradientStyle}}>
                      {item.type == 'new' ? (
                        <View
                          style={{
                            ...styles.newBagde,
                          }}>
                          <Text style={{color: '#fff'}}>New</Text>
                        </View>
                      ) : item.type == 'popular' ? (
                        <View
                          style={{
                            ...styles.popularBadge,
                            marginTop: 0,
                            marginRight: 0,
                          }}>
                          <Text
                            style={{
                              alignSelf: 'center',
                              color: '#fff',
                              fontFamily: FONTS.fontFamily,
                              fontSize: 12,
                            }}>
                            Popular
                          </Text>
                        </View>
                      ) : item.type == 'subscribed' ? (
                        <View
                          style={{
                            ...styles.popularBadge,
                            marginTop: 0,
                            marginRight: 0,
                          }}>
                          <Text
                            style={{
                              alignSelf: 'center',
                              color: '#fff',
                              fontFamily: FONTS.fontFamily,
                              fontSize: 10,
                            }}>
                            Subscribed
                          </Text>
                        </View>
                      ) : null}

                      <View
                        style={{
                          marginVertical: 20,
                        }}>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 17,
                            textAlign: 'right',
                            fontFamily: FONTS.fontFamily,
                          }}>
                          {item.chain_name}
                        </Text>
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 15,
                            textAlign: 'right',
                            fontFamily: FONTS.fontFamily,
                          }}>
                          {item.description}
                        </Text>
                      </View>
                      <View
                        style={{position: 'absolute', bottom: 4, right: 15}}>
                        <Text style={{color: 'rgba(0,0,0,0.7)'}}>
                          {item.chain_date}
                        </Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    );
  };

  // renderLessonsOfMonth = () => {
  //   return (
  //     <View style={{backgroundColor: '#fff'}}>
  //       <FlatList
  //         showsHorizontalScrollIndicator={false}
  //         data={this.state.individualVideos}
  //         snapToInterval={ITEM_SIZE}
  //         // keyExtractor={(item) => item.key}
  //         keyExtractor={(i, k) => k.toString()}
  //         horizontal
  //         bounces={false}
  //         contentContainerStyle={{
  //           alignItems: 'center',
  //         }}
  //         ListEmptyComponent={() => {
  //           return (
  //             <View
  //               style={{
  //                 flex: 1,
  //                 alignItems: 'center',
  //                 justifyContent: 'center',
  //                 backgroundColor: '#fff',
  //                 width: SIZES.width,
  //                 height: 70,
  //               }}>
  //               <Text
  //                 style={{
  //                   fontFamily: FONTS.fontFamily,
  //                   fontSize: 20,
  //                 }}>
  //                 لا توجد فيديوهات متاحه
  //               </Text>
  //             </View>
  //           );
  //         }}
  //         snapToAlignment="center"
  //         scrollEventThrottle={16}
  //         renderItem={({item, index}) => {
  //           if (!item.video_image_link) {
  //             return <View style={{width: SEPACER_ITEM_SIZE}} />;
  //           }
  //           return (
  //             <View style={{width: ITEM_SIZE}}>
  //               <TouchableOpacity
  //                 activeOpacity={0.7}
  //                 onPress={() => {
  //                   if (item.type == 'subscribed') {
  //                     this.setState({
  //                       single_video_details: item,
  //                       selected_individual_video_index: index,
  //                     });
  //                     if (
  //                       parseInt(item.view_count) <
  //                       parseInt(item.view_limit_count)
  //                     ) {
  //                       this.setState({
  //                         alertBeforeWatchingSingleModal: true,
  //                       });
  //                     } else {
  //                       ToastAndroid.showWithGravityAndOffset(
  //                         'لقد انهيت عدد المشاهدات المتاحه لك لهذا الفيديو',
  //                         ToastAndroid.LONG,
  //                         ToastAndroid.CENTER,
  //                         25,
  //                         50,
  //                       );
  //                     }
  //                   } else {
  //                     this.setState({
  //                       openInvidualModal: true,
  //                       selectedItem: item,
  //                     });
  //                   }
  //                 }}
  //                 style={{
  //                   marginHorizontal: 10,
  //                   alignItems: 'center',
  //                   justifyContent: 'center',
  //                   paddingVertical: 10,
  //                 }}>
  //                 <ImageBackground
  //                   source={{uri: item.video_image_link}}
  //                   style={{
  //                     width: '100%',
  //                     height: 200,
  //                   }}>
  //                   <View>
  //                     {item.type == 'new' ? (
  //                       <View
  //                         style={{
  //                           ...styles.newBagde,
  //                         }}>
  //                         <Text style={{color: '#fff'}}>New</Text>
  //                       </View>
  //                     ) : item.type == 'popular' ? (
  //                       <View
  //                         style={{
  //                           ...styles.popularBadge,
  //                           // marginTop: 0,
  //                           // marginRight: 0,
  //                         }}>
  //                         <Text
  //                           style={{
  //                             alignSelf: 'center',
  //                             color: '#fff',
  //                             fontFamily: FONTS.fontFamily,
  //                             fontSize: 12,
  //                           }}>
  //                           Popular
  //                         </Text>
  //                       </View>
  //                     ) : item.type == 'subscribed' ? (
  //                       <View
  //                         style={{
  //                           ...styles.popularBadge,
  //                           // marginTop: 0,
  //                           // marginRight: 0,
  //                         }}>
  //                         <Text
  //                           style={{
  //                             alignSelf: 'center',
  //                             color: '#fff',
  //                             fontFamily: FONTS.fontFamily,
  //                             fontSize: 10,
  //                           }}>
  //                           Subscribed
  //                         </Text>
  //                       </View>
  //                     ) : null}
  //                   </View>
  //                   <View
  //                     style={{
  //                       ...styles.lessonDuration,
  //                     }}>
  //                     <Text
  //                       style={{
  //                         alignSelf: 'center',
  //                         color: '#fff',
  //                         fontFamily: FONTS.fontFamily,
  //                         fontSize: 12,
  //                       }}>
  //                       {item.video_date}
  //                     </Text>
  //                   </View>
  //                 </ImageBackground>
  //                 <Text
  //                   style={{fontFamily: FONTS.fontFamily, fontSize: 15}}
  //                   numberOfLines={2}>
  //                   {item.video_title}
  //                 </Text>
  //                 <Text
  //                   style={{fontFamily: FONTS.fontFamily, fontSize: 15}}
  //                   numberOfLines={2}>
  //                   {item.video_description}
  //                 </Text>
  //               </TouchableOpacity>
  //             </View>
  //           );
  //         }}
  //       />
  //     </View>
  //   );
  // };
  render() {
    return (
      <Container style={{backgroundColor: '#fff'}}>
        <NavigationEvents onDidFocus={() => this.CustomComponentDidMount()} />
        <Header
          androidStatusBarColor={COLORS.secondary}
          style={{backgroundColor: COLORS.primary}}>
          <Left>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  visableEndSub: true,
                });
              }}>
              <AntDesign name="calendar" size={30} color="#fff" />
            </TouchableOpacity>

            {/* <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                this.props.navigation.navigate('Charge');
              }}
              style={{
                ...styles.leftHeader,
                paddingHorizontal: 4,
              }}>
              <Text
                numberOfLines={2}
                style={{
                  color: '#fff',
                  textAlign: 'center',
                  fontSize: 11,
                  fontFamily: FONTS.fontFamily,
                }}>
                رصيدك{'\n'}
                {this.state.studentMoney == null ? 0 : this.state.studentMoney}
              </Text>
              <View style={styles.image_badge}>
                <Text style={{color: '#fff'}}>+</Text>
              </View>
            </TouchableOpacity> */}
          </Left>
          <Body></Body>
          <Right>
            <Title>{AppRequired.appName}</Title>
          </Right>
        </Header>

        {this.state.loading == true &&
        this.state.connection_Status == 'Online' ? (
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
        ) : this.state.loading == false ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.getData.bind(this)}
                colors={[COLORS.primary, COLORS.primary]}
              />
            }
            showsVerticalScrollIndicator={false}>
            {this.underHeader()}
            {this.renderStreamsOfMonth()}
            {/* <TouchableOpacity
              onPress={() => {
                this.setState({
                  open_search_modal: true,
                  search_type: 'individual',
                });
              }}>
              <Text
                style={{
                  color: COLORS.third,
                  fontSize: 18,
                  marginLeft: 15,
                  marginVertical: 15,
                  fontFamily: FONTS.fontFamily,
                }}>
                {'<'} مسارات الحصص
              </Text>
            </TouchableOpacity>

            {this.renderLessonsOfMonth()} */}
          </ScrollView>
        ) : this.state.connection_Status == 'Offline' ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <StatusBar backgroundColor={COLORS.secondary} />
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 22,
              }}>
              الرجاء التأكد من اتصالك بالأنترنت
            </Text>
          </View>
        ) : null}

        <Modal
          animationType="slide"
          visible={this.state.openStreamsModal}
          transparent={true}
          onRequestClose={() => {
            Orientation.lockToPortrait();

            this.setState({
              openStreamsModal: false,
            });
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 10,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => {
                  Orientation.lockToPortrait();

                  this.setState({
                    openStreamsModal: false,
                  });
                }}
                style={{
                  width: 50,
                  alignSelf: 'flex-end',
                  marginBottom: 10,
                }}>
                <Feather name="x" color="#fff" size={35} />
              </TouchableOpacity>

              <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{width: '100%', minHeight: 250}}>
                  <Video
                    url={this.state.selectedItem.preview_video}
                    rotateToFullScreen={true}
                    lockPortraitOnFsExit={true}
                    hideFull
                    scrollBounce={true}
                  />
                  <View>
                    {this.state.selectedItem.type == 'new' ? (
                      <View
                        style={{
                          ...styles.newBagde,
                        }}>
                        <Text style={{color: '#fff'}}>New</Text>
                      </View>
                    ) : this.state.selectedItem.type == 'popular' ? (
                      <View
                        style={{
                          ...styles.popularBadge,
                          marginTop: 0,
                          marginRight: 0,
                        }}>
                        <Text
                          style={{
                            alignSelf: 'center',
                            color: '#fff',
                            fontFamily: FONTS.fontFamily,
                            fontSize: 12,
                          }}>
                          Popular
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* <ImageBackground
                    source={{uri: this.state.selectedItem.preview_photo}}
                    style={{
                      width: null,
                      height: null,
                      flex: 1,
                      padding: 20,
                    }}>
                    {this.state.selectedItem.type == 'new' ? (
                      <View
                        style={{
                          ...styles.newBagde,
                        }}>
                        <Text style={{color: '#fff'}}>New</Text>
                      </View>
                    ) : this.state.selectedItem.type == 'popular' ? (
                      <View
                        style={{
                          ...styles.popularBadge,
                          marginTop: 0,
                          marginRight: 0,
                        }}>
                        <Text
                          style={{
                            alignSelf: 'center',
                            color: '#fff',
                            fontFamily: FONTS.fontFamily,
                            fontSize: 12,
                          }}>
                          Popular
                        </Text>
                      </View>
                    ) : null}
                  </ImageBackground> */}
                </View>

                <View style={{padding: 15}}>
                  {this.state.isWantSubscripe ? (
                    <>
                      <Animatable.View
                        animation="fadeIn"
                        style={{
                          alignItems: 'center',
                          marginVertical: 15,
                          justifyContent: 'center',
                        }}>
                        {/**           */}
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: FONTS.fontFamily,
                            color: '#000',
                          }}>
                          سيتم خصم{' '}
                          <Text
                            style={{
                              fontFamily: FONTS.fontFamily,
                              fontSize: 20,
                              color: '#f60941',
                            }}>
                            {this.state.selectedItem.chain_price} ج
                          </Text>{' '}
                          من رصيدك
                        </Text>
                        {/**           */}

                        {/**           */}

                        <Text
                          style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 20,
                            color: '#3ab54a',
                          }}>
                          للإشتراك{' '}
                          <Text
                            style={{
                              fontSize: 20,
                              color: '#000',
                            }}>
                            فى مسار
                          </Text>{' '}
                        </Text>
                        {/**           */}
                        {/**           */}

                        <Text
                          style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 20,
                            color: COLORS.primary,
                          }}>
                          ({this.state.selectedItem.chain_name})
                        </Text>
                        {/**           */}
                        {/**           */}

                        {/**           */}
                        {/**           */}

                        <Text
                          style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 20,
                            color: '#000',
                          }}>
                          رصيدك الحالى:{' '}
                          <Text
                            style={{
                              fontFamily: FONTS.fontFamily,
                              fontSize: 20,
                              color: '#f60941',
                            }}>
                            {this.state.studentMoney == null
                              ? 0
                              : this.state.studentMoney}
                          </Text>
                        </Text>

                        {/**           */}
                      </Animatable.View>
                      <Animatable.View
                        animation="lightSpeedIn"
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.payStreamVideos();
                          }}
                          style={{
                            ...styles.subscripeButton,
                          }}>
                          {this.state.payButtonLoading == true ? (
                            <ActivityIndicator
                              size={30}
                              style={{padding: 5}}
                              color={'#fff'}
                            />
                          ) : (
                            <Text
                              style={{
                                fontSize: 20,
                                color: '#fff',
                                fontFamily: FONTS.fontFamily,
                              }}>
                              الأشتراك
                            </Text>
                          )}
                        </TouchableOpacity>

                        {/**            */}
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              isWantSubscripe: false,
                            });
                          }}
                          style={{
                            ...styles.canselButton,
                          }}>
                          <Text
                            style={{
                              fontSize: 20,
                              fontFamily: FONTS.fontFamily,
                              color: '#fff',
                            }}>
                            الرجوع
                          </Text>
                        </TouchableOpacity>
                      </Animatable.View>
                    </>
                  ) : (
                    <Animatable.View animation="fadeIn">
                      <View>
                        <Text
                          style={{fontFamily: FONTS.fontFamily, fontSize: 20}}>
                          {this.state.selectedItem.chain_name}
                        </Text>
                        <Text style={{color: 'rgba(0,0,0,0.6)', fontSize: 18}}>
                          {this.state.selectedItem.description}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            isWantSubscripe: true,
                          });
                        }}
                        style={{
                          ...styles.subscripeButton,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 20,
                            color: '#fff',
                          }}>
                          الأشتراك
                        </Text>
                      </TouchableOpacity>
                    </Animatable.View>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
        {/* ---------------------  indevedual modal ---------------------*/}
        <Modal
          animationType="slide"
          visible={this.state.openInvidualModal}
          transparent={true}
          onRequestClose={() => {
            Orientation.lockToPortrait();

            this.setState({
              openInvidualModal: false,
            });
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 10,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                onPress={() => {
                  Orientation.lockToPortrait();

                  this.setState({
                    openInvidualModal: false,
                  });
                }}
                style={{
                  width: 50,
                  alignSelf: 'flex-end',
                  marginBottom: 10,
                }}>
                <Feather name="x" color="#fff" size={35} />
              </TouchableOpacity>

              <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{width: '100%', minHeight: 250}}>
                  <Video
                    url={this.state.selectedItem.preview_video_link}
                    rotateToFullScreen={true}
                    lockPortraitOnFsExit={true}
                    hideFull
                    scrollBounce={true}
                  />
                  <View>
                    {this.state.selectedItem.type == 'new' ? (
                      <View
                        style={{
                          ...styles.newBagde,
                        }}>
                        <Text style={{color: '#fff'}}>New</Text>
                      </View>
                    ) : this.state.selectedItem.type == 'popular' ? (
                      <View
                        style={{
                          ...styles.popularBadge,
                          marginTop: 0,
                          marginRight: 0,
                        }}>
                        <Text
                          style={{
                            alignSelf: 'center',
                            color: '#fff',
                            fontFamily: FONTS.fontFamily,
                            fontSize: 12,
                          }}>
                          Popular
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* <ImageBackground
                    source={{uri: this.state.selectedItem.preview_photo}}
                    style={{
                      width: null,
                      height: null,
                      flex: 1,
                      padding: 20,
                    }}>
                    {this.state.selectedItem.type == 'new' ? (
                      <View
                        style={{
                          ...styles.newBagde,
                        }}>
                        <Text style={{color: '#fff'}}>New</Text>
                      </View>
                    ) : this.state.selectedItem.type == 'popular' ? (
                      <View
                        style={{
                          ...styles.popularBadge,
                          marginTop: 0,
                          marginRight: 0,
                        }}>
                        <Text
                          style={{
                            alignSelf: 'center',
                            color: '#fff',
                            fontFamily: FONTS.fontFamily,
                            fontSize: 12,
                          }}>
                          Popular
                        </Text>
                      </View>
                    ) : null}
                  </ImageBackground> */}
                </View>

                <View style={{padding: 15}}>
                  {this.state.isWantSubscripe ? (
                    <>
                      <Animatable.View
                        animation="fadeIn"
                        style={{
                          alignItems: 'center',
                          marginVertical: 15,
                          justifyContent: 'center',
                        }}>
                        {/**           */}
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: FONTS.fontFamily,
                            color: '#000',
                          }}>
                          سيتم خصم{' '}
                          <Text
                            style={{
                              fontFamily: FONTS.fontFamily,
                              fontSize: 20,
                              color: '#f60941',
                            }}>
                            {this.state.selectedItem.video_price} ج
                          </Text>{' '}
                          من رصيدك
                        </Text>
                        {/**           */}

                        {/**           */}

                        <Text
                          style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 20,
                            color: '#3ab54a',
                          }}>
                          لشراء{' '}
                          <Text
                            style={{
                              fontSize: 20,
                              color: '#000',
                            }}>
                            فيديو
                          </Text>{' '}
                        </Text>
                        {/**           */}
                        {/**           */}

                        <Text
                          style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 20,
                            color: COLORS.primary,
                          }}>
                          ({this.state.selectedItem.video_title})
                        </Text>
                        {/**           */}
                        {/**           */}

                        <Text
                          style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 20,
                            color: '#f58f1a',
                          }}>
                          الصف الثالث الثانوى
                        </Text>
                        {/**           */}
                        {/**           */}

                        <Text
                          style={{
                            fontFamily: FONTS.fontFamily,
                            fontSize: 20,
                            color: '#000',
                          }}>
                          رصيدك الحالى:{' '}
                          <Text
                            style={{
                              fontFamily: FONTS.fontFamily,
                              fontSize: 20,
                              color: '#f60941',
                            }}>
                            {this.state.studentMoney == null
                              ? 0
                              : this.state.studentMoney}
                          </Text>
                        </Text>

                        {/**           */}
                      </Animatable.View>
                      <Animatable.View
                        animation="lightSpeedIn"
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.payInduvedualVideos();
                          }}
                          style={{
                            ...styles.subscripeButton,
                          }}>
                          {this.state.payButtonLoading == true ? (
                            <ActivityIndicator
                              size={30}
                              style={{padding: 5}}
                              color={'#fff'}
                            />
                          ) : (
                            <Text
                              style={{
                                fontSize: 20,
                                color: '#fff',
                                fontFamily: FONTS.fontFamily,
                              }}>
                              شراء
                            </Text>
                          )}
                        </TouchableOpacity>

                        {/**            */}
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              isWantSubscripe: false,
                            });
                          }}
                          style={{
                            ...styles.canselButton,
                          }}>
                          <Text
                            style={{
                              fontSize: 20,
                              fontFamily: FONTS.fontFamily,
                              color: '#fff',
                            }}>
                            الرجوع
                          </Text>
                        </TouchableOpacity>
                      </Animatable.View>
                    </>
                  ) : (
                    <Animatable.View animation="fadeIn">
                      <View>
                        <Text
                          style={{fontFamily: FONTS.fontFamily, fontSize: 20}}>
                          {this.state.selectedItem.video_title}
                        </Text>
                        <Text style={{color: 'rgba(0,0,0,0.6)', fontSize: 18}}>
                          {this.state.selectedItem.video_description}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => {
                          this.setState({
                            isWantSubscripe: true,
                          });
                        }}
                        style={{
                          ...styles.subscripeButton,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 20,
                            color: '#fff',
                          }}>
                          شراء
                        </Text>
                      </TouchableOpacity>
                    </Animatable.View>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>

        <Modal
          visible={this.state.submit}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            this.setState({
              submit: false,
            });
          }}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                width: '90%',
                margin: '5%',
                // height: 140,
                // alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f5fcff',
                borderRadius: 15,
                elevation: 10,
                padding: 60,
              }}>
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'red',
                  // margin: 10,
                  position: 'absolute',
                  top: -10,
                  right: -10,
                }}
                onPress={() => {
                  this.setState({
                    submit: false,
                    viewprice: false,
                  });
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}>
                  X
                </Text>
              </TouchableOpacity>

              {this.state.submitStatus == 1 ? (
                <View
                  style={{
                    // flex: 1,
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // width: '90%',
                    // margin: '5%',
                  }}>
                  <FontAwesome5
                    name="check-circle"
                    color="green"
                    size={40}
                    style={{opacity: 0.7, marginLeft: 10}}
                  />

                  <Text style={{fontSize: 20, fontFamily: FONTS.fontFamily}}>
                    قد تم الشراء بنجاح
                  </Text>
                </View>
              ) : this.state.submitStatus == 2 ? (
                <View
                  style={{
                    // flex: 1,
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // width: '90%',
                    // margin: '5%',
                  }}>
                  <FontAwesome5
                    name="times"
                    color="red"
                    size={40}
                    style={{opacity: 0.7, marginLeft: 10}}
                  />

                  <Text
                    // easing="linear"
                    style={{
                      fontSize: 20,
                      // fontWeight: '900',
                      fontFamily: FONTS.fontFamily,
                      textAlign: 'center',
                    }}>
                    لا يوجد رصيد كافي في حسابك الرجاء الشحن
                  </Text>
                </View>
              ) : this.state.submitStatus == 3 ? (
                <View
                  style={{
                    // flex: 1,
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // width: '90%',
                    // margin: '5%',
                  }}>
                  <FontAwesome5
                    name="times"
                    color="red"
                    size={40}
                    style={{opacity: 0.7, marginRight: 20}}
                  />
                  <Text
                    animation="shake"
                    style={{
                      fontSize: 20,
                      // fontWeight: '900',
                      textAlign: 'center',
                      fontFamily: FONTS.fontFamily,
                    }}>
                    عفواً هذا الكود خاطئ
                  </Text>
                </View>
              ) : this.state.submitStatus == 4 ? (
                <View
                  style={{
                    // flex: 1,
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // width: '90%',
                    // margin: '5%',
                  }}>
                  <FontAwesome5
                    name="times"
                    color="red"
                    size={40}
                    style={{opacity: 0.7, marginRight: 20}}
                  />
                  <Text
                    animation="shake"
                    style={{
                      fontSize: 20,
                      // fontWeight: '900',
                      textAlign: 'center',
                      fontFamily: FONTS.fontFamily,
                    }}>
                    لقد حدث خطأ ما في الشراء الرجاء المحاوله لاحقا
                  </Text>
                </View>
              ) : this.state.submitStatus == 5 ? (
                <View
                  style={{
                    // flex: 1,
                    flexDirection: 'row',
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // width: '90%',
                    // margin: '5%',
                  }}>
                  <FontAwesome5
                    name="times"
                    color="red"
                    size={40}
                    style={{opacity: 0.7, marginRight: 20}}
                  />
                  <Text
                    animation="shake"
                    style={{
                      fontSize: 20,
                      // fontWeight: '900',
                      textAlign: 'center',
                      fontFamily: FONTS.fontFamily,
                    }}>
                    لقد تم شراء هذا الفيديو من قبل
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </Modal>

        <Modal
          visible={this.state.alertBeforeWatchingSingleModal}
          onRequestClose={() => {
            this.setState({alertBeforeWatchingSingleModal: false});
          }}
          transparent={true}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                width: SIZES.width * 0.9,
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
              <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
                {this.state.single_video_details.view_count == '0' ? (
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      fontSize: 17,
                      textAlign: 'justify',
                    }}>
                    سوف يتم خصم مشاهده من العدد الاجمالى المتاح لمشاهده هذ
                    الفيديو وهو{' '}
                    {this.state.single_video_details.view_limit_count == '1' ? (
                      <Text style={{color: COLORS.primary}}>مره واحده</Text>
                    ) : this.state.single_video_details.view_limit_count ==
                      '2' ? (
                      <Text style={{color: COLORS.primary}}>مرتين</Text>
                    ) : (
                      <Text style={{color: COLORS.primary}}>
                        {this.state.single_video_details.view_limit_count +
                          ' مرات'}
                      </Text>
                    )}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      fontSize: 17,
                      textAlign: 'justify',
                      color: COLORS.primary,
                    }}>
                    لقد شاهدت هذا الفيديو{' '}
                    {this.state.single_video_details.view_count == '1'
                      ? 'مره واحده فقط'
                      : this.state.single_video_details.view_count == '2'
                      ? 'مرتين'
                      : this.state.single_video_details.view_count +
                        ' مرات'}{' '}
                    من {this.state.single_video_details.view_limit_count} فى حال
                    المتابعه سوف يتم خصم مشاهده
                  </Text>
                )}
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
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 7,
                }}>
                {this.state.checkInsertSingelViewFun ? (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      borderRightColor: '#ddd',
                    }}>
                    <Spinner color={COLORS.primary} style={{height: 10}} />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      borderRightColor: '#ddd',
                    }}
                    onPress={() => {
                      this.insert_one_view_singel();
                    }}>
                    <Text
                      style={{
                        fontFamily: FONTS.fontFamily,
                        color: COLORS.primary,
                        fontSize: 20,
                      }}>
                      متابعه
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderLeftWidth: 1,
                    borderLeftColor: '#ddd',
                  }}
                  disabled={this.state.checkInsertSingelViewFun}
                  onPress={() => {
                    this.setState({alertBeforeWatchingSingleModal: false});
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
          visible={this.state.alertBeforeWatchingChainModal}
          onRequestClose={() => {
            this.setState({alertBeforeWatchingChainModal: false});
          }}
          transparent={true}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: SIZES.width * 0.9,
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
              <View style={{paddingHorizontal: 20}}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    color: COLORS.primary,
                    fontSize: 17,
                    textAlign: 'justify',
                  }}>
                  سوف يتم خصم مشاهده من كل فيديو يتم مشاهدته فى هذه السلسله
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
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 7,
                }}>
                {this.state.checkInsertSingelViewFun ? (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      borderRightColor: '#ddd',
                    }}>
                    <Spinner color={COLORS.primary} style={{height: 10}} />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRightWidth: 1,
                      borderRightColor: '#ddd',
                    }}
                    onPress={() => {
                      // alert(JSON.stringify(this.state.chainDetails.videos))
                      this.props.navigation.navigate('WatchStreamVideo', {
                        chain_id: this.state.chainDetails.chain_id,
                      });

                      this.setState({
                        alertBeforeWatchingChainModal: false,
                        open_search_modal: false,
                        searchField: '',
                      });
                    }}>
                    <Text
                      style={{
                        fontFamily: FONTS.fontFamily,
                        color: COLORS.primary,
                        fontSize: 20,
                      }}>
                      متابعه
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderLeftWidth: 1,
                    borderLeftColor: '#ddd',
                  }}
                  disabled={this.state.checkInsertSingelViewFun}
                  onPress={() => {
                    this.setState({alertBeforeWatchingChainModal: false});
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
          visible={this.state.open_search_modal}
          onRequestClose={() => {
            this.setState({
              open_search_modal: false,
              searchField: '',
            });
          }}>
          <View style={{flex: 1}}>
            <View
              style={{flexDirection: 'row', backgroundColor: COLORS.primary}}>
              <View
                style={{
                  width: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      open_search_modal: false,
                      searchField: '',
                    });
                  }}>
                  <Feather name="arrow-right" color="#fff" size={25} />
                </TouchableOpacity>
              </View>
              <Animatable.View
                animation="fadeInLeftBig"
                style={{
                  flex: 1,
                  paddingHorizontal: 20,
                  height: 60,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  placeholder="بحث"
                  style={{
                    color: '#ddd',
                    borderRadius: 50,
                    padding: 10,
                    backgroundColor: COLORS.secondary,
                    width: '100%',
                    height: '60%',
                    textAlign: 'right',
                  }}
                  value={this.state.searchField}
                  onChangeText={(text) => {
                    this.setState({
                      searchField: text,
                    });
                    if (this.state.search_type == 'stream') {
                      this.search_lesson_onStreams(text);
                    } else {
                      this.search_lesson_onIndividual(text);
                    }
                  }}
                />
              </Animatable.View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {this.state.search_type == 'stream' ? (
                <>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.streamsOfMonthFilterArray}
                    // keyExtractor={(item) =>  item.unique}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => {
                      return (
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff',
                            width: SIZES.width,
                            height: 70,
                          }}>
                          <Text
                            style={{
                              fontFamily: FONTS.fontFamily,
                              fontSize: 20,
                            }}>
                            لا توجد فيديوهات متاحه
                          </Text>
                        </View>
                      );
                    }}
                    renderItem={({item, index}) => {
                      if (item.chain_name == '') {
                        return;
                      }
                      return (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => {
                            if (item.type == 'subscribed') {
                              this.props.navigation.navigate(
                                'WatchStreamVideo',
                                {
                                  chain_id: item.chain_id,
                                },
                              );

                              this.setState({
                                alertBeforeWatchingChainModal: false,
                                open_search_modal: false,
                                searchField: '',
                              });
                              // this.setState({
                              //   alertBeforeWatchingChainModal: true,
                              //   chainDetails: item,
                              // });
                            } else {
                              this.setState({
                                openStreamsModal: true,
                                selectedItem: item,
                              });
                            }
                          }}
                          style={{
                            ...styles.searchDataFilterContainer,
                          }}>
                          <ImageBackground
                            source={{uri: item.preview_photo}}
                            style={{
                              height: 200,
                              width: '100%',
                              alignItems: 'flex-end',
                            }}
                            resizeMode="cover">
                            <LinearGradient
                              start={{x: 0.0, y: 0}}
                              end={{x: 0.1, y: 1.0}}
                              locations={[0, 0.5, 0.8]}
                              useAngle={true}
                              angle={90}
                              angleCenter={{x: 0.5, y: 0.5}}
                              colors={[
                                '#fff',
                                'rgba(255,255,255,0.9)',
                                'rgba(255,255,255,0.01)',
                              ]}
                              style={{...styles.LinearGradientStyle}}>
                              {item.type == 'new' ? (
                                <View
                                  style={{
                                    ...styles.newBagde,
                                  }}>
                                  <Text style={{color: '#fff'}}>New</Text>
                                </View>
                              ) : item.type == 'popular' ? (
                                <View
                                  style={{
                                    ...styles.popularBadge,
                                    marginTop: 0,
                                    marginRight: 0,
                                  }}>
                                  <Text
                                    style={{
                                      alignSelf: 'center',
                                      color: '#fff',
                                      fontFamily: FONTS.fontFamily,
                                      fontSize: 12,
                                    }}>
                                    Popular
                                  </Text>
                                </View>
                              ) : item.type == 'subscribed' ? (
                                <View
                                  style={{
                                    ...styles.popularBadge,
                                    marginTop: 0,
                                    marginRight: 0,
                                  }}>
                                  <Text
                                    style={{
                                      alignSelf: 'center',
                                      color: '#fff',
                                      fontFamily: FONTS.fontFamily,
                                      fontSize: 10,
                                    }}>
                                    Subscribed
                                  </Text>
                                </View>
                              ) : null}

                              <View
                                style={{
                                  marginVertical: 20,
                                }}>
                                <Text
                                  numberOfLines={2}
                                  style={{
                                    fontSize: 17,
                                    textAlign: 'right',
                                    fontFamily: FONTS.fontFamily,
                                  }}>
                                  {item.chain_name}
                                </Text>
                                <Text
                                  numberOfLines={2}
                                  style={{
                                    fontSize: 15,
                                    textAlign: 'right',
                                    fontFamily: FONTS.fontFamily,
                                  }}>
                                  {item.description}
                                </Text>
                              </View>
                              <View
                                style={{
                                  position: 'absolute',
                                  bottom: 4,
                                  right: 15,
                                }}>
                                <Text style={{color: 'rgba(0,0,0,0.7)'}}>
                                  {item.chain_date}
                                </Text>
                              </View>
                            </LinearGradient>
                          </ImageBackground>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </>
              ) : (
                <>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.individualVideosFilterArray}
                    // keyExtractor={(item) =>  item.unique}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={() => {
                      return (
                        <View
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#fff',
                            width: SIZES.width,
                            height: 70,
                          }}>
                          <Text
                            style={{
                              fontFamily: FONTS.fontFamily,
                              fontSize: 20,
                            }}>
                            لا توجد فيديوهات متاحه
                          </Text>
                        </View>
                      );
                    }}
                    renderItem={({item, index}) => {
                      if (item.video_title == '') {
                        return;
                      }
                      return (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          onPress={() => {
                            if (item.type == 'subscribed') {
                              this.setState({
                                single_video_details: item,
                                selected_individual_video_index: index,
                              });
                              if (
                                parseInt(item.view_count) <
                                parseInt(item.view_limit_count)
                              ) {
                                this.setState({
                                  alertBeforeWatchingSingleModal: true,
                                });
                              } else {
                                ToastAndroid.showWithGravityAndOffset(
                                  'لقد انهيت عدد المشاهدات المتاحه لك لهذا الفيديو',
                                  ToastAndroid.LONG,
                                  ToastAndroid.CENTER,
                                  25,
                                  50,
                                );
                              }
                            } else {
                              this.setState({
                                openInvidualModal: true,
                                selectedItem: item,
                              });
                            }
                          }}
                          style={{
                            ...styles.searchDataFilterContainer,
                          }}>
                          <ImageBackground
                            source={{uri: item.video_image_link}}
                            style={{
                              height: 200,
                              width: '100%',
                              alignItems: 'flex-end',
                            }}
                            resizeMode="cover">
                            <LinearGradient
                              start={{x: 0.0, y: 0}}
                              end={{x: 0.1, y: 1.0}}
                              locations={[0, 0.5, 0.8]}
                              useAngle={true}
                              angle={90}
                              angleCenter={{x: 0.5, y: 0.5}}
                              colors={[
                                '#fff',
                                'rgba(255,255,255,0.9)',
                                'rgba(255,255,255,0.01)',
                              ]}
                              style={{...styles.LinearGradientStyle}}>
                              {item.type == 'new' ? (
                                <View
                                  style={{
                                    ...styles.newBagde,
                                  }}>
                                  <Text style={{color: '#fff'}}>New</Text>
                                </View>
                              ) : item.type == 'popular' ? (
                                <View
                                  style={{
                                    ...styles.popularBadge,
                                    marginTop: 0,
                                    marginRight: 0,
                                  }}>
                                  <Text
                                    style={{
                                      alignSelf: 'center',
                                      color: '#fff',
                                      fontFamily: FONTS.fontFamily,
                                      fontSize: 12,
                                    }}>
                                    Popular
                                  </Text>
                                </View>
                              ) : item.type == 'subscribed' ? (
                                <View
                                  style={{
                                    ...styles.popularBadge,
                                    marginTop: 0,
                                    marginRight: 0,
                                  }}>
                                  <Text
                                    style={{
                                      alignSelf: 'center',
                                      color: '#fff',
                                      fontFamily: FONTS.fontFamily,
                                      fontSize: 10,
                                    }}>
                                    Subscribed
                                  </Text>
                                </View>
                              ) : null}

                              <View
                                style={{
                                  marginVertical: 20,
                                }}>
                                <Text
                                  numberOfLines={2}
                                  style={{
                                    fontSize: 17,
                                    textAlign: 'right',
                                    fontFamily: FONTS.fontFamily,
                                  }}>
                                  {item.video_title}
                                </Text>
                                <Text
                                  numberOfLines={2}
                                  style={{
                                    fontSize: 15,
                                    textAlign: 'right',
                                    fontFamily: FONTS.fontFamily,
                                  }}>
                                  {item.video_description}
                                </Text>
                              </View>
                              <View
                                style={{
                                  position: 'absolute',
                                  bottom: 4,
                                  right: 15,
                                }}>
                                <Text style={{color: 'rgba(0,0,0,0.7)'}}>
                                  {item.video_date}
                                </Text>
                              </View>
                            </LinearGradient>
                          </ImageBackground>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </>
              )}
            </ScrollView>
          </View>
        </Modal>
        <Modal
          visible={this.state.visableEndSub}
          onRequestClose={() => {
            this.setState({
              visableEndSub: false,
            });
          }}
          transparent={true}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}>
            <View
              style={{
                padding: 20,
                backgroundColor: '#fff',
                elevation: 4,
                borderRadius: 15,
                width: '100%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    visableEndSub: false,
                  });
                }}
                style={{
                  position: 'absolute',
                  top: -10,
                  left: 2,
                  backgroundColor: 'red',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 35,
                  height: 35,
                  borderRadius: 25,
                }}>
                <Text style={{color: '#fff'}}>X</Text>
              </TouchableOpacity>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  تاريخ انتهاء اشتراك مادة {this.state.subject_name}
                </Text>
              </View>

              <View
                style={{
                  borderWidth: 1.5,
                  borderColor: '#eee',
                  marginVertical: 10,
                }}
              />

              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                {this.state.connection_Status == 'Online' ? (
                  this.state.loading ? (
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <ActivityIndicator color={COLORS.primary} size={22} />
                    </View>
                  ) : (
                    <View
                      style={{alignItems: 'center', justifyContent: 'center'}}>
                      <Text
                        style={{fontSize: 16, fontFamily: FONTS.fontFamily}}>
                        الرجاء الانتباه بأنة سوف يتم انتهاء الاشتراك للمادة فى
                        تاريخ :
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: FONTS.fontFamily,
                          textAlign: 'center',
                        }}>
                        {this.state.end_sub}
                      </Text>
                    </View>
                  )
                ) : (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{fontFamily: FONTS.fontFamily}}>
                      الرحاء التأكد من اتصال النترنت
                    </Text>
                    <Image
                      source={images.empty}
                      // style={{height: 100, width: 100}}
                      // resizeMode="contain"
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  image_badge: {
    width: 20,
    height: 20,
    backgroundColor: '#089f50',
    borderRadius: 20,
    position: 'absolute',
    top: 25,
    left: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item_of_month_stream: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderRadius: 15,
    flexDirection: 'row',
    elevation: 1,
    overflow: 'hidden',
  },
  underHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  LinearGradientStyle: {
    width: '75%',
    height: '100%',
    padding: 15,
  },
  newBagde: {
    padding: 3,
    backgroundColor: '#4a812e',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  popularBadge: {
    padding: 7,
    backgroundColor: COLORS.primary,
    // width: 70,
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 10,
  },
  lessonDuration: {
    padding: 7,
    backgroundColor: 'rgba(0,0,0,0.7)',
    // width: 70,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginRight: 10,
    position: 'absolute',
    bottom: 0,
  },
  leftHeader: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 70 / 2,
    backgroundColor: '#000',
  },
  subscripeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3ab54a',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: 'center',
  },
  canselButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f60941',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignSelf: 'center',
  },
  searchDataFilterContainer: {
    width: '100%',
    alignSelf: 'center',
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
