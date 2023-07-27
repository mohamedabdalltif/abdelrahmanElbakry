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
  Modal,
  TextInput,
  ToastAndroid,
  RefreshControl,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {AppRequired, COLORS, FONTS, images, SIZES} from '../../constants';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Spinner,
  Title,
} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import * as Animatable from 'react-native-animatable';
import {NavigationEvents} from 'react-navigation';
const ITEM_SIZE =
  Platform.OS === 'ios' ? SIZES.width * 0.72 + 40 : SIZES.width * 0.74 + 40;
const SEPACER_ITEM_SIZE = (SIZES.width - ITEM_SIZE) / 2;

// import Modal from 'react-native-modalbox';
export default class MyLibrary extends React.Component {
  constructor() {
    super();
    this.state = {
      openSearchModal: false,
      connection_Status: 'Online',
      streamsOfMonth: [],
      individualVideos: [],
      loading: true,
      searchField: '',
      selectedItem: {},
      student_name: '',
      // student_points: '',
      refreshing: false,
      single_vedio_details: {},
      single_vedio_details_onModal: {},
      FlatName: '',
      selectIndividualVideoIndex: 0,
      alertBeforeWatchingSingleModal: false,
      checkInsertSingelViewFun: false,
      chainDetails: {},
      alertBeforeWatchingChainModal: false,
      searchModalArray: [],
      searchModalArrayFilter: [],

      onSearchFilter: false,
    };
  }

  async CustomcomponentDidMount() {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected == true) {
        this.setState({
          connection_Status: 'Online',
        });
        this.getData();
      } else {
        this.setState({
          connection_Status: 'Offline',
        });
      }
    });
  }

  getData = async () => {
    let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));

    this.setState({
      student_name: studentData.student_name,
      // student_points: studentData.student_points,
    });
    let data_to_send = {
      student_id: studentData.student_id,
      generation_id: studentData.student_generation_id,
      subject_id: drInfo.subject_id,
    };

    axios
      .post(AppRequired.Domain + 'select_my_liberary.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (
            Array.isArray(res.data.videos) &&
            Array.isArray(res.data.chains)
          ) {
            let newStream = [];
            let newIndividual = [];
            var uniqueNumber = 0;

            for (let i = 0; i < res.data.chains.length; i++) {
              if (!res.data.chains[i].videos) {
                newStream.push({
                  catigory: 'empty',
                  unique: uniqueNumber.toString(),
                  video_title: '',
                });
              } else {
                let videos = res.data.chains[i].videos;
                for (let j = 0; j < videos.length; j++) {
                  uniqueNumber += 1;
                  let newObj = {
                    ...videos[j],
                    catigory: 'onChain',
                    unique: uniqueNumber.toString(),
                  };
                  newStream.push(newObj);
                }
              }
              uniqueNumber += 1;
            }

            // for (let i = 0; i < res.data.videos.length; i++) {
            //   let newObj = res.data.videos[i].video_data;
            //   newIndividual.push({
            //     ...newObj,
            //     catigory: 'onIndividual',
            //     unique: uniqueNumber.toString(),
            //     view_count: res.data.videos[i].view_count,
            //     view_limit_count: res.data.videos[i].view_limit_count,
            //     answered: res.data.videos[i].answered,
            //   });
            //   uniqueNumber += 1;
            // }

            let finalArray = newStream.concat(newIndividual);
            let videosArray = [];
            let chainsArray = res.data.chains;
            // this.setState({
            //   individualVideos: [
            //     {key: 'left-spacer'},
            //     ...videosArray,
            //     {key: 'right-spacer'},
            //   ],
            //   streamsOfMonth: [
            //     {key: 'left-spacer'},
            //     ...chainsArray,
            //     {key: 'right-spacer'},
            //   ],
            //   searchModalArray: finalArray,
            //   searchModalArrayFilter: finalArray,
            // });
            this.setState({
              individualVideos: videosArray,
              streamsOfMonth: chainsArray,
              searchModalArray: finalArray,
              searchModalArrayFilter: finalArray,
            });
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
      })
      .finally(() => {
        this.setState({
          loading: false,
          refreshing: false,
        });
      });
  };

  search_lesson(search_text) {
    this.setState({
      searchField: search_text,
    });

    let text = search_text.toLowerCase();
    let trucks = this.state.searchModalArray;
    let filteredName = trucks.filter((item) => {
      return item.video_title.toLowerCase().match(search_text);
    });
    if (!text || text === '') {
      this.setState({
        searchModalArrayFilter: filteredName,
      });
    } else if (!Array.isArray(filteredName) && !filteredName.length) {
      this.setState({
        searchModalArrayFilter: this.state.searchModalArray,
      });
    } else if (Array.isArray(filteredName)) {
      this.setState({
        searchModalArrayFilter: filteredName,
      });
    }
  }

  insert_one_view_singel = async () => {
    this.setState({checkInsertSingelViewFun: true, openSearchModal: false});
    const data = JSON.parse(await AsyncStorage.getItem('AllData'));

    let videoData = this.state.single_vedio_details;
    let data_to_send = {
      video_id: this.state.onSearchFilter
        ? this.state.single_vedio_details_onModal.video_id
        : videoData.video_data.video_id,
      student_id: data.student_id,
    };

    let dataAfterAddingAnswered = {
      ...videoData.video_data,
      answered: this.state.single_vedio_details.answered,
    };

    let navigateData = this.state.onSearchFilter
      ? this.state.single_vedio_details_onModal
      : dataAfterAddingAnswered;

    axios
      .post(AppRequired.Domain + 'insert_one_view.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            this.setState({
              checkInsertSingelViewFun: false,
              alertBeforeWatchingSingleModal: false,
            });
            videoData.view_count = (
              parseInt(videoData.view_count) + 1
            ).toString();
            let allVideos = this.state.individualVideos;
            allVideos[this.state.selectIndividualVideoIndex] = videoData;
            this.setState({
              individualVideos: allVideos,
              openSearchModal: false,
            });
            this.props.navigation.navigate('WatchIndvidualVideo', {
              vedio_details: navigateData,
            });
          } else if (res.data == 'error') {
            this.setState({checkInsertViewFun: false});

            this.setState({
              wrongSingleModal: true,
              WrongModalReason: 'error',
              alertBeforeWatchingSingleModal: false,
            });
          }
        } else {
          this.setState({
            wrongSingleModal: true,
            WrongModalReason: 'res!=200',
            checkInsertSingelViewFun: false,
            alertBeforeWatchingSingleModal: false,
          });
        }
      });
  };
  underHeader = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          this.props.navigation.navigate('Profile');
        }}
        style={{
          flexDirection: 'row',
          paddingVertical: 7,
        }}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Profile');
          }}
          style={{
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 0.2,
          }}>
          <SimpleLineIcons name="arrow-right" size={25} />
        </TouchableOpacity>
        <View
          style={{
            ...styles.leftUnderHeaderContainer,
          }}>
          <View style={{marginRight: '4%', flex: 1}}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontFamily: FONTS.fontFamily,
                // marginLeft: '15%',
                // alignSelf: 'flex-end',
              }}>
              {this.state.student_name}
            </Text>
            {/* <Text style={{color: COLORS.third, fontFamily: FONTS.fontFamily}}>
              {this.state.student_points} point
            </Text> */}
            <View
              style={{
                width: '100%',
                // alignItems: 'center',
                justifyContent: 'flex-start',
              }}>
              <Text
                style={{
                  fontFamily: FONTS.fontFamily,
                  fontSize: 15,
                  color: COLORS.secondary,
                }}>
                الصفحة الشخصية للطالب
              </Text>
            </View>
          </View>
          <View
            style={{
              // alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={images.avatar_5}
              style={{height: 50, width: 50, borderRadius: 50 / 2}}
              resizeMode="cover"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderStreamsOfMonth = () => {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={this.state.streamsOfMonth}
        snapToInterval={ITEM_SIZE}
        // keyExtractor={(item) => item.chain_id}
        keyExtractor={(item, index) => 'month' + index.toString()}
        // horizontal
        // bounces={false}
        scrollEventThrottle={16}
        // contentContainerStyle={{
        //   alignItems: 'center',
        // }}
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
        renderItem={({item, index}) => {
          if (!item.preview_photo) {
            return <View style={{width: SEPACER_ITEM_SIZE}} />;
          }
          return (
            <View style={{width: ITEM_SIZE}}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  this.props.navigation.navigate('WatchStreamVideo', {
                    chain_id: item.chain_id,
                  });
                  this.setState({
                    alertBeforeWatchingChainModal: false,
                    openSearchModal: false,
                  });
                  // this.setState({
                  //   alertBeforeWatchingChainModal: true,
                  //   chainDetails: item,
                  // });
                  // alert(JSON.stringify(item));
                }}
                style={{
                  marginHorizontal: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                }}>
                <Image
                  source={{uri: item.preview_photo}}
                  style={{
                    width: '100%',
                    height: 150,
                  }}
                />
                <Text
                  style={{fontFamily: FONTS.fontFamily, fontSize: 15}}
                  numberOfLines={2}>
                  {item.chain_name}
                </Text>
                <Text
                  style={{fontFamily: FONTS.fontFamily, fontSize: 15}}
                  numberOfLines={2}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    );
  };

  renderLessonsOfMonth = () => {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={this.state.individualVideos}
        snapToInterval={ITEM_SIZE}
        // keyExtractor={(i, k) => k.toString()}
        keyExtractor={(item, index) => 'lesson' + index.toString()}
        // keyExtractor={(item) => item.unique}
        horizontal
        // bounces={false}
        scrollEventThrottle={16}
        contentContainerStyle={{
          alignItems: 'center',
        }}
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
                لا توجد فيديوهات
              </Text>
            </View>
          );
        }}
        renderItem={({item, index}) => {
          if (!item.view_count) {
            return <View style={{width: SEPACER_ITEM_SIZE}} />;
          }
          return (
            <View style={{width: ITEM_SIZE}}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  this.setState({
                    single_vedio_details: item,
                    selectIndividualVideoIndex: index,
                    FlatName: 'individualVideos',
                  });
                  if (
                    parseInt(item.view_count) < parseInt(item.view_limit_count)
                  ) {
                    this.setState({alertBeforeWatchingSingleModal: true});
                  } else {
                    ToastAndroid.showWithGravityAndOffset(
                      'لقد انهيت عدد المشاهدات المتاحه لك لهذا الفيديو',
                      ToastAndroid.LONG,
                      ToastAndroid.CENTER,
                      25,
                      50,
                    );
                  }
                }}
                style={{
                  ...styles.streamMonthContainer,
                }}>
                <Image
                  source={{
                    uri: this.state.onSearchFilter
                      ? this.state.single_vedio_details_onModal.video_image_link
                      : item.video_data.video_image_link,
                  }}
                  style={{
                    width: '100%',
                    height: 150,
                  }}
                />
                <Text
                  style={{fontFamily: FONTS.fontFamily, fontSize: 15}}
                  numberOfLines={2}>
                  {this.state.onSearchFilter
                    ? this.state.single_vedio_details_onModal.video_title
                    : item.video_data.video_title}
                </Text>
                <Text
                  style={{fontFamily: FONTS.fontFamily, fontSize: 15}}
                  numberOfLines={2}>
                  {this.state.onSearchFilter
                    ? this.state.single_vedio_details_onModal.video_description
                    : item.video_data.video_description}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    );
  };
  render() {
    // const FilterData = this.state.searchModalArray.filter((item) => {
    //   return item.video_title.indexOf(this.state.searchField) >= 0;
    // });
    return (
      <Container style={{backgroundColor: '#fff'}}>
        <NavigationEvents onDidFocus={() => this.CustomcomponentDidMount()} />
        <Header
          androidStatusBarColor={COLORS.secondary}
          style={{backgroundColor: COLORS.primary}}>
          <Left>
            <View
              style={{
                ...styles.leftHeader,
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    openSearchModal: true,
                  });
                }}>
                <Feather name="search" color="#fff" size={25} />
              </TouchableOpacity>
            </View>
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
              }}>
              <Text
                style={{
                  fontFamily: FONTS.fontFamily,
                  fontSize: 15,
                  color: COLORS.secondary,
                }}>
                مساراتى (الشهور)
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.primary,
                  padding: 5,
                  borderRadius: 4,
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,

                    fontSize: 15,
                    color: '#fff',
                  }}>
                  الكل ({this.state.streamsOfMonth.length})
                </Text>
              </View>
            </View>
            {this.renderStreamsOfMonth()}
            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
              }}>
              <Text
                style={{
                  fontFamily: FONTS.fontFamily,

                  fontSize: 15,
                  color: COLORS.secondary,
                }}>
                مساراتى (الحصص)
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.primary,
                  padding: 5,
                  borderRadius: 4,
                }}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,

                    fontSize: 15,
                    color: '#fff',
                  }}>
                  الكل ({this.state.individualVideos.length - 2})
                </Text>
              </View>
            </View>
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
              الرجاء التأكد من اتصالك بالإنترنت
            </Text>
          </View>
        ) : null}

        <Modal
          visible={this.state.openSearchModal}
          onRequestClose={() => {
            this.setState({
              openSearchModal: false,
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
                      openSearchModal: false,
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
                    this.search_lesson(text);
                  }}
                />
              </Animatable.View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={this.state.searchModalArrayFilter}
                // keyExtractor={(item) =>  item.unique}
                keyExtractor={(item, index) => 'modal' + index.toString()}
                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
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
                renderItem={({item, index}) => {
                  if (item.catigory == 'empty') {
                    return;
                  }
                  if (!item.video_image_link) {
                    return <View style={{width: SEPACER_ITEM_SIZE}} />;
                  }
                  return (
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => {
                        if (item.catigory == 'onChain') {
                          this.props.navigation.navigate('WatchStreamVideo', {
                            chain_id: item.chain_id,
                          });
                          this.setState({
                            alertBeforeWatchingChainModal: false,
                            openSearchModal: false,
                          });
                          // this.setState({
                          //   alertBeforeWatchingChainModal: true,
                          //   chainDetails: item,
                          // });
                        } else if (item.catigory == 'onIndividual') {
                          this.setState({
                            single_vedio_details_onModal: item,
                            selectIndividualVideoIndex: index,
                            FlatName: 'searchModalArrayFilter',
                          });
                          // alert(JSON.stringify(item));
                          if (
                            parseInt(item.view_count) <
                            parseInt(item.view_limit_count)
                          ) {
                            this.setState({
                              alertBeforeWatchingSingleModal: true,
                              onSearchFilter: true,
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
                        }
                        // this.setState({
                        //   openStreamsModal: true,
                        //   selectedItem: item,
                        // });
                      }}
                      style={{
                        ...styles.searchDataFilterContainer,
                      }}>
                      <Image
                        source={{
                          uri: item.video_image_link,
                        }}
                        style={{
                          width: '100%',
                          height: 200,
                        }}
                      />
                      <View style={{padding: 15}}>
                        <Text
                          style={{fontFamily: FONTS.fontFamily, fontSize: 17}}>
                          {item.video_title}
                        </Text>

                        <Text
                          numberOfLines={3}
                          style={{fontFamily: FONTS.fontFamily, fontSize: 17}}>
                          {item.video_description}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </ScrollView>
          </View>
        </Modal>

        <Modal
          visible={this.state.alertBeforeWatchingSingleModal}
          onRequestClose={() => {
            this.setState({
              alertBeforeWatchingSingleModal: false,
              checkInsertSingelViewFun: false,
            });
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
                {this.state.FlatName == 'searchModalArrayFilter' ? (
                  <>
                    {this.state.single_vedio_details_onModal.view_count ==
                    '0' ? (
                      <Text
                        style={{
                          fontFamily: FONTS.fontFamily,
                          fontSize: 17,
                          textAlign: 'justify',
                        }}>
                        سوف يتم خصم مشاهده من العدد الاجمالى المتاح لمشاهده هذ
                        الفيديو وهو{' '}
                        {this.state.single_vedio_details_onModal
                          .view_limit_count == '1' ? (
                          <Text style={{color: COLORS.primary}}>مره واحده</Text>
                        ) : this.state.single_vedio_details_onModal
                            .view_limit_count == '2' ? (
                          <Text style={{color: COLORS.primary}}>مرتين</Text>
                        ) : (
                          <Text style={{color: COLORS.primary}}>
                            {this.state.single_vedio_details_onModal
                              .view_limit_count + ' مرات'}
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
                        {this.state.single_vedio_details_onModal.view_count ==
                        '1'
                          ? 'مره واحده فقط'
                          : this.state.single_vedio_details_onModal
                              .view_count == '2'
                          ? 'مرتين'
                          : this.state.single_vedio_details_onModal.view_count +
                            ' مرات'}{' '}
                        من{' '}
                        {
                          this.state.single_vedio_details_onModal
                            .view_limit_count
                        }{' '}
                        فى حال المتابعه سوف يتم خصم مشاهده
                      </Text>
                    )}
                  </>
                ) : (
                  <>
                    {this.state.single_vedio_details.view_count == '0' ? (
                      <Text
                        style={{
                          fontFamily: FONTS.fontFamily,
                          fontSize: 17,
                          textAlign: 'justify',
                        }}>
                        سوف يتم خصم مشاهده من العدد الاجمالى المتاح لمشاهده هذ
                        الفيديو وهو{' '}
                        {this.state.single_vedio_details.view_limit_count ==
                        '1' ? (
                          <Text style={{color: COLORS.primary}}>مره واحده</Text>
                        ) : this.state.single_vedio_details.view_limit_count ==
                          '2' ? (
                          <Text style={{color: COLORS.primary}}>مرتين</Text>
                        ) : (
                          <Text style={{color: COLORS.primary}}>
                            {this.state.single_vedio_details.view_limit_count +
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
                        {this.state.single_vedio_details.view_count == '1'
                          ? 'مره واحده فقط'
                          : this.state.single_vedio_details.view_count == '2'
                          ? 'مرتين'
                          : this.state.single_vedio_details.view_count +
                            ' مرات'}{' '}
                        من {this.state.single_vedio_details.view_limit_count} فى
                        حال المتابعه سوف يتم خصم مشاهده
                      </Text>
                    )}
                  </>
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
              <View style={{paddingHorizontal: 20, paddingVertical: 10}}>
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
                        openSearchModal: false,
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
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  leftUnderHeaderContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    padding: 7,
    justifyContent: 'flex-end',
  },
  streamMonthContainer: {
    marginHorizontal: 10,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingVertical: 10,
    elevation: 1,
    overflow: 'hidden',
  },
  leftHeader: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
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
