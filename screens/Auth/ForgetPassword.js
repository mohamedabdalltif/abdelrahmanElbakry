import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  ToastAndroid,
} from 'react-native';
import {Container, Header, Spinner} from 'native-base';
import {Hoshi} from 'react-native-textinput-effects';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import {AppRequired, COLORS, FONTS, images} from '../../constants';

export default class Forgetpass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      loading: false,
      data: '',
      code: '',
      renderError: '',
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

  // validate = (text) => {
  //   let reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  //   if (reg.test(text) === false) {
  //     this.setState({Email: text});
  //     return false;
  //   } else {
  //     this.setState({Email: text});
  //     return true;
  //   }
  // };
  validate = (text) => {
    let arr = text.split('@');
    let init_text = arr[0] + '';
    init_text = init_text.replace(/\./g, '');
    text = init_text + '@' + arr[1];
    console.log(text);
    let reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      // this.setState({ email: text });
      return false;
    } else {
      // this.setState({ email: text });
      return true;
    }
  };
  loading() {
    if (this.state.loading) {
      return <Spinner color="white" />;
    } else {
      return (
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            alignSelf: 'center',
            fontFamily: FONTS.fontFamily,
          }}>
          ارسال
        </Text>
      );
    }
  }

  sendEmailFun() {
    if (this.state.Email == '') {
      this.setState({renderError: 'من فضلك ادخل البريد الالكترونى'});
    } else {
      if (this.validate(this.state.Email.trim()) == true) {
        this.setState({loading: true});

        let code = '';
        for (let i = 0; i < 6; i++) {
          let x = Math.floor(Math.random() * 10);
          code += x;
        }

        let dataToSend = {
          email: this.state.Email,
          code: code,
        };
        console.log(dataToSend);
        if (this.state.connection_Status == 'Online') {
          axios
            .post(AppRequired.Domain + 'send_code.php', dataToSend)
            .then((res) => {
              this.setState({loading: false});
              console.log(res.data);
              if (res.data.trim() == 'emailSent') {
                this.props.navigation.navigate('EnterCodeReset', {
                  code: code,
                  email: this.state.Email,
                });
              } else if (res.data.trim() == 'not_found') {
                ToastAndroid.showWithGravityAndOffset(
                  'هذا المستخدم غير موجود',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                  25,
                  50,
                );
              } else if (res.data.trim() == 'user_not_found') {
                ToastAndroid.showWithGravityAndOffset(
                  'هذا المستخدم غير موجود',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                  25,
                  50,
                );
              } else {
                ToastAndroid.showWithGravityAndOffset(
                  'حدث خطأ ما الرجاء حاول مره اخرى',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                  25,
                  50,
                );
              }
            });
        } else {
          this.setState({loading: false});
          ToastAndroid.showWithGravityAndOffset(
            'من فضلك تحقق من اتصالك بالأنترنت',
            ToastAndroid.LONG,
            ToastAndroid.CENTER,
            25,
            50,
          );
        }
      } else {
        this.setState({renderError: 'من فضلك ادخل ايميل صحيح'});
      }
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
                source={images.AppLogo}
                style={{width: null, height: null, flex: 1}}
              />
            </View>
          </View>
          {/* -----------------text--------------------- */}
          <View style={{width: '90%', marginHorizontal: '5%', marginTop: 230}}>
            <Text style={{fontWeight: 'bold', fontSize: 24}}>
              هل نسيت كلمة المرور؟
            </Text>
            <Text style={{fontWeight: 'bold'}}>
              لا تقلق بإمكانك إعادة ضبط كلمة المرور بسهولة فقط أخبرنا بالبريد
              الإلكترونى
            </Text>
          </View>
          {/* -----------------Textinput---------------- */}

          <View
            style={{
              width: '90%',
              height: 60,
              marginTop: 15,
              marginHorizontal: '5%',
            }}>
            <Hoshi
              autoCapitalize="none"
              autoCompleteType="email"
              keyboardType="email-address"
              label={'البريد الإلكترونى'}
              borderColor={COLORS.primary}
              style={{
                width: '100%',
                paddingLeft: 15,
              }}
              borderHeight={2}
              labelStyle={{
                color: '#C9CCCC',
              }}
              inputStyle={{color: '#000', textAlign: 'right'}}
              value={this.state.Email}
              onChangeText={(value) => {
                this.setState({Email: value});
              }}
            />
          </View>
          {this.state.renderError != '' ? (
            <Text
              style={{
                textAlign: 'center',
                color: 'red',
                fontSize: 14,
                fontWeight: '800',
                marginTop: 20,
                // fontFamily: fontFamily,
              }}>
              {this.state.renderError}
            </Text>
          ) : null}
          {/* --------------send------------------ */}
          <TouchableOpacity
            onPress={this.sendEmailFun.bind(this)}
            disabled={this.state.loading == true ? true : false}
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
            {this.loading()}
          </TouchableOpacity>
          {/* ------------------------------------ */}
        </ScrollView>
      </>
    );
  }
}
