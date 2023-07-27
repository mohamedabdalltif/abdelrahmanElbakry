import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  Animated,
  BackHandler,
  ImageBackground,
  LayoutAnimation,
  UIManager,
  ToastAndroid,
  PermissionsAndroid,
  Modal,
  Alert,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {AppRequired, COLORS, FONTS, images, SIZES} from '../../constants';
import {Container, Spinner} from 'native-base';
import {WebView} from 'react-native-webview';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Orientation from 'react-native-orientation';
import Video from 'react-native-af-video-player-updated';
import RNFetchBlob from 'rn-fetch-blob';
import {Easing, Transition, Transitioning} from 'react-native-reanimated';
import axios from 'axios';

export default class WatchStreamVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chain_id: '',
      videoDetails: this.props.navigation.getParam('vedio_details'),

      video_folder: '',
      titlePlayingVideo: '',
      bottomConnectionMsg: new Animated.Value(-100),
      view_count: '',
      view_limit_count: '',
      playingVideo: null,
      playingVideoId: 0,
      playingIndex: 0,
      LogoutModal: false,
      loading: true,
      downloaded: false,
      downloading_file: false,
      send_message: '',
      connection_Status: 'Online',
      can_ask: false,
      lessonChat: [],
      waitingModalVisable: false,
      LogoutModal: false,
      checkInsertViewFun: false,
      unableWatchModal: false,
      view_count: '',
      view_limit_count: '',
      WrongModalReason: '',
      wrongModal: false,
      moveingIdLeft: 0,
      moveingIdUp: 0,
      selectedTab: 1,
      student_id: '',
      add_point: false,
      //  for moving to exam
      AlertBeforeExam: false,
      answered: false,
      videoUrl: '',
      isRefresh: false,
      finishLoad: false,
      finishLoadingWebview: false,

      connection_Status: true,

      mode: new Animated.Value(0),
    };
    UIManager.setLayoutAnimationEnabledExperimental(true);

    this.ref = React.createRef();
  }

  componentWillUnmount() {
    this.backHandler.remove();
    Orientation.lockToPortrait();
  }
  backAction = () => {
    this.setState({LogoutModal: true});
    return true;
  };

  async componentDidMount() {
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    let videoData = this.props.navigation.getParam('vedio_details');
    this.setState({
      student_id: data.student_id,
      answered: videoData.answered,
    });

    console.log(
      JSON.stringify(this.props.navigation.getParam('vedio_details')),
    );

    if (
      this.props.navigation.getParam('vedio_details').which_player ==
        'player_1' &&
      this.props.navigation
        .getParam('vedio_details')
        .video_link.includes('update_app.mp4')
    ) {
      this.get_url();
    }

    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        if (this.state.finishLoad) {
          this.setState({
            finishLoadingWebview: true,
            isRefresh: true,
          });
        }
      }

      if (state.isConnected == true) {
        this.setState({
          connection_Status: 'Online',
        });
        this.getSteamQuestions();

        Animated.spring(this.state.bottomConnectionMsg, {
          toValue: -100,
        }).start();
      } else {
        this.setState({
          connection_Status: 'Offline',
        });
        Animated.spring(this.state.bottomConnectionMsg, {toValue: 2}).start();
      }
    });
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
    this.ref.current.animateNextTransition();
    setInterval(() => {
      if (SIZES.width > SIZES.height) {
        let translateY = Math.floor(
          Math.random() * (SIZES.height - 40 - 0 + 1) + 0,
        );

        let translatex = Math.floor(
          Math.random() * (SIZES.width - 160 - 0 + 1) + 0,
        );
        this.setState({
          moveingIdUp: translatex,
          moveingIdLeft: translateY,
        });
      } else {
        let translateY = Math.floor(
          Math.random() * (SIZES.height - 40 - 0 + 1) + 0,
        );

        let translatex = Math.floor(
          Math.random() * (SIZES.width - 160 - 0 + 1) + 0,
        );
        this.setState({
          moveingIdUp: translateY,
          moveingIdLeft: translatex,
        });
      }
    }, 7000);
  }

  get_url() {
    const VIMEO_ID = this.state.videoDetails.video_player_id;
    fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config`)
      .then((res) => res.json())
      .then((res) =>
        this.setState({
          videoUrl:
            res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
        }),
      );
  }
  insert_finished_video = async () => {
    if (this.state.add_point == false) {
      this.setState({waitingModalVisable: true});
      let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));
      let data_to_send = {
        video_id: this.state.videoDetails.video_id,
        student_id: StudentData.student_id,
      };
      axios
        .post(AppRequired.Domain + 'insert_finished_video.php', data_to_send)
        .then((res) => {
          if (res.status == 200) {
            if (res.data == 'success') {
              ToastAndroid.showWithGravity(
                'قد تم إضافه نقاط فى حسابك',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
              this.setState({waitingModalVisable: false, add_point: true});
            } else {
              this.setState({waitingModalVisable: false});

              ToastAndroid.showWithGravity(
                'عذرا حدث خطأ ما',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
            }
          } else {
            this.setState({waitingModalVisable: false});

            ToastAndroid.showWithGravity(
              'عذرا حدث خطأ ما',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          }
        });
    } else {
    }
  };

  _download = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ToastAndroid.showWithGravity(
          '1 item will be downloaded. see notification for details',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        this.setState({
          downloading_file: true,
        });
        var file_url = this.state.videoDetails.video_folder;
        const {
          dirs: {DownloadDir, DocumentDir},
        } = RNFetchBlob.fs;
        const {config} = RNFetchBlob;
        const isIos = Platform.OS === 'ios';
        const aPath = Platform.select({ios: DocumentDir, android: DownloadDir});
        var ext = 'pdf';
        var file_ex = 'Attachment.pdf';
        const fPath = `${aPath}/${file_ex}`;
        const configOption = Platform.select({
          ios: {
            fileCache: true,
            path: fPath,
            appendExt: ext,
          },
          android: {
            fileCache: false,
            appendExt: ext,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              path: aPath + '/' + file_ex,
              description: 'Attachment',
            },
          },
        });
        if (isIos) {
          this.setState({loading: true, progress: 0});
          RNFetchBlob.config(configOption)
            .fetch('GET', file_url)
            .then((res) => {
              console.log('file', res);
              this.setState({
                loading: false,
              });
              RNFetchBlob.ios.previewDocument('file://' + res.path());
            });
          this.setState({
            downloading_file: false,
          });
          return;
        } else {
          config(configOption)
            .fetch('GET', file_url)
            .progress((received, total) => {
              this.setState({
                progress: received / total,
              });
            })
            .then((res) => {
              // Linking.openURL(res.path());
              // alert(JSON.stringify(res.data()));
              // FileViewer.open(res.path(), {showOpenWithDialog: true});
              RNFetchBlob.android.actionViewIntent('file://' + res.path());
              this.setState({
                downloading_file: false,
                downloaded: true,
              });
            })
            .catch((errorMessage, statusCode) => {
              this.setState({
                loading: false,
              });
              console.log('error with downloading file ', errorMessage);
            });
        }
      } else {
        console.log('Permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  sendMyMessage = async () => {
    let AllData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let data_to_send = {
      question_text: this.state.send_message,
      student_id: AllData.student_id,
      video_id: this.state.videoDetails.video_id,
    };

    axios
      .post(AppRequired.Domain + 'insert_video_question.php', data_to_send)
      .then(async (res) => {
        if (res.status == 200) {
          if (res.data) {
            let today = new Date().toISOString().slice(0, 10);
            let time = new Date();
            let current_time =
              time.getHours() +
              ':' +
              time.getMinutes() +
              ':' +
              time.getSeconds();

            let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
            let newLessonChat = this.state.lessonChat;
            let myQuestion = {
              question_id: res.data,
              question_text: this.state.send_message,
              question_date: today + ' ' + current_time,
              question_student_id: studentData.student_id,
              question_video_id: this.state.videoDetails.video_id,
              student_name: studentData.student_name,
            };
            newLessonChat.unshift(myQuestion);

            this.setState({
              lessonChat: newLessonChat,
              send_message: '',
              can_ask: false,
            });
          } else if (res.data == 'asked') {
            ToastAndroid.showWithGravityAndOffset(
              'سؤالك قد سُؤل من قبل',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'error') {
            ToastAndroid.showWithGravityAndOffset(
              'عذرا الرجاء المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
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
  };

  getSteamQuestions = async () => {
    let AllData = JSON.parse(await AsyncStorage.getItem('AllData'));
    // alert(new Date().toISOString().slice(0, 10));
    let data_to_send = {
      student_id: AllData.student_id,
      video_id: this.state.videoDetails.video_id,
    };
    axios
      .post(AppRequired.Domain + 'select_video_questions.php', data_to_send)
      .then((res) => {
        // alert(JSON.stringify(res.data));
        if (res.status == 200) {
          if (Object.keys(res.data).length == 2) {
            this.setState({
              can_ask: res.data.can_ask,
              lessonChat: res.data.questions,
              loading: false,
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
  };
  makeRequestToSaveDefaultScore = async (
    quizID,
    quizName,
    failedVideo,
    passVideo,
    goodVideo,
    veryGoodVideo,
    excellentVideo,
    navigationPage,
    timer,
  ) => {
    this.setState({AlertBeforeExam: false});
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));
    this.setState({
      loading: true,
    });
    // if (this.state.connection_Status == 'Online') {
    let data_to_send = {
      quizId: quizID,
      student_id: data.student_id,
      score: 0,
    };
    // console.log(data_to_send);
    axios
      .post(AppRequired.Domain + 'add_first_score_exam_quiz.php', data_to_send)
      .then((response) => {
        this.setState({
          loading: false,
        });
        if (response.data.trim() == 'success') {
          this.setState({
            confirmModalVisible: false,
            // disableModal: false,
            loadingModal: false,
          });
          if (timer != '' || timer != undefined || timer != null) {
            this.props.navigation.navigate(navigationPage, {
              quiz_id: quizID,
              quiz_name: quizName,
              failed_video: failedVideo,
              pass_video: passVideo,
              good_video: goodVideo,
              very_good_video: veryGoodVideo,
              excellent_video: excellentVideo,
              timer: timer,
              refrish: this.componentDidMount,
            });
          } else {
            this.props.navigation.navigate(navigationPage, {
              quiz_id: quizID,
              quiz_name: quizName,
              failed_video: failedVideo,
              pass_video: passVideo,
              good_video: goodVideo,
              very_good_video: veryGoodVideo,
              excellent_video: excellentVideo,
              refrish: this.componentDidMount,
            });
          }
        } else {
          this.setState({
            confirmModalVisible: false,
            // disableModal: false,
            loadingModal: false,
          });
          Alert.alert(
            AppRequired.appName + '',
            'حدث خطأ ما. الرجاء المحاوله لاحقا',
          );
        }
      })
      .catch((error) => {
        Alert.alert(
          AppRequired.appName + '',
          'حدث خطأ ما. الرجاء المحاوله لاحقا',
        );
      });
  };

  // changeVideo = (item, index) => {
  //   LayoutAnimation.configureNext(
  //     LayoutAnimation.create(
  //       500,
  //       LayoutAnimation.Types.easeOut,
  //       LayoutAnimation.Properties.scaleXY,
  //     ),
  //   );

  //   this.setState({
  //     playingVideo: item.video_link,
  //     playingVideoId: item.video_id,
  //     titlePlayingVideo: item.video_title,
  //     descriptionPlayingVideo: item.video_description,
  //     playingIndex: index,
  //     video_folder: item.video_folder,
  //     downloaded: item.downloaded,
  //   });
  //   this.insert_one_view();
  // };
  selectTab = (tabIndex) => {
    this.ref.current.animateNextTransition();

    this.setState({
      selectedTab: tabIndex,
    });
  };
  transition = (
    <Transition.Together>
      <Transition.In type="fade" durationMs={900} interpolation="easeInOut" />
      <Transition.In type="fade" durationMs={900} />
      <Transition.Change />
    </Transition.Together>
  );

  lessonOption = () => {
    return (
      <View>
        <View
          style={{
            padding: 15,
          }}>
          <Text
            style={{
              fontSize: 22,
              fontFamily: FONTS.fontFamily,
            }}>
            {this.state.videoDetails.video_title}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 10,
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            disabled={this.state.downloading_file}
            onPress={() => {
              if (
                this.state.videoDetails.video_folder == '' ||
                this.state.videoDetails.video_folder == null ||
                this.state.videoDetails.video_folder == undefined
              ) {
                ToastAndroid.showWithGravityAndOffset(
                  'لايوجد مسار للتحميل',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                  25,
                  50,
                );
              } else {
                this._download();
              }
            }}
            style={{
              ...styles.downloadButton,
              minWidth: '40%',
              justifyContent: 'space-around',
            }}>
            {this.state.downloaded == false ||
            this.state.downloaded == undefined ? (
              <>
                <Text
                  style={{
                    color: '#fff',
                    marginRight: 4,
                    // marginLeft: 10,
                    fontSize: 11,
                    fontFamily: FONTS.fontFamily,
                  }}>
                  تحميل ملفات الحصه
                </Text>
                {this.state.downloading_file ? (
                  <Spinner
                    color="#fff"
                    size={15}
                    style={{height: 7, width: 7, marginLeft: 7}}
                  />
                ) : (
                  <Feather name="download" color="#fff" size={15} />
                )}
              </>
            ) : (
              <Text
                style={{
                  color: '#fff',
                  // marginRight: 4,
                  alignSelf: 'center',
                  fontSize: 11,
                  fontFamily: FONTS.fontFamily,
                }}>
                تم التحميل
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.loading}
            onPress={() => {
              if (this.state.videoDetails.exam_type == '') {
                ToastAndroid.showWithGravityAndOffset(
                  'لا يوجد اختبار',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                  25,
                  50,
                );
              } else {
                if (this.state.answered == false) {
                  ToastAndroid.showWithGravityAndOffset(
                    'الاختبار غير متاح',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER,
                    25,
                    50,
                  );
                } else {
                  this.setState({
                    AlertBeforeExam: true,
                  });
                }
              }
            }}
            style={{
              ...styles.testYourselfButton,
              minWidth: '40%',
            }}>
            <Text
              style={{
                color: '#fff',
                marginRight: 4,
                fontSize: 11,
                fontFamily: FONTS.fontFamily,
              }}>
              إختبر نفسك
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
      <Container
        style={{
          paddingBottom: this.state.selectedTab == 0 ? 70 : 0,
          backgroundColor: '#eee',
        }}>
        <StatusBar hidden />
        {/* <NavigationEvents onDidFocus={() => this.CustomcomponentDidMount()} /> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              width: '100%',
              minHeight: 200,
            }}>
            {!this.state.videoDetails.video_link.includes('update_app.mp4') ? (
              <Video
                url={this.state.videoDetails.video_link}
                title={this.state.student_id}
                onEnd={() => {
                  this.insert_finished_video();
                }}
                rotateToFullScreen={true}
                lockPortraitOnFsExit={true}
                hideFull
                scrollBounce={true}
              />
            ) : this.state.videoDetails.which_player == 'player_1' ? (
              <Video
                url={this.state.videoUrl}
                title={this.state.student_id}
                onEnd={() => {
                  this.insert_finished_video();
                }}
                rotateToFullScreen={true}
                lockPortraitOnFsExit={true}
                hideFull
                scrollBounce={true}
              />
            ) : (
              <>
                <WebView
                  style={{alignSelf: 'stretch'}}
                  allowsFullscreenVideo={true}
                  scalesPageToFit={true}
                  bounces={false}
                  javaScriptEnabled
                  onLoad={() => {
                    this.setState({
                      finishLoad: true,
                    });
                    if (this.state.connection_Status == 'Online') {
                      this.setState({
                        finishLoadingWebview: true,
                      });
                    } else {
                      ToastAndroid.showWithGravityAndOffset(
                        'الرجاء التأكد من اتصال الانترنت',
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50,
                      );
                    }
                  }}
                  source={{
                    html: `
            <!DOCTYPE html>
            <html>
              <head></head>
              <body>
                  <div style="width:100%;height:100%">
                  <iframe id='my_iFrame' src="https://player.vimeo.com/video/${
                    this.state.videoDetails.video_player_id
                  }" frameborder="0"
                  allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%"
                  title="forme_validation.mp4"></iframe></div><script src="https://player.vimeo.com/api/player.js">

                  if(${!this.state.isRefresh}){
                    var f = document.getElementById('my_iFrame');
                    f.src = f.src;
                  }
                 </script>
              </body>
            </html>
      `,
                  }}
                  automaticallyAdjustContentInsets={false}
                />

                {!this.state.finishLoadingWebview ? (
                  <View
                    style={{
                      flex: 1,
                      position: 'absolute',
                      width: '100%',
                      height: 300,
                      backgroundColor: '#fff',
                      top: 0,
                      // bottom: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ActivityIndicator size={50} color="#000" />
                  </View>
                ) : null}
              </>
            )}
          </View>
          <View style={{backgroundColor: '#fff'}}>
            <View
              style={{
                width: '100%',
                borderWidth: 0.5,
                borderColor: '#ddd',
              }}
            />
            {this.lessonOption()}
          </View>
          {/* custom navigation tab */}
          <Transitioning.View
            ref={this.ref}
            transition={this.transition}
            style={{
              flex: 1,
              backgroundColor: '#fff',
            }}>
            <View
              style={{
                ...styles.tabContainer,
                alignSelf: 'center',
                width: SIZES.width,
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.selectTab(0);
                }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 20,
                      color:
                        this.state.selectedTab == 0
                          ? COLORS.third
                          : 'lightgray',
                    }}>
                    إسال المستر
                  </Text>
                  <View
                    style={{
                      ...styles.askingBadge,
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: COLORS.third,
                        fontFamily: FONTS.fontFamily,
                        fontSize: 12,
                      }}>
                      {this.state.lessonChat.length}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                }}
                onPress={() => {
                  this.selectTab(1);
                }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      fontSize: 20,
                      color:
                        this.state.selectedTab == 1
                          ? COLORS.third
                          : 'lightgray',
                    }}>
                    الفيديو
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  position: 'absolute',
                  height: 5,
                  width: (SIZES.width - 30) / 2,
                  backgroundColor: COLORS.third,
                  bottom: 0,
                  left: this.state.selectedTab == 0 ? 0 : null,
                  right: this.state.selectedTab == 1 ? 0 : null,
                }}
              />
            </View>
            {this.state.loading == true ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: SIZES.height * 0.4,
                  width: '100%',
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
            ) : (
              <>
                {this.state.selectedTab == 1 ? (
                  <>
                    <View
                      style={{
                        width: '90%',
                        minHeight: 120,
                        margin: '5%',
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          // this.changeVideo(item, index);
                        }}>
                        <ImageBackground
                          imageStyle={{resizeMode: 'cover'}}
                          source={{
                            uri: this.state.videoDetails.video_image_link,
                          }}
                          style={{flex: 1, width: null, height: null}}>
                          <View
                            style={{
                              flex: 1,
                              backgroundColor: '#000',
                              opacity: 0.7,
                            }}>
                            <View style={{margin: 10}}>
                              <View
                                style={{
                                  marginBottom: 10,
                                  justifyContent: 'space-between',
                                  flexDirection: 'row',
                                }}>
                                <View
                                  style={{
                                    width: '80%',
                                    // backgroundColor: 'red',
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    numberOfLines={2}
                                    style={{
                                      opacity: 1,
                                      color: 'white',
                                      fontSize: 20,
                                      fontFamily: FONTS.fontFamily,
                                    }}>
                                    {this.state.videoDetails.video_title}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    width: 30,
                                    height: 30,
                                    backgroundColor: FONTS.fontFamily,
                                    borderRadius: 50,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <FontAwesome name="play" color="white" />
                                </View>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontSize: 15,
                                    fontFamily: FONTS.fontFamily,
                                  }}
                                  numberOfLines={2}>
                                  {this.state.videoDetails.video_description}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </ImageBackground>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <FlatList
                      keyExtractor={(item) => item.question_id}
                      data={this.state.lessonChat}
                      showsVerticalScrollIndicator={false}
                      style={{
                        flex: 1,
                        backgroundColor: '#eee',
                      }}
                      renderItem={({item, index}) => {
                        return (
                          <View
                            style={{
                              ...styles.chatMessage,
                            }}>
                            <TouchableOpacity
                              activeOpacity={0.8}
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                paddingVertical: 7,
                              }}>
                              <TouchableOpacity
                                onPress={() => {
                                  // alert('profile page');
                                }}
                                style={{
                                  width: 50,
                                  // flex: 0.5,
                                  // alignItems: 'center',
                                  // justifyContent: 'center',
                                  // flex: 0.2,
                                }}>
                                {/* <Entypo name="dots-three-vertical" size={25} /> */}
                              </TouchableOpacity>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  flex: 1,
                                  alignItems: 'center',
                                  padding: 7,
                                  justifyContent: 'flex-end',
                                  // flexWrap: 'wrap',
                                }}>
                                <View
                                  style={{marginRight: '4%', width: '100%'}}>
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      textAlign: 'right',
                                      // fontFamily: FONTS.fontFamily,
                                    }}>
                                    {item.student_name}
                                  </Text>
                                  <Text
                                    style={{
                                      // fontFamily: FONTS.fontFamily,
                                      color: COLORS.third,
                                    }}>
                                    student
                                  </Text>
                                  <Text
                                    style={{
                                      // fontFamily: FONTS.fontFamily,
                                      color: COLORS.third,
                                    }}>
                                    {item.question_date}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    // alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <Image
                                    source={images.avatar_5}
                                    style={{
                                      height: 50,
                                      width: 50,
                                      borderRadius: 50 / 2,
                                    }}
                                    resizeMode="cover"
                                  />
                                </View>
                              </View>
                            </TouchableOpacity>
                            <View>
                              <Text
                                style={{
                                  fontFamily: FONTS.fontFamily,
                                  fontSize: 18,
                                }}>
                                {item.question_text}
                              </Text>
                            </View>
                          </View>
                        );
                      }}
                    />
                  </>
                )}
              </>
            )}
          </Transitioning.View>
        </ScrollView>
        {this.state.selectedTab == 0 ? (
          <View
            style={{
              position: 'absolute',
              alignItems: 'center',
              bottom: 0,
              maxHeight: 200,
              // height: 70,
              width: '100%',
              flexDirection: 'row',
              backgroundColor: COLORS.primary,
            }}>
            <View
              style={{
                // width: 50,
                marginLeft: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (this.state.can_ask) {
                    if (this.state.send_message.trim() == '') {
                      ToastAndroid.showWithGravityAndOffset(
                        'اكتب الرساله',
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                        25,
                        50,
                      );
                    } else {
                      if (this.state.loading) {
                        ToastAndroid.showWithGravityAndOffset(
                          'الرجاء الانتظار حتى اتمام التحميل',
                          ToastAndroid.SHORT,
                          ToastAndroid.BOTTOM,
                          25,
                          50,
                        );
                      } else {
                        this.sendMyMessage();
                      }
                    }
                  } else {
                    ToastAndroid.showWithGravityAndOffset(
                      'لا يمكنك إرسال رساله أخرى',
                      ToastAndroid.SHORT,
                      ToastAndroid.BOTTOM,
                      25,
                      50,
                    );
                  }
                }}>
                <FontAwesome name="send" color="#fff" size={25} />
              </TouchableOpacity>
            </View>
            <Animatable.View
              animation="fadeInLeftBig"
              style={{
                flex: 1,
                paddingHorizontal: 20,
                // minHeight: 60,
                paddingVertical: 10,
                // maxHeight: 300,
                // alignItems: 'center',
                // justifyContent: 'center',
              }}>
              <TextInput
                placeholder="Type any message"
                multiline={true}
                style={{
                  color: '#ddd',
                  borderRadius: 50,
                  paddingHorizontal: 20,
                  fontFamily: FONTS.fontFamily,
                  backgroundColor: COLORS.secondary,
                  width: '100%',
                  height: '100%',

                  textAlign: 'right',
                }}
                value={this.state.send_message}
                onChangeText={(text) => {
                  this.setState({
                    send_message: text,
                  });
                }}
              />
            </Animatable.View>
          </View>
        ) : null}
        <View
          style={{
            position: 'absolute',
            top: this.state.moveingIdUp,
            left: this.state.moveingIdLeft,
            width: 160,
            height: 40,
            backgroundColor: 'rgba(0,0,0,0.6)',
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: '#fff', fontFamily: FONTS.fontFamily}}>
            {' '}
            Student ID : {this.state.student_id}
          </Text>
        </View>

        <Modal visible={this.state.waitingModalVisable} transparent={true}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <Image
              source={images.mainLoading}
              style={{
                height: 100,
                width: 100,
              }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontFamily: FONTS.fontFamily,
                fontSize: 20,
                color: '#fff',
              }}>
              الرجاء الانتظار للحظات
            </Text>
          </View>
        </Modal>

        <Modal
          visible={this.state.LogoutModal}
          onRequestClose={() => {
            this.setState({LogoutModal: false});
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
                  هل تريد الخروج من الفيديو ؟
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
                    this.setState({LogoutModal: false});
                    this.props.navigation.goBack();
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.primary,
                      fontSize: 20,
                    }}>
                    نعم
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
                    this.setState({LogoutModal: false});
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
          visible={this.state.wrongModal}
          onRequestClose={() => {
            this.setState({wrongModal: false});
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
              {this.state.WrongModalReason == 'res!=200' ||
              this.state.WrongModalReason == 'error' ? (
                <View style={{paddingVertical: 20}}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.primary,
                      fontSize: 17,
                      textAlign: 'center',
                    }}>
                    عذرا الرجاء المحاوله فى وقت لاحق
                  </Text>
                </View>
              ) : this.state.WrongModalReason == 'cash_down' ? (
                <View style={{paddingVertical: 20}}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.primary,
                      fontSize: 17,
                      textAlign: 'center',
                    }}>
                    عفواً رصيدك الحالى لا يسمح بمشاهده الفيديو الرجاء شحن حسابك
                    للمشاهده
                  </Text>
                </View>
              ) : null}

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
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 7,
                }}>
                <TouchableOpacity
                  style={{alignItems: 'center', justifyContent: 'center'}}
                  onPress={() => {
                    this.setState({wrongModal: false});
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
          visible={this.state.AlertBeforeExam}
          onRequestClose={() => {
            this.setState({AlertBeforeExam: false});
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
                  لاحظ انه سيتم احتساب النتيجه صفر لحين حل الامتحان لذا يجب عليك
                  حل الامتحان مع عدم الخروج منه{' '}
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
                    this.setState({
                      answered: false,
                    });
                    if (this.state.videoDetails.exam_type == '000') {
                      // alert(item.exam_type);

                      // showToastAlertExam();
                      let quiz_id = 'Exam_' + this.state.videoDetails.exam_id;
                      let quiz_name = this.state.videoDetails.exam_name;
                      let failed_video = this.state.videoDetails.failed_video;
                      let pass_video = this.state.videoDetails.pass_video;
                      let good_video = this.state.videoDetails.good_video;
                      let very_good_video =
                        this.state.videoDetails.very_good_video;
                      let excellent_video =
                        this.state.videoDetails.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'FullPageExam',
                      );
                    } else if (this.state.item.exam_type == '001') {
                      // alert(item.exam_type);

                      // showToastAlertExam();
                      let quiz_id = 'Exam_' + this.state.videoDetails.exam_id;
                      let quiz_name = this.state.videoDetails.exam_name;
                      let failed_video = this.state.videoDetails.failed_video;
                      let pass_video = this.state.videoDetails.pass_video;
                      let good_video = this.state.videoDetails.good_video;
                      let very_good_video =
                        this.state.videoDetails.very_good_video;
                      let excellent_video =
                        this.state.videoDetails.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'FullPageExamWithAnswers',
                      );
                    } else if (this.state.item.exam_type == '010') {
                      // alert(item.exam_type);

                      // showToastAlertExam();
                      let quiz_id = 'Exam_' + this.state.videoDetails.exam_id;
                      let quiz_name = this.state.videoDetails.exam_name;
                      let failed_video = this.state.videoDetails.failed_video;
                      let pass_video = this.state.videoDetails.pass_video;
                      let good_video = this.state.videoDetails.good_video;
                      let very_good_video =
                        this.state.videoDetails.very_good_video;
                      let excellent_video =
                        this.state.videoDetails.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'FullPageTimerExam',
                        this.state.videoDetails.exam_time,
                      );
                    } else if (this.state.item.exam_type == '011') {
                      // alert(item.exam_type);

                      // showToastAlertExam();
                      let quiz_id = 'Exam_' + this.state.videoDetails.exam_id;
                      let quiz_name = this.state.videoDetails.exam_name;
                      let failed_video = this.state.videoDetails.failed_video;
                      let pass_video = this.state.videoDetails.pass_video;
                      let good_video = this.state.videoDetails.good_video;
                      let very_good_video =
                        this.state.videoDetails.very_good_video;
                      let excellent_video =
                        this.state.videoDetails.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'FullPageTimerAnswerdExam',
                        this.state.videoDetails.exam_time,
                      );
                    } else if (this.state.item.exam_type == '100') {
                      // alert(item.exam_type);

                      // showToastAlertExam();
                      let quiz_id = 'Exam_' + this.state.videoDetails.exam_id;
                      let quiz_name = this.state.videoDetails.exam_name;
                      let failed_video = this.state.videoDetails.failed_video;
                      let pass_video = this.state.videoDetails.pass_video;
                      let good_video = this.state.videoDetails.good_video;
                      let very_good_video =
                        this.state.videoDetails.very_good_video;
                      let excellent_video =
                        this.state.videoDetails.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'QuizQutionsWithoutTime',
                      );
                    } else if (this.state.item.exam_type == '101') {
                      // alert(item.exam_type);

                      // showToastAlertExam();
                      let quiz_id = 'Exam_' + this.state.videoDetails.exam_id;
                      let quiz_name = this.state.videoDetails.exam_name;
                      let failed_video = this.state.videoDetails.failed_video;
                      let pass_video = this.state.videoDetails.pass_video;
                      let good_video = this.state.videoDetails.good_video;
                      let very_good_video =
                        this.state.videoDetails.very_good_video;
                      let excellent_video =
                        this.state.videoDetails.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'QuizQuationWithoutTime2',
                      );
                    } else if (this.state.item.exam_type == '110') {
                      // alert(item.exam_type);

                      // showToastAlertExam();
                      let quiz_id = 'Exam_' + this.state.videoDetails.exam_id;
                      let quiz_name = this.state.videoDetails.exam_name;
                      let failed_video = this.state.videoDetails.failed_video;
                      let pass_video = this.state.videoDetails.pass_video;
                      let good_video = this.state.videoDetails.good_video;
                      let very_good_video =
                        this.state.videoDetails.very_good_video;
                      let excellent_video =
                        this.state.videoDetails.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'QuizQuationWithTime',
                        this.state.videoDetails.exam_time, // ===========> Edit
                      );
                    } else if (this.state.item.exam_type == '111') {
                      // alert(item.exam_type);

                      // showToastAlertExam();
                      let quiz_id = 'Exam_' + this.state.videoDetails.exam_id;
                      let quiz_name = this.state.videoDetails.exam_name;
                      let failed_video = this.state.videoDetails.failed_video;
                      let pass_video = this.state.videoDetails.pass_video;
                      let good_video = this.state.videoDetails.good_video;
                      let very_good_video =
                        this.state.videoDetails.very_good_video;
                      let excellent_video =
                        this.state.videoDetails.excellent_video;
                      this.makeRequestToSaveDefaultScore(
                        quiz_id,
                        quiz_name,
                        failed_video,
                        pass_video,
                        good_video,
                        very_good_video,
                        excellent_video,
                        'QuizPageWithTimeCheck',
                        this.state.videoDetails.exam_time,
                      );
                    }
                  }}>
                  <Text
                    style={{
                      fontFamily: FONTS.fontFamily,
                      color: COLORS.primary,
                      fontSize: 20,
                    }}>
                    دخول
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
                    this.setState({AlertBeforeExam: false});
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
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  tabContainer: {
    height: 70,
    flexDirection: 'row',
    marginTop: 20,
    width: SIZES.width - 30,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    marginTop: SIZES.width > SIZES.height ? 300 : 0,
  },
  chatMessage: {
    marginVertical: 10,
    backgroundColor: '#fff',
    elevation: 5,
    alignSelf: 'center',
    width: '95%',
    padding: 10,
  },
  downloadButton: {
    backgroundColor: '#f60941',
    // width: 140,
    padding: 10,
    // paddingVertical: 7,
    // paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  testYourselfButton: {
    backgroundColor: '#3ab54a',
    // width: 140,
    padding: 10,

    // paddingVertical: 7,
    // paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  askingBadge: {
    width: 30,
    height: 30,
    backgroundColor: COLORS.askTeacherGadge,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },

  streamContentsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 50,
    alignItems: 'center',
  },
  lessonContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#eee',
    marginVertical: 10,
    borderRadius: 10,
  },
  lessonUnlockedAccess: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  lessonNotAilableContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#eee',
    marginVertical: 10,
    borderRadius: 10,
  },
});
