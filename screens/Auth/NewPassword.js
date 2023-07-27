import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Picker,
  StyleSheet,
  ToastAndroid,
  Animated,
  Modal,
} from 'react-native';
import {Container, Header, Spinner} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Hoshi} from 'react-native-textinput-effects';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {AppRequired, COLORS, FONTS, images, SIZES} from '../../constants';

export default class NewPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: false,
      icon2: false,
      nPassword: '',
      rePassword: '',
      email: '',
      data: '',
      loading: false,
      renderError: '',
      resModal: false,
      resMassage: '',
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Offline',
    };
    this._subscription;
  }

  componentWillUnmount() {
    this._subscription && this._subscription();
  }
  componentDidMount() {
    // this.allowFunction();
    this._subscription = NetInfo.addEventListener(
      this._handelConnectionInfoChange,
    );
  }
  _handelConnectionInfoChange = (NetInfoState) => {
    if (NetInfoState.isConnected == true) {
      this.setState(({}) => ({
        connection_Status: 'Online',
      }));
      Animated.spring(this.state.bottomConnectionMsg, {
        toValue: -100,
      }).start();
    } else {
      this.setState(({}) => ({
        connection_Status: 'offline',
      }));
      Animated.spring(this.state.bottomConnectionMsg, {toValue: 0}).start();
    }
  };

  resetPassFun() {
    if (this.state.nPassword == '') {
      this.setState({renderError: 'من فضلك ادخل كلمة المرور'});
    } else if (
      this.state.nPassword.length < 6 ||
      this.state.rePassword.length < 6
    ) {
      this.setState({renderError: 'كلمة المرور يجب ان تكون اكثر من 6 احرف'});
      // this.setState({nPassword: '',rePassword: ''});
    } else if (this.state.nPassword != this.state.rePassword) {
      this.setState({
        renderError: 'من فضلك تأكد من تطابق كلمة المرور',
      });
    } else {
      this.setState({renderError: ''});
      this.setState({loading: true});
      const dataToSend = {
        email: this.props.navigation.getParam('email'),
        new_password: this.state.rePassword,
      };
      if (this.state.connection_Status == 'Online') {
        axios
          .post(AppRequired.Domain + 'reset_password.php', dataToSend)
          .then((res) => {
            this.setState({loading: false});

            switch (res.data.trim()) {
              case 'error':
                this.setState({
                  resModal: true,
                  resMassage:
                    'حدث خطأ ما الرجاء أدخل كلمه مرور أخرى او المحاوله فى وقت لاحق',
                });
                break;
              case 'success':
                ToastAndroid.show(
                  'قد تم تغير كلمه المرور بنجاح',
                  ToastAndroid.CENTER,
                );

                this.props.navigation.navigate('Login');

                break;
              default:
                this.setState({
                  resModal: true,
                  resMassage: 'حدث خطأ ما الرجاء حاول مره اخرى',
                });
            }
          });
      } else {
        this.setState({loading: false});
        this.setState({
          resModal: true,
          resMassage: 'من فضلك تحقق من اتصالك بالأنترنت',
        });
      }
    }
  }

  loading() {
    if (this.state.loading) {
      return <Spinner color="white" />;
    } else {
      return (
        <Text
          style={{
            color: 'white',
            fontSize: 20,
            // fontFamily: FONTS.fontFamily,
          }}>
          تأكيد
        </Text>
      );
    }
  }

  render() {
    return (
      <>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              width: 230,
              height: 230,
              borderRadius: 115,
              backgroundColor: COLORS.primary,
              position: 'absolute',
              right: 10,
              top: -50,
            }}></View>
          <View
            style={{
              width: 230,
              height: 230,
              borderRadius: 115,
              backgroundColor: COLORS.secondary,
              position: 'absolute',
              right: -45,
              top: -25,
              //   alignContent: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 140,
                height: 140,
                borderRadius: 60,
                // backgroundColor: 'yellow',
                marginLeft: 30,
              }}>
              <Image
                // source={require('./logocamp.jpg')}
                source={images.AppLogo}
                style={{width: null, height: null, flex: 1}}
              />
            </View>
          </View>
          {/* -----------------text--------------------- */}
          <View style={{width: '90%', marginHorizontal: '5%', marginTop: 230}}>
            <Text style={{fontSize: 24, fontFamily: FONTS.fontFamily}}>
              تغير كلمة المرور ؟
            </Text>
            <Text style={{fontFamily: FONTS.fontFamily}}>
              من فضلك ادخل كلمة المرور الجديدة
            </Text>
          </View>
          {/* -----------------Textinput---------------- */}
          <View
            style={{
              width: '90%',
              height: 60,
              marginTop: 15,
              marginHorizontal: '5%',
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: '100%',
                //   backgroundColor: 'yellow',
                justifyContent: 'center',
              }}>
              <Hoshi
                label={'كلمه المرور الجديدة'}
                borderColor={COLORS.primary}
                style={{
                  width: '100%',
                  paddingLeft: 15,
                  fontFamily: FONTS.fontFamily,
                }}
                borderHeight={0.85}
                labelStyle={{
                  color: '#C9CCCC',
                  fontFamily: FONTS.fontFamily,
                }}
                inputStyle={{
                  color: '#000',
                  textAlign: 'right',
                  fontFamily: FONTS.fontFamily,
                  paddingRight: 60,
                }}
                secureTextEntry={!this.state.icon}
                value={this.state.nPassword}
                onChangeText={(value) => {
                  this.setState({nPassword: value, renderError: ''});
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                let x = this.state.icon;
                this.setState({icon: !x});
              }}
              style={{
                width: '15%',
                //   backgroundColor: 'green',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: 0,
                top: '50%',
                marginBottom: -2,
              }}>
              <Icon name={this.state.icon ? 'eye' : 'eye-slash'} size={20} />
            </TouchableOpacity>
          </View>

          {/* -------------------------- */}
          <View
            style={{
              width: '90%',
              height: 60,
              marginTop: 15,
              marginHorizontal: '5%',
              flexDirection: 'row',
            }}>
            <View
              style={{
                width: '100%',
                //   backgroundColor: 'yellow',
                justifyContent: 'center',
              }}>
              <Hoshi
                label={'تأكيد كلمة المرور'}
                borderColor={COLORS.primary}
                style={{
                  width: '100%',
                  paddingLeft: 15,
                  fontFamily: FONTS.fontFamily,
                }}
                borderHeight={0.85}
                labelStyle={{
                  color: '#C9CCCC',
                  fontFamily: FONTS.fontFamily,
                }}
                inputStyle={{
                  color: '#000',
                  textAlign: 'right',
                  fontFamily: FONTS.fontFamily,
                  paddingRight: 60,
                }}
                secureTextEntry={!this.state.icon2}
                value={this.state.rePassword}
                onChangeText={(value) => {
                  this.setState({rePassword: value, renderError: ''});
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                let x = this.state.icon2;
                this.setState({icon2: !x});
              }}
              style={{
                width: '15%',
                //   backgroundColor: 'green',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: 0,
                top: '50%',
                marginBottom: -2,
              }}>
              <Icon name={this.state.icon2 ? 'eye' : 'eye-slash'} size={20} />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              textAlign: 'center',
              color: 'red',
              fontSize: 14,
              fontFamily: FONTS.fontFamily,
            }}>
            {this.state.renderError}
          </Text>
          {/* --------------send------------------ */}
          <TouchableOpacity
            onPress={this.resetPassFun.bind(this)}
            style={{
              width: '90%',
              height: 60,
              marginHorizontal: '5%',
              backgroundColor: COLORS.primary,
              borderRadius: 30,
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 18, fontFamily: FONTS.fontFamily}}>
              {this.loading()}
            </Text>
          </TouchableOpacity>
          {/* ------------------------------------ */}
        </ScrollView>
        <Modal
          visible={this.state.resModal}
          onRequestClose={() => {
            this.setState({resModal: false});
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

              <View style={{paddingHorizontal: 20, paddingVertical: 12}}>
                <Text
                  style={{
                    fontFamily: FONTS.fontFamily,
                    color: COLORS.primary,
                    fontSize: 17,
                    textAlign: 'center',
                  }}>
                  {this.state.resMassage}
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
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 7,
                }}>
                <TouchableOpacity
                  style={{alignItems: 'center', justifyContent: 'center'}}
                  onPress={() => {
                    this.setState({resModal: false});
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
      </>
    );
  }
}
