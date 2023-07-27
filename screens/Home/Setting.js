import * as React from 'react';
import {Container, Spinner} from 'native-base';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import {Toast, Root} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import {TextInput} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {AppRequired, COLORS, FONTS, SIZES} from '../../constants';
import {StatusBar} from 'react-native';

export default class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      student_name: '',
      student_id: '',
      student_email: '',
      student_phone: '',
      parent_phone: '',
      student_password: '',
      //
      openChangeInfoModal: false,
      modalType: '',
      //
      showOldPassword: false,
      showNewPassword: false,
      //
      new_Password: '',
      old_password: '',
      //
      new_name: '',
      new_email: '',
      newPersonal_phone: '',
      newParent_phone: '',
      requestLoading: false,
    };
  }

  async componentDidMount() {
    const student_data = JSON.parse(await AsyncStorage.getItem('AllData'));
    this.setState({
      student_name: student_data.student_name,
      student_email: student_data.student_email,
      student_phone: student_data.student_phone,
      parent_phone: student_data.parent_phone,
      student_password: student_data.student_password,
      student_id: student_data.student_id,
      new_name: student_data.student_name,
      new_email: student_data.student_email,
      newPersonal_phone: student_data.student_phone,
      newParent_phone: student_data.parent_phone,
    });
  }

  changeParentPhone = () => {
    let data_to_send = {
      student_id: this.state.student_id,
      parent_phone: this.state.newParent_phone,
    };

    if (this.state.newParent_phone.trim() == this.state.parent_phone.trim()) {
      ToastAndroid.showWithGravityAndOffset(
        'يجب ادخال رقم هاتف جديد',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }

    if (
      (this.state.newParent_phone.startsWith('010') ||
        this.state.newParent_phone.startsWith('011') ||
        this.state.newParent_phone.startsWith('012') ||
        this.state.newParent_phone.startsWith('015') ||
        this.state.newParent_phone.startsWith('002') ||
        this.state.newParent_phone.startsWith('+2')) &&
      this.state.newParent_phone.length >= 11 &&
      this.state.newParent_phone.length <= 14
    ) {
      console.log('success phone');
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'يجب ادخال رقم الهاتف صحيح',
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
      .post(AppRequired.Domain + 'update_parent_phone.php', data_to_send)
      .then(async (res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            this.setState({
              parent_phone: this.state.newParent_phone,
            });
            let student_data = JSON.parse(
              await AsyncStorage.getItem('AllData'),
            );
            let data_copy = student_data;
            data_copy.parent_phone = this.state.newParent_phone;
            student_data = data_copy;
            await AsyncStorage.setItem('AllData', JSON.stringify(student_data));

            Toast.show({
              text: 'تم تغيير رقم الهاتف بنجاح',
              buttonText: 'Okay',
              type: 'success',
              buttonTextStyle: {color: '#008000'},
              buttonStyle: {backgroundColor: '#5cb85c'},
            });
          } else if (res.data == 'not_authorized') {
            ToastAndroid.showWithGravityAndOffset(
              'حدث خطأ فى إرسال البيانات الرجاء تسجيل الخروج ثم اعد المحاوله',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'error') {
            ToastAndroid.showWithGravityAndOffset(
              'عفواً حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
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
      .finally(async () => {
        this.setState({
          openChangeInfoModal: false,
          requestLoading: false,
        });
      });
  };

  changePersonalPhone = () => {
    let data_to_send = {
      student_id: this.state.student_id,
      student_phone: this.state.newPersonal_phone,
    };
    if (
      this.state.newPersonal_phone.trim() == this.state.student_phone.trim()
    ) {
      ToastAndroid.showWithGravityAndOffset(
        'يجب ادخال رقم هاتف جديد',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }

    if (
      (this.state.newPersonal_phone.startsWith('010') ||
        this.state.newPersonal_phone.startsWith('011') ||
        this.state.newPersonal_phone.startsWith('012') ||
        this.state.newPersonal_phone.startsWith('015') ||
        this.state.newPersonal_phone.startsWith('002') ||
        this.state.newPersonal_phone.startsWith('+2')) &&
      this.state.newPersonal_phone.length >= 11 &&
      this.state.newPersonal_phone.length <= 14
    ) {
      console.log('success phone');
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'يجب ادخال رقم الهاتف صحيح',
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
      .post(AppRequired.Domain + 'update_student_phone.php', data_to_send)
      .then(async (res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            this.setState({
              student_phone: this.state.newPersonal_phone,
            });
            let student_data = JSON.parse(
              await AsyncStorage.getItem('AllData'),
            );
            let data_copy = student_data;
            data_copy.student_phone = this.state.newPersonal_phone;
            student_data = data_copy;
            await AsyncStorage.setItem('AllData', JSON.stringify(student_data));
            Toast.show({
              text: 'تم تغيير الهاتف بنجاح',
              buttonText: 'Okay',
              type: 'success',
              buttonTextStyle: {color: '#008000'},
              buttonStyle: {backgroundColor: '#5cb85c'},
            });
          } else if (res.data == 'not_authorized') {
            ToastAndroid.showWithGravityAndOffset(
              'حدث خطأ فى إرسال البيانات الرجاء تسجيل الخروج ثم اعد المحاوله',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'error') {
            ToastAndroid.showWithGravityAndOffset(
              'عفواً حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
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
      .finally(async () => {
        this.setState({
          openChangeInfoModal: false,
          requestLoading: false,
        });
      });
  };
  validate = (text) => {
    let reg = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };
  changeEmail = () => {
    let data_to_send = {
      student_id: this.state.student_id,
      student_email: this.state.new_email.trim(),
    };

    if (this.validate(this.state.new_email.trim())) {
      console.log('valid email');
    } else {
      ToastAndroid.showWithGravityAndOffset(
        'ادخل بريد الكتروني صحيح',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }

    if (this.state.student_email.trim() == this.state.new_email.trim()) {
      ToastAndroid.showWithGravityAndOffset(
        'يجب إدخال ايميل جديد',
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
      .post(AppRequired.Domain + 'update_student_email.php', data_to_send)
      .then(async (res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            this.setState({
              student_email: this.state.new_email,
            });
            let student_data = JSON.parse(
              await AsyncStorage.getItem('AllData'),
            );
            let data_copy = student_data;
            data_copy.student_email = this.state.new_email;
            student_data = data_copy;
            await AsyncStorage.setItem('AllData', JSON.stringify(student_data));
            Toast.show({
              text: 'تم تغيير الايميل بنجاح',
              buttonText: 'Okay',
              type: 'success',
              buttonTextStyle: {color: '#008000'},
              buttonStyle: {backgroundColor: '#5cb85c'},
            });
          } else if (res.data == 'not_authorized') {
            ToastAndroid.showWithGravityAndOffset(
              'حدث خطأ فى إرسال البيانات الرجاء تسجيل الخروج ثم اعد المحاوله',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'error') {
            ToastAndroid.showWithGravityAndOffset(
              'عفواً حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
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
      .finally(async () => {
        this.setState({
          openChangeInfoModal: false,
          requestLoading: false,
        });
      });
  };

  changeName = () => {
    let data_to_send = {
      student_id: this.state.student_id,
      student_name: this.state.new_name.trim(),
    };
    if (this.state.new_name.trim().length < 2) {
      ToastAndroid.showWithGravityAndOffset(
        'يجب ان يكون الاسم اكثر من حرفين على الأقل',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }

    if (this.state.student_name.trim() == this.state.new_name.trim()) {
      ToastAndroid.showWithGravityAndOffset(
        'يجب إدخال إسم جديد',
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
      .post(AppRequired.Domain + 'update_student_name.php', data_to_send)
      .then(async (res) => {
        if (res.status == 200) {
          if (res.data == 'success') {
            this.setState({
              student_name: this.state.new_name,
            });
            let student_data = JSON.parse(
              await AsyncStorage.getItem('AllData'),
            );
            let data_copy = student_data;
            data_copy.student_name = this.state.new_name;
            student_data = data_copy;
            await AsyncStorage.setItem('AllData', JSON.stringify(student_data));
            Toast.show({
              text: 'تم تغيير الاسم بنجاح',
              buttonText: 'Okay',
              type: 'success',
              buttonTextStyle: {color: '#008000'},
              buttonStyle: {backgroundColor: '#5cb85c'},
            });
          } else if (res.data == 'not_authorized') {
            ToastAndroid.showWithGravityAndOffset(
              'حدث خطأ فى إرسال البيانات الرجاء تسجيل الخروج ثم اعد المحاوله',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'error') {
            ToastAndroid.showWithGravityAndOffset(
              'عفواً حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
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
      .finally(async () => {
        this.setState({
          openChangeInfoModal: false,
          requestLoading: false,
        });
      });
  };

  changePassword = () => {
    let data_to_send = {
      student_id: this.state.student_id,
      student_password: this.state.old_password,
      new_password: this.state.new_Password,
    };

    if (this.state.old_password.trim() == '') {
      ToastAndroid.showWithGravityAndOffset(
        'يجب إدخال كلمه المرور القديمه',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }

    if (this.state.new_Password.trim() == '') {
      ToastAndroid.showWithGravityAndOffset(
        'يجب إدخال كلمه المرور الجديده',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }

    if (this.state.old_password.trim().length < 6) {
      ToastAndroid.showWithGravityAndOffset(
        'كلمه المرور تتكون من 6 احرف او اكثر',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }
    if (this.state.new_Password.trim().length < 6) {
      ToastAndroid.showWithGravityAndOffset(
        'كلمه المرور تتكون من 6 احرف او اكثر',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      );
      return 0;
    }

    if (this.state.old_password.trim() == this.state.new_Password.trim()) {
      ToastAndroid.showWithGravityAndOffset(
        'عفواً يجب تغيير إحدى كلمتى المرور',
        ToastAndroid.LONG,
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
      .post(AppRequired.Domain + 'update_student_password.php', data_to_send)
      .then(async (res) => {
        if (res.status == 200) {
          console.log(res.data);
          if (res.data == 'success') {
            let student_data = JSON.parse(
              await AsyncStorage.getItem('AllData'),
            );
            let data_copy = student_data;
            data_copy.student_password = this.state.new_Password;
            student_data = data_copy;
            await AsyncStorage.setItem('AllData', JSON.stringify(student_data));
            Toast.show({
              text: 'تم تغيير كلمه المرور بنجاح',
              buttonText: 'Okay',
              type: 'success',
              buttonTextStyle: {color: '#008000'},
              buttonStyle: {backgroundColor: '#5cb85c'},
            });
          } else if (res.data == 'error') {
            ToastAndroid.showWithGravityAndOffset(
              'عفواً حدث خطأ ما الرجاء المحاوله فى وقت لاحق',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'wrong_pass') {
            ToastAndroid.showWithGravityAndOffset(
              'كلمه المرور التى ادخلتها غير صحيحه',
              ToastAndroid.LONG,
              ToastAndroid.CENTER,
              25,
              50,
            );
          } else if (res.data == 'not_authorized') {
            ToastAndroid.showWithGravityAndOffset(
              'حدث خطأ فى إرسال البيانات الرجاء تسجيل الخروج ثم اعد المحاوله',
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
      .finally(async () => {
        this.setState({
          old_password: '',
          new_Password: '',
          openChangeInfoModal: false,
          requestLoading: false,
          showNewPassword: false,
          showOldPassword: false,
        });
      });
  };

  render() {
    return (
      <Container style={styles.containerstyle}>
        <StatusBar
          backgroundColor={COLORS.secondary}
          barStyle="light-content"
        />
        <Root>
          <ScrollView>
            <View
              style={{
                width: SIZES.width,
                height: SIZES.height * 0.1,
                backgroundColor: COLORS.primary,
                borderBottomLeftRadius: 50,
                borderBottomRightRadius: 50,
                flexDirection: 'row',
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
                    style={{fontSize: 26, color: '#fff', marginLeft: 10}}
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
                    fontSize: 22,
                  }}>
                  الإعدادات
                </Text>
              </View>
              <View style={{flex: 1}} />
            </View>

            <View
              style={{
                marginLeft: 10,
                marginTop: 15,
                // backgroundColor: '#253'
              }}>
              <Text style={{fontFamily: FONTS.fontFamily, fontSize: 20}}>
                مرحباً: {this.state.student_name}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  ...styles.itemContainer,
                }}
                onPress={() => {
                  this.setState({
                    openChangeInfoModal: true,
                    modalType: 'name',
                  });
                }}>
                <Text style={{...styles.inbox_text}}>تغيير الاسم</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  ...styles.itemContainer,
                }}
                onPress={() => {
                  this.setState({
                    openChangeInfoModal: true,
                    modalType: 'email',
                  });
                }}>
                <Text
                  style={{
                    ...styles.inbox_text,
                  }}>
                  تغيير الايميل
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  ...styles.itemContainer,
                }}
                onPress={() => {
                  this.setState({
                    openChangeInfoModal: true,
                    modalType: 'personal_phone',
                  });
                }}>
                <Text
                  style={{
                    ...styles.inbox_text,
                  }}>
                  تغيير رقم الهاتف
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  ...styles.itemContainer,
                }}
                onPress={() => {
                  this.setState({
                    openChangeInfoModal: true,
                    modalType: 'parent_phone',
                  });
                }}>
                <Text
                  style={{
                    ...styles.inbox_text,
                  }}>
                  تغيير رقم هاتف ولى الأمر
                </Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  ...styles.itemContainer,
                }}
                onPress={() => {
                  this.setState({
                    openChangeInfoModal: true,
                    modalType: 'password',
                  });
                }}>
                <Text
                  style={{
                    ...styles.inbox_text,
                  }}>
                  تغيير كلمه المرور
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <Modal
            visible={this.state.openChangeInfoModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              this.setState({
                openChangeInfoModal: false,
              });
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,.5)',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {this.state.modalType == 'password' ? (
                <>
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
                        style={{...styles.passwordTextModal, marginLeft: 10}}>
                        أدخل كلمه المرور القديمه
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TextInput
                          autoFocus={true}
                          theme={{
                            colors: {
                              primary: COLORS.primary,
                              underlineColor: 'transparent',
                            },
                          }}
                          right={() => {
                            return;
                          }}
                          value={this.state.old_password}
                          label={'كلمه المرور القديمه'}
                          autoCapitalize={'none'}
                          secureTextEntry={!this.state.showOldPassword}
                          onChangeText={(text) => {
                            this.setState({
                              old_password: text,
                            });
                          }}
                          autoCorrect={false}
                          style={{
                            width: '90%',
                            alignSelf: 'center',
                            margin: '5%',
                            paddingRight: 30,
                          }}
                        />
                        <TouchableOpacity
                          style={{
                            position: 'absolute',
                            right: '10%',
                            top: '40%',
                          }}
                          onPress={() => {
                            this.setState({
                              showOldPassword: !this.state.showOldPassword,
                            });
                          }}>
                          <Icon
                            name={
                              this.state.showOldPassword ? 'eye' : 'eye-slash'
                            }
                            size={20}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View>
                      <Text
                        style={{...styles.passwordTextModal, marginLeft: 10}}>
                        أدخل كلمه المرور الجديده
                      </Text>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <TextInput
                          theme={{
                            colors: {
                              primary: COLORS.primary,
                              underlineColor: 'transparent',
                            },
                          }}
                          value={this.state.new_Password}
                          secureTextEntry={!this.state.showNewPassword}
                          label={'كلمه المرور الجديده'}
                          autoCapitalize={'none'}
                          onChangeText={(text) => {
                            this.setState({
                              new_Password: text,
                            });
                          }}
                          autoCorrect={false}
                          style={{
                            width: '90%',
                            alignSelf: 'center',
                            margin: '5%',
                            paddingRight: 30,
                          }}
                        />
                        <TouchableOpacity
                          style={{
                            position: 'absolute',
                            right: '10%',
                            top: '40%',
                          }}
                          onPress={() => {
                            this.setState({
                              showNewPassword: !this.state.showNewPassword,
                            });
                          }}>
                          <Icon
                            name={
                              this.state.showNewPassword ? 'eye' : 'eye-slash'
                            }
                            size={20}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                      }}>
                      <TouchableOpacity
                        disabled={this.state.requestLoading}
                        onPress={() => {
                          this.changePassword();
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
                              ...styles.passwordTextModal,
                              color: '#fff',
                            }}>
                            تغيير
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        disabled={this.state.requestLoading}
                        onPress={() => {
                          this.setState({
                            openChangeInfoModal: false,
                            old_password: '',
                            new_Password: '',
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
                          style={{...styles.passwordTextModal, color: '#fff'}}>
                          إلغاء
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : this.state.modalType == 'name' ? (
                <>
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
                        style={{...styles.passwordTextModal, marginLeft: 10}}>
                        أدخل الاسم الجديد
                      </Text>

                      <TextInput
                        autoFocus={true}
                        theme={{
                          colors: {
                            primary: COLORS.primary,
                            underlineColor: 'transparent',
                          },
                        }}
                        value={this.state.new_name}
                        label={'الاسم بالكامل'}
                        autoCapitalize={'none'}
                        onChangeText={(text) => {
                          this.setState({
                            new_name: text,
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
                          this.changeName();
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
                              ...styles.passwordTextModal,
                              color: '#fff',
                            }}>
                            تغيير
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        disabled={this.state.requestLoading}
                        onPress={() => {
                          this.setState({
                            openChangeInfoModal: false,
                            new_name: this.state.student_name,
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
                          style={{...styles.passwordTextModal, color: '#fff'}}>
                          إلغاء
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : this.state.modalType == 'email' ? (
                <>
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
                        style={{...styles.passwordTextModal, marginLeft: 10}}>
                        أدخل الايميل الجديد
                      </Text>

                      <TextInput
                        autoFocus={true}
                        theme={{
                          colors: {
                            primary: COLORS.primary,
                            underlineColor: 'transparent',
                          },
                        }}
                        value={this.state.new_email}
                        label={'الايميل'}
                        autoCapitalize={'none'}
                        onChangeText={(text) => {
                          this.setState({
                            new_email: text,
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
                          this.changeEmail();
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
                              ...styles.passwordTextModal,
                              color: '#fff',
                            }}>
                            تغيير
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        disabled={this.state.requestLoading}
                        onPress={() => {
                          this.setState({
                            openChangeInfoModal: false,
                            new_email: this.state.student_email,
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
                          style={{...styles.passwordTextModal, color: '#fff'}}>
                          إلغاء
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : this.state.modalType == 'personal_phone' ? (
                <>
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
                        style={{...styles.passwordTextModal, marginLeft: 10}}>
                        أدخل رقم الهاتف الجديد
                      </Text>

                      <TextInput
                        autoFocus={true}
                        theme={{
                          colors: {
                            primary: COLORS.primary,
                            underlineColor: 'transparent',
                          },
                        }}
                        value={this.state.newPersonal_phone}
                        label={'رقم الهاتف'}
                        autoCapitalize={'none'}
                        onChangeText={(text) => {
                          this.setState({
                            newPersonal_phone: text,
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
                          this.changePersonalPhone();
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
                              ...styles.passwordTextModal,
                              color: '#fff',
                            }}>
                            تغيير
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        disabled={this.state.requestLoading}
                        onPress={() => {
                          this.setState({
                            openChangeInfoModal: false,
                            newPersonal_phone: this.state.student_phone,
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
                          style={{...styles.passwordTextModal, color: '#fff'}}>
                          إلغاء
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : this.state.modalType == 'parent_phone' ? (
                <>
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
                        style={{...styles.passwordTextModal, marginLeft: 10}}>
                        أدخل رقم الهاتف الجديد
                      </Text>

                      <TextInput
                        autoFocus={true}
                        theme={{
                          colors: {
                            primary: COLORS.primary,
                            underlineColor: 'transparent',
                          },
                        }}
                        value={this.state.newParent_phone}
                        label={'رقم الهاتف'}
                        autoCapitalize={'none'}
                        onChangeText={(text) => {
                          this.setState({
                            newParent_phone: text,
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
                          this.changeParentPhone();
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
                              ...styles.passwordTextModal,
                              color: '#fff',
                            }}>
                            تغيير
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        disabled={this.state.requestLoading}
                        onPress={() => {
                          this.setState({
                            openChangeInfoModal: false,
                            newParent_phone: this.state.parent_phone,
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
                          style={{...styles.passwordTextModal, color: '#fff'}}>
                          إلغاء
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : null}
            </View>
          </Modal>
        </Root>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  containerstyle: {
    height: '100%',
    width: '100%',
    backgroundColor: '#F9F9F9',
  },
  passwordTextModal: {
    fontSize: 18,
    fontFamily: FONTS.fontFamily,
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 4,
    backgroundColor: COLORS.primary,
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 10,
    padding: 7,
    overflow: 'hidden',
  },
  inbox_text: {
    fontFamily: FONTS.fontFamily,
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
});
