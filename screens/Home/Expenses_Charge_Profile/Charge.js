import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ToastAndroid,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Container, Spinner} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import numbro from 'numbro';
import {AppRequired, COLORS, FONTS, images} from '../../../constants';

export default class Charge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chargeCode: '',
      money: 0,
      codeError: '',
      loading: false,
      viewModalSuccessCharge: false,
      bottomConnectionMsg: new Animated.Value(-100),
      connection_Status: 'Offline',
      getBalanceLoading: true,
      isCharge: false,
    };
  }
  componentWillUnmount() {
    this._subscription && this._subscription();
  }

  componentDidMount() {
    this._subscription = NetInfo.addEventListener(
      this._handelConnectionInfoChange,
    );
    this.getCurrentBalence();
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

  getCurrentBalence = async () => {
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));

    let data_to_send = {
      student_id: StudentData.student_id,
      subject_id: drInfo.subject_id,
    };
    axios
      .post(AppRequired.Domain + 'select_balance.php', data_to_send)
      .then((res) => {
        if (res.status == 200) {
          if (res.data * 0 == 0) {
            this.setState({
              money: parseFloat(res.data),
              getBalanceLoading: false,
            });
          } else {
            ToastAndroid.showWithGravity(
              'عذرا حدث خطأ ما',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
            this.setState({getBalanceLoading: false});
          }
        } else {
          ToastAndroid.showWithGravity(
            'عذرا حدث خطأ ما',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          this.setState({getBalanceLoading: false});
        }
      });
  };

  // updateChargeMoney = async (moneyChage) => {

  //   let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));
  //   let moneyStudent = StudentData.studentMoney;
  //   let TotalAmount = parseFloat(moneyStudent) + parseFloat(moneyChage);

  //   StudentData.studentMoney = TotalAmount;

  //   await AsyncStorage.setItem('AllData', JSON.stringify(StudentData));

  // };

  CheckCode = async () => {
    let code = this.state.chargeCode;
    let studentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let drInfo = JSON.parse(await AsyncStorage.getItem('drInfo'));

    // alert(studentData);
    if (code == '') {
      this.setState({
        codeError: 'ادخل رقم الكارت من فضلك',
      });
    } else {
      if (code.length == 14 && code * 0 == 0) {
        this.setState({loading: true});

        let data_to_send = {
          code: this.state.chargeCode,
          student_id: studentData.student_id,
          subject_id: drInfo.subject_id,
        };

        axios
          .post(AppRequired.Domain + 'recharge_balance.php', data_to_send)
          .then(async (res) => {
            // alert(res.data);
            // this.setState({
            //   viewModalSuccessCharge: true,
            // });
            if (res.status == 200) {
              if (res.data == 'used_code') {
                this.setState({loading: false, chargeCode: ''});
                ToastAndroid.showWithGravity(
                  'تم شحن الكارت من قبل',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER,
                );
              } else if (res.data == 'invalid_code') {
                this.setState({loading: false});
                ToastAndroid.showWithGravity(
                  'الكود غير صحيح',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
              } else if (res.data * 0 == 0) {
                let studentData = JSON.parse(
                  await AsyncStorage.getItem('AllData'),
                );

                let newMoney =
                  parseFloat(this.state.money) + parseFloat(res.data);

                studentData.studentMoney = newMoney;
                await AsyncStorage.setItem(
                  'AllData',
                  JSON.stringify(studentData),
                );

                this.setState({
                  loading: false,
                  chargeCode: '',
                  money: newMoney,
                  viewModalSuccessCharge: true,
                  isCharge: true,
                });
                // ToastAndroid.showWithGravity(
                //   'تم شحن الرصيد بنجاح',
                //   ToastAndroid.SHORT,
                //   ToastAndroid.CENTER,
                // );
              }
            } else {
              this.setState({
                loading: false,
              });

              ToastAndroid.showWithGravity(
                'عذرا حدث خطأ ما',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
            }
          });
      } else {
        if (code * 0 != 0) {
          this.setState({
            codeError: 'الكود يحب ان يتكون من ارقام فقط ',
          });
        } else {
          this.setState({
            codeError: 'الكود يجب ان يكون 14 رقم',
          });
        }
      }
    }
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
      <>
        <Container>
          <StatusBar
            backgroundColor={COLORS.secondary}
            barStyle="light-content"
          />

          <ScrollView>
            <View
              style={{
                height: 300,
                width: '100%',
                backgroundColor: COLORS.primary,
                borderBottomRightRadius: 250,
              }}>
              <View style={{width: '90%', margin: '5%'}}>
                <Text
                  style={{
                    fontSize: 30,
                    color: '#FFF',
                    fontFamily: FONTS.fontFamily,
                  }}>
                  {''}
                  الرصيد والشحن
                </Text>
              </View>
              <View
                style={{
                  width: '90%',
                  margin: '5%',
                  justifyContent: 'space-between',
                  position: 'absolute',
                  bottom: 20,
                  flexDirection: 'row',
                  borderLeftWidth: 8,
                  borderLeftColor: '#FF8B00',
                  // borderRadius: ,
                  elevation: 1,
                  // backgroundColor: '#FF8B00',
                  backgroundColor: '#FFF',
                  padding: 20,
                }}>
                <View
                  style={{
                    alignItems: 'flex-start',
                    // marginLeft:20,
                    // alignItems: 'flex-start',
                    // justifyContent: 'flex-start',
                    // backgroundColor: 'red',
                    // flex:3
                  }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontFamily: FONTS.fontFamily,
                      color: '#000',
                    }}>
                    رصيدك الحالي
                  </Text>
                </View>

                <View style={{flex: 1, justifyContent: 'center'}}>
                  {this.state.getBalanceLoading ? (
                    <Spinner style={{height: 10}} color={COLORS.primary} />
                  ) : (
                    <>
                      <Text style={{fontSize: 20, marginRight: 20}}>
                        {/* {this.state.money}  */}
                        <Text
                          style={{
                            color: '#000',
                            fontSize: 25,
                            fontWeight: 'bold',
                            fontSize: 20,
                            marginRight: 20,
                          }}>
                          {numbro(this.state.money).format({
                            thousandSeparated: true,
                            // mantissa: 2,
                          })}
                        </Text>
                        <Text style={{color: '#000'}}> {''}LE</Text>
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.action}>
              <Image
                source={images.chargeIcon}
                style={{width: 40, height: 40, tintColor: COLORS.primary}}
              />

              <TextInput
                placeholder="ادخل رقم الكارت"
                style={styles.text_input}
                autoCapitalize="none"
                keyboardType="numeric"
                value={this.state.chargeCode}
                onChangeText={(value) => {
                  this.setState({emailerr: ''});
                  this.setState({
                    codeError: '',
                    chargeCode: value,
                  });
                }}></TextInput>
            </View>

            <View>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#f00',
                  // marginTop: -15,
                  marginBottom: 15,
                  fontFamily: FONTS.fontFamily,
                }}>
                {this.state.codeError}
              </Text>
            </View>

            <TouchableOpacity
              disabled={this.state.loading == true ? true : false}
              onPress={() => {
                this.CheckCode();
              }}
              style={{
                width: '90%',
                height: 50,
                marginTop: 5,
                backgroundColor: COLORS.primary,
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              {this.state.loading == false ? (
                <Text
                  style={{
                    fontSize: 20,
                    color: '#FFFFFF',
                    // fontWeight: 'bold',
                    fontFamily: FONTS.fontFamily,
                  }}>
                  شحن الرصيد
                </Text>
              ) : (
                <Spinner size={30} color="#fff" />
              )}
            </TouchableOpacity>
          </ScrollView>

          <Modal
            visible={this.state.viewModalSuccessCharge}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              this.setState({
                viewModalSuccessCharge: false,
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
                      viewModalSuccessCharge: false,
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

                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Icon
                    name="check-circle"
                    color="green"
                    size={40}
                    style={{opacity: 0.7, marginRight: 15}}
                  />

                  <Text style={{fontSize: 20, fontFamily: FONTS.fontFamily}}>
                    قد تم الشحن بنجاح
                  </Text>
                </View>
              </View>
            </View>
          </Modal>
          <ViewConnectionMsg ConnectionEnter="لا يوجد اتصال بالأنترنت" />
        </Container>
      </>
    );
  }
}

const styles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    marginTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    alignItems: 'center',
    width: '90%',
    margin: '5%',
  },
  text_input: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? 0 : -12,
    paddingLeft: 15,
    color: '#05375a',
    // backgroundColor:"#f00",
    textAlign: 'right',
    fontFamily: FONTS.fontFamily,
  },
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
