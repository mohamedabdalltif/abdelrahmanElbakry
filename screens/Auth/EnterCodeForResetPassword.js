import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ToastAndroid,
} from 'react-native';
import CountDown from 'react-native-countdown-component';
import SMSVerifyCode from 'react-native-sms-verifycode';
import axios from 'axios';
import {AppRequired, COLORS, FONTS, images} from '../../constants';

export default class EnterCodeForResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeSent: this.props.navigation.getParam('code'),
      code: '',
      viewed: false,
      Disable: false,
      codeFromData: '8888',
      renderError: '',
      email: this.props.navigation.getParam('email'),
    };
    this.verifycode = null;
  }

  reSendCode() {
    var code = '';
    for (let i = 0; i < 6; i++) {
      let x = Math.floor(Math.random() * 10);
      code += x;
    }

    let data_to_send = {
      email: this.state.email,
      code: code,
    };

    axios
      .post(AppRequired.Domain + 'send_code.php', data_to_send)
      .then((res) => {
        if (res.data.trim() == 'emailSent') {
          // ToastAndroid.show("قد تم إعاده إرسال الكود إلى بريدك الالكترونى",
          // ToastAndroid.CENTER
          // )
          this.setState({
            codeSent: code,
          });
        }
      });
  }

  onInputCompleted = (text) => {
    this.sendcodeFun(text);
  };

  sendcodeFun(code) {
    var codeSent = this.state.codeSent;
    var userEmail = this.state.email;
    if (code != codeSent) {
      ToastAndroid.show(
        'هذا الكود غير صحيح من فضلك ادخل الكود صحيح',
        ToastAndroid.CENTER,
      );
    } else {
      this.props.navigation.navigate('NewPassword', {
        email: userEmail,
      });
    }
  }

  render() {
    return (
      <>
        <ScrollView style={{backgroundColor: '#fff'}}>
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

          {/* -------------- */}
          <View
            style={{
              width: '90%',
              marginHorizontal: '5%',
              alignItems: 'center',
              marginTop: 220,
            }}>
            <Text
              style={{
                // fontWeight: 'bold',
                fontSize: 15,
                fontFamily: FONTS.fontFamily,
              }}>
              ادخل الكود الذي تم ارساله الي الايميل التالي
            </Text>
            <Text style={{fontFamily: FONTS.fontFamily, fontSize: 17}}>
              {this.state.email}
            </Text>
          </View>
          {/* -------------- */}
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <SMSVerifyCode
              ref={(ref) => (this.verifycode = ref)}
              // containerPaddingHorizontal={30}
              focusedCodeViewBorderColor={COLORS.primary}
              verifyCodeLength={6}
              onInputCompleted={this.onInputCompleted}
            />
          </View>
          {/* -------------- */}
          <View
            style={{
              marginTop: '10%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{marginBottom: 5, fontFamily: FONTS.fontFamily}}>
              إذا لم يصلك الكود اضغط
            </Text>
            <TouchableOpacity
              disabled={this.state.Disable}
              onPress={() => {
                this.setState({
                  viewed: !this.state.viewed,
                  Disable: !this.state.Disable,
                });
              }}>
              <Text
                style={{
                  // fontWeight: 'bold',
                  fontSize: 15,
                  textAlign: 'center',
                  marginBottom: 5,
                  fontFamily: FONTS.fontFamily,
                }}>
                إعادة إرسال الرمز؟
              </Text>
            </TouchableOpacity>
            {/* ---------------------------------- */}
            {this.state.viewed ? (
              <View
                style={{
                  flexDirection: 'row',
                  // backgroundColor: 'yellow',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    paddingLeft: 10,
                    alignItems: 'center',
                    fontFamily: FONTS.fontFamily,
                  }}>
                  إعادة فى
                </Text>
                {/* <Text> */}
                <CountDown
                  // style={{width:20}}
                  size={20}
                  until={30}
                  onFinish={
                    () =>
                      this.setState({
                        viewed: !this.state.viewed,
                        Disable: !this.state.Disable,
                      })
                    // alert('Finished')
                  }
                  digitStyle={{backgroundColor: '#FFF'}}
                  digitTxtStyle={{color: '#1CC625'}}
                  timeToShow={['H']}
                  timeLabels={{s: null}}
                />
                {/* </Text> */}
              </View>
            ) : null}
            {/* --------------------------------------- */}
          </View>
          {/* -------------- */}
        </ScrollView>
      </>
    );
  }
}
