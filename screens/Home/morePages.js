import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  Platform,
  ImageBackground,
  Modal,
  TextInput,
  ToastAndroid,
} from 'react-native';
import {
  AppRequired,
  COLORS,
  FONTS,
  icons,
  images,
  SIZES,
} from '../../constants';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Spinner,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

import Feather from 'react-native-vector-icons/Feather';
const ITEM_SIZE =
  Platform.OS === 'ios' ? SIZES.width * 0.72 : SIZES.width * 0.74;
import axios from 'axios';

// import Modal from 'react-native-modalbox';
export default class MorePages extends React.Component {
  constructor() {
    super();
    this.state = {
      pages: [
        // {
        //   name: 'حقوق النشر',
        //   navigationRouteName: 'CopyRight',
        // },
        {
          name: 'الإمتحانات',
          navigationRouteName: 'ExamList',
        },
        // {
        //   name: 'الواجبات',
        //   navigationRouteName: 'QuizList',
        // },
        {
          name: 'الملخصات',
          navigationRouteName: 'SummaryList',
        },
        // {
        //   name: 'التحديات',
        //   navigationRouteName: 'MovePage',
        // },
        {
          name: 'المعاملات الماليه',
          navigationRouteName: 'MoneyTransactionsDetails',
        },
        {
          name: 'الإعدادات',
          navigationRouteName: 'Setting',
        },
        {
          name: 'عن د/ ',
          navigationRouteName: 'TeacherInfo',
        },
        {
          name: 'تسجيل الخروج',
          navigationRouteName: '',
        },
      ],
      openLogoutModal: false,
      checkLogoutLoading: false,
    };
  }

  async setData() {
    await AsyncStorage.clear();
    await AsyncStorage.setItem('switch', 'Auth');
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

  underHeader = () => {
    return (
      <View style={{...styles.underHeaderContainer}}>
        <View>
          <Image
            style={[{width: 25, height: 25, marginRight: 15}]}
            source={icons.list}
          />
        </View>
        <Text
          style={{
            fontSize: 22,
            fontFamily: FONTS.fontFamily,
          }}>
          المزيد
        </Text>
      </View>
    );
  };

  pagesNavigation = () => {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={this.state.pages}
        keyExtractor={(item) => item.key}
        scrollEventThrottle={16}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (index == this.state.pages.length - 1) {
                  this.setState({
                    openLogoutModal: true,
                  });
                } else {
                  this.props.navigation.navigate(item.navigationRouteName);
                }
              }}>
              <View style={{paddingLeft: 40, paddingVertical: 7}}>
                <Text
                  style={{
                    color:
                      index == this.state.pages.length - 1 ? '#f60941' : '#000',
                    fontSize: 20,
                    fontFamily: FONTS.fontFamily,
                  }}>
                  {index == 4 ? item.name + 'محمد عطية' : item.name}
                </Text>
              </View>
              <View
                style={{
                  width: index == 0 ? '85%' : '80%',
                  alignSelf: 'flex-start',
                  borderWidth: index == this.state.pages.length - 1 ? 0 : 0.5,
                  borderColor: '#ddd',
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    );
  };
  render() {
    return (
      <Container style={{backgroundColor: '#fff'}}>
        <Header
          androidStatusBarColor={COLORS.secondary}
          style={{backgroundColor: COLORS.primary}}>
          <Left>
            <View
              style={{
                ...styles.leftHeader,
              }}>
              {/* <TouchableOpacity
                onPress={() => {
                  this.setState({
                    openSearchModal: true,
                  });
                }}>
                <Feather name="search" color="#fff" size={25} />
              </TouchableOpacity> */}
            </View>
          </Left>
          <Body></Body>
          <Right>
            <Title>{AppRequired.appName}</Title>
          </Right>
        </Header>
        <ScrollView showsVerticalScrollIndicator={false}>
          {this.underHeader()}
          <View
            style={{
              width: '90%',
              alignSelf: 'flex-start',
              borderWidth: 1,
              borderColor: '#ddd',
            }}
          />

          {this.pagesNavigation()}
        </ScrollView>

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
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  underHeaderContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  leftHeader: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
