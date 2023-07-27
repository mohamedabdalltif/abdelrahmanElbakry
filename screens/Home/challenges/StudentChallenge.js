import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Modal,
  Dimensions,
  Image,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {TextInput} from 'react-native-gesture-handler';
import {Container, Picker, Form, Spinner, Item} from 'native-base';
// import CheckBox from '@react-native-community/checkbox';
import axios from 'axios';
const {width, height} = Dimensions.get('window');

import {AppRequired, COLORS, FONTS} from '../../../constants';

export default class StudentChallenge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      atlistchoice: false,
      choice: false,
      visibleModal: false,
      allcheck: false,
      radio_props: [],
      loading_name_charcter: false,
      loading_buttom: false,
      disabled: true,
      paymentVisable: false,
      requestMassage: '',
      choices_chapter: '',
      clicked: false,
      allClicked: false,
      showCapters: false,
      chargeCode: '',
    };
  }

  changevalue(index) {
    let data = this.state.radio_props;

    if (data[index].value == false) {
      data[index].value = true;
    } else {
      data[index].value = false;
    }
    this.setState({
      data: data,
      allClicked: false,
      atlistchoice: true,
      choices_chapter: '',
    });

    var counter = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].value == false) {
        counter++;
      }
    }

    if (counter == data.length) {
      this.setState({atlistchoice: false, choice: false});
    }
  }

  allcheck() {
    let data = this.state.radio_props;

    var counter = 0;

    if (this.state.allClicked == true) {
      this.setState({allClicked: false});
    } else {
      this.setState({allClicked: true});
    }
    if (this.state.allClicked == false) {
      for (let i = 0; i < data.length; i++) {
        data[i].value = true;
        // data[i].color = Constants.choicesColor1;
        // this.setState({ allClicked: false });
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        data[i].value = false;
        // data[i].color = Constants.choicesColor1;
        // this.setState({ allClicked: false });
        counter--;
      }
    }

    if (counter == data.length) {
      this.setState({atlistchoice: false, choice: false});
    }

    this.setState({radio_props: data});
  }

  componentDidMount() {
    this.getdata();
    // this.addKeyColor();
  }

  getdata() {
    axios.get(AppRequired.Domain + 'select_chapterts.php').then((res) => {
      if (res.status == 200) {
        if (res.data.length > 0) {
          this.setState({
            radio_props: res.data,
            loading_name_charcter: true,
            disabled: false,
          });
          this.getValue();
        } else {
          this.setState({
            radio_props: [],
            loading_name_charcter: true,
            disabled: false,
          });
        }
      }
    });
  }

  async gochallenge() {
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));

    let data_to_send = {
      challange_category: this.state.choices_chapter,
      challange_sender_id: StudentData.student_id,
      challange_receiver_id: this.state.chargeCode,
    };

    if (this.state.choices_chapter == '') {
      ToastAndroid.showWithGravity(
        'برجاء اختيار فصول التحدى',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER, // +++ i make it BOTTOM instead of CENTER
      );
    } else if (
      this.state.chargeCode == StudentData.student_id ||
      this.state.chargeCode == ''
    ) {
      ToastAndroid.showWithGravity(
        'برجاء إدخال كود صديقك',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER, // +++ i make it BOTTOM instead of CENTER
      );
    } else {
      this.setState({loading_buttom: true});

      axios
        .post(AppRequired.Domain + '/challenge/add_challange.php', data_to_send)
        .then((res) => {
          if (res.status == 200) {
            if (res.data == 'not_same') {
              this.setState({
                requestMassage: 'هذا الكود غير موجود في مجموعتك',
                paymentVisable: true,
                loading_buttom: false,
                choice: false,
              });
            } else if (res.data == 'not_authorized') {
              this.setState({
                requestMassage: 'هذا الكود غير موجود ',
                paymentVisable: true,
                loading_buttom: false,
                choice: false,
              });
            } else if (res.data == 'error') {
              this.setState({
                requestMassage: 'حدث خطأ ما حاول في وقت لاحق',
                paymentVisable: true,
                loading_buttom: false,
                choice: false,
              });
            } else if (res.data == 're_full') {
              this.setState({
                requestMassage: 'لقد اتممت عدد التحديات المسموح بها اليوم',
                paymentVisable: true,
                loading_buttom: false,
                choice: false,
              });
            } else if (res.data == 'se_full') {
              this.setState({
                requestMassage: 'لقد قمت بتحدى اليوم الرجاء المحاوله غداً',
                paymentVisable: true,
                loading_buttom: false,
                choice: false,
              });
            } else if (res.data == 'empty_points') {
              this.setState({
                requestMassage: 'لايوجد لديك نقاط لبدء التحدى',
                paymentVisable: true,
                loading_buttom: false,
                choice: false,
              });
            } else {
              if (res.data == 'success') {
                this.setState({
                  requestMassage: 'تم انشاء التحدي في انتظار موافقة صديقك',
                  paymentVisable: true,
                  loading_buttom: false,
                  choice: false,
                  chargeCode: '',
                  choices_chapter: '',
                  atlistchoice: false,
                  choice: false,
                  showCapters: false,
                  // radio_props:[]
                });
                this.props.navigation.navigate('ChallengePages');
              }
            }
          } else {
            this.setState({
              requestMassage: 'حدث خطأ ما حاول في وقت لاحق',
              paymentVisable: true,
              loading_buttom: false,
              choice: false,
            });
          }
        })
        .finally(() => {
          let data = this.state.radio_props;
          data.map((item) => (item.value = false));
          this.setState({
            radio_props: data,
          });
        });
    }
  }

  savechoice() {
    let data = this.state.radio_props;
    let length = data.length;
    let save = '',
      count = 0,
      last_index = 0;
    for (let z = 0; z < length; z++) {
      if (data[z].value == true) {
        count++;
        last_index = z;
      }
    }

    for (let i = 0; i < length; i++) {
      if (data[i].value == true) {
        if (count > 1) {
          if (i == length - 1) {
            save += data[i].chapter_id;
          } else {
            if (last_index == i) {
              save += data[i].chapter_id;
            } else {
              save += data[i].chapter_id + '//CAMP//';
            }
          }
        } else {
          save += data[i].chapter_id;
        }
      }
    }
    this.setState({choices_chapter: save});
  }

  getValue() {
    let data = this.state.radio_props;

    for (let i = 0; i < data.length; i++) {
      data[i].value = false;
    }
    this.setState({data: data});
  }

  render() {
    return (
      <>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <StatusBar ///"#8A3982"
            backgroundColor={COLORS.secondary}
            barStyle="light-content"
            // translucent={true}
          ></StatusBar>

          <View
            style={{
              width: width,
              height: height * 0.1,
              backgroundColor: COLORS.primary,
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
              flexDirection: 'row',
            }}>
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}>
                <Icon
                  name="arrow-right"
                  style={{fontSize: 24, color: '#fff', marginLeft: 10}}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{flex: 2, alignItems: 'center', justifyContent: 'center'}}>
              <Text
                style={{
                  fontFamily: FONTS.fontFamily,
                  color: '#fff',
                  fontSize: 19,
                }}>
                تحدى صديق
              </Text>
            </View>
            <View style={{flex: 1}} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                width: '90%',
                backgroundColor: '#fff',
                alignSelf: 'center',
                borderRadius: 15,
                // marginTop: 10,
                elevation: 10,
                paddingVertical: 15,
                marginVertical: 20,
                // height:200,
                // alignItems:'center',
                justifyContent: 'center',
              }}>
              <View>
                <Text
                  style={{
                    marginLeft: 10,
                    marginTop: 10,
                    fontSize: 20,
                    fontFamily: FONTS.fontFamily,
                  }}>
                  ادخل كود صديقك
                </Text>
              </View>

              <View
                style={{
                  width: '90%',
                  height: height * 0.07,
                  // backgroundColor: '#DCDEDD',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginVertical: 30,
                  // marginBottom: height * 0.04,
                }}>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    width: '15%',
                    height: height * 0.07,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // borderRightWidth:2,
                    // borderRightColor:'#ddd'
                  }}>
                  <FontAwesomeIcon
                    color={COLORS.primary}
                    name="barcode"
                    size={30}
                  />
                </View>
                <View
                  style={{
                    backgroundColor: '#F7f7f7',
                    width: '84%',
                    height: height * 0.07,
                    borderRadius: 10,
                  }}>
                  <TextInput
                    placeholder="ادخل كود التحدى"
                    keyboardType="number-pad"
                    style={{
                      paddingRight: 15,
                      textAlign: 'center',
                      fontFamily: FONTS.fontFamily,
                      fontSize: 17,
                    }}
                    value={this.state.chargeCode}
                    onChangeText={(value) => {
                      this.setState({chargeCode: value});
                    }}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.gochallenge();
                }}
                style={{width: '100%'}}>
                <View
                  style={{
                    width: '80%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: COLORS.primary,
                    alignSelf: 'center',
                    marginVertical: 10,
                    borderRadius: 10,
                  }}>
                  {this.state.loading_buttom == false ? (
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        fontStyle: 'normal',
                      }}>
                      التحدى
                    </Text>
                  ) : (
                    <View
                      style={{
                        alignSelf: 'center',
                        justifyContent: 'center',
                      }}>
                      <Spinner size={30} color="#fff" />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View style={{padding: 7, width: '90%', alignSelf: 'center'}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  padding: 7,
                  width: '100%',
                  alignSelf: 'center',
                  backgroundColor: COLORS.primary,
                }}
                onPress={() => {
                  if (this.state.radio_props.length == 0) {
                    ToastAndroid.showWithGravityAndOffset(
                      'عفواً لا توجد فصول متاحه للتحدى',
                      ToastAndroid.LONG,
                      ToastAndroid.CENTER,
                      25,
                      50,
                    );
                  } else {
                    this.setState({showCapters: !this.state.showCapters});
                  }
                }}>
                <View style={{flex: 4, paddingLeft: 20}}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: FONTS.fontFamily,
                      fontSize: 18,
                    }}>
                    أختر فصول التحدى
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View>
                    {this.state.showCapters ? (
                      <Icon name="minus" size={24} color="#fff" />
                    ) : (
                      <Icon name="plus" size={24} color="#fff" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              {this.state.showCapters ? (
                <View
                  style={{
                    marginTop: 10,
                    padding: 7,
                    borderRadius: 10,
                    backgroundColor: '#f7f7f7',
                    marginBottom: 40,
                  }}>
                  {this.state.loading_name_charcter == true ? (
                    // -----------------------------------------------------------------

                    <View style={styles.choicesContainer}>
                      <TouchableOpacity
                        style={[
                          styles.ChooseAll,
                          {
                            backgroundColor:
                              this.state.allClicked == true
                                ? COLORS.primary
                                : '#fff',
                          },
                        ]}
                        onPress={() => {
                          this.allcheck();
                          this.savechoice();
                        }}>
                        <View
                          style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            marginTop: 20,
                            transform: [{rotate: '-45deg'}],
                          }}>
                          <Text
                            style={{
                              fontFamily: FONTS.fontFamily,
                              textAlign: 'center',
                              color:
                                this.state.allClicked == false
                                  ? COLORS.primary
                                  : '#fff',
                            }}>
                            كافة المنهج
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View style={{paddingVertical: 15, marginLeft: 20}}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontFamily: FONTS.fontFamily,
                          }}>
                          الفصول
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          // width: '100%',
                          justifyContent: 'space-around',
                        }}>
                        {this.state.radio_props.map((item, index) => (
                          <TouchableOpacity
                            style={[
                              {
                                width: 70,
                                height: 70,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginVertical: 15,
                                borderRadius: 15,
                                transform: [{rotate: '46deg'}],
                                elevation: 3,
                                marginHorizontal: 10,
                                // marginHorizontal: 50
                                // flexDirection:'row',
                                // flexWrap:'wrap'
                              },
                              {
                                backgroundColor:
                                  item.value == true ? COLORS.primary : '#fff',

                                alignSelf:
                                  index + (1 % 2) != 0
                                    ? 'flex-start'
                                    : 'flex-end',
                              },
                            ]}
                            onPress={() => {
                              this.changevalue(index);
                              this.savechoice();
                            }}>
                            <View
                              style={{
                                position: 'absolute',
                                alignSelf: 'center',
                                marginTop: 20,
                                transform: [{rotate: '-45deg'}],
                              }}>
                              <Text
                                style={{
                                  textAlign: 'center',
                                  color:
                                    item.value == false
                                      ? COLORS.primary
                                      : '#fff',
                                }}>
                                {' '}
                                {index + 1}{' '}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ) : (
                    <>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 20,
                          alignSelf: 'center',
                        }}>
                        <Spinner size={35} color={COLORS.primary} />
                      </View>
                    </>
                  )}

                  {/* <TouchableOpacity
                      disabled={this.state.disabled}
                      onPress={() => {
                        this.savechoice();

                        if (
                          this.state.allClicked == true ||
                          this.state.atlistchoice == true
                        ) {
                          this.setState({ visibleModal: false, choice: true, showCapters: false });
                        } else {
                          ToastAndroid.showWithGravity(
                            'برجاء اختيار الفصل',
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER,  // +++ i make it BOTTOM instead of CENTER
                          );
                        }
                      }}
                      style={{ width: '100%' }}>
                      <View
                        style={{
                          width: '80%',
                          height: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: COLORS.primary,
                          alignSelf: 'center',
                          marginTop: 30,
                          marginBottom: 15,
                          borderRadius: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 18,
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            fontStyle: 'normal',
                          }}>
                          تأكيد الأختيار
                        </Text>
                      </View>
                    </TouchableOpacity>
 */}
                </View>
              ) : null}
            </View>

            {/* <View
            style={{ position: 'absolute', bottom: 0, alignSelf: 'center', width: '90%' }}
          >
            {this.state.choice == false ? (
              <TouchableOpacity
                onPress={() => {
                  this.setState({ visibleModal: true });
                }}
                style={{ width: '100%' }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#00f',
                    fontWeight: 'bold',
                    fontStyle: 'normal',
                    alignSelf: 'center',
                    marginBottom: 20,
                  }}>
                  اضغط لاختيار فصل التحدي
                  </Text>
              </TouchableOpacity>
            ) : (
                <>
                  <View style={{ flexDirection: 'row', marginBottom: 10, alignSelf: 'center' }}>
                    <Text style={{ marginLeft: 10, fontSize: 16 }}>
                      تم اختيار فصول التحدي
                      </Text>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ visibleModal: true });
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          marginLeft: 2,
                          color: '#00f',
                          borderBottomWidth: 0.5,
                          borderBottomColor: '#00f',
                        }}>
                        تعديل
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      this.gochallenge();
                      this.setState({ loading_buttom: true });
                    }}
                    style={{ width: '100%' }}>
                    <View
                      style={{
                        width: '80%',
                        height: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: COLORS.primary,
                        alignSelf: 'center',
                        marginBottom: 20,
                        marginTop: 20,
                        borderRadius: 10,
                      }}>
                      {this.state.loading_buttom == false ? (
                        <Text
                          style={{
                            fontSize: 18,
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            fontStyle: 'normal',
                          }}>
                          التحدي
                        </Text>
                      ) : (
                          <View
                            style={{
                              alignSelf: 'center',
                              justifyContent: 'center',
                            }}>
                            <Spinner size={30} color="#fff" />
                          </View>
                        )}
                    </View>
                  </TouchableOpacity>
                </>
              )}
          </View> */}
          </ScrollView>
        </View>

        <Modal
          transparent={true}
          visible={this.state.visibleModal}
          animationType="slide"
          onRequestClose={() => {
            this.setState({visibleModal: false});
          }}>
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              backgroundColor: '#fff',
              alignSelf: 'center',
              bottom: 0,
              // borderTopLeftRadius: 25, borderTopRightRadius: 25,
              overflow: 'hidden',
            }}>
            <View
              style={{
                width: '100%',
                height: 60,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.primary,
              }}>
              <Text style={{fontSize: 25, fontWeight: '500', color: '#fff'}}>
                فصول التحدي
              </Text>
            </View>
            <ScrollView>
              {this.state.loading_name_charcter == true ? (
                // -----------------------------------------------------------------

                <View style={styles.choicesContainer}>
                  <TouchableOpacity
                    style={[
                      styles.ChooseAll,
                      {
                        backgroundColor:
                          this.state.allClicked == true
                            ? COLORS.primary
                            : '#fff',
                      },
                    ]}
                    onPress={() => {
                      this.allcheck();
                      this.savechoice();
                    }}>
                    <View
                      style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        marginTop: 20,
                        transform: [{rotate: '-45deg'}],
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color:
                            this.state.allClicked == false
                              ? COLORS.primary
                              : '#fff',
                        }}>
                        كافة المنهج
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={{paddingVertical: 15, marginLeft: 20}}>
                    <Text style={{fontSize: 20}}>الفصول</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      width: '100%',
                      justifyContent: 'space-evenly',
                    }}>
                    {this.state.radio_props.map((item, index) => (
                      <TouchableOpacity
                        style={[
                          {
                            width: 70,
                            height: 70,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginVertical: 15,
                            borderRadius: 15,
                            transform: [{rotate: '46deg'}],
                            elevation: 3,
                            // marginHorizontal: 50
                            // flexDirection:'row',
                            // flexWrap:'wrap'
                          },
                          {
                            backgroundColor:
                              item.value == true ? COLORS.primary : '#fff',

                            alignSelf:
                              index + (1 % 2) != 0 ? 'flex-start' : 'flex-end',
                          },
                        ]}
                        onPress={() => {
                          this.changevalue(index);
                        }}>
                        <View
                          style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            marginTop: 20,
                            transform: [{rotate: '-45deg'}],
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              color:
                                item.value == false ? COLORS.primary : '#fff',
                            }}>
                            {' '}
                            {index + 1}{' '}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      // <TouchableOpacity key={index}
                      //   style={[styles.chooseView,
                      //   {
                      // backgroundColor: item.value == true ? COLORS.primary :
                      //   "#fff",

                      // alignSelf: index + 1 % 2 != 0 ? 'flex-start' : 'flex-end'
                      //   }
                      //   ]}
                      // onPress={
                      //   () => {
                      //     this.changevalue(index);
                      //   }
                      //   }
                      // >
                      // <View style={{
                      //   position: 'absolute', alignSelf: 'center', marginTop: 20,
                      //   transform: [
                      //     { rotate: '-45deg' }
                      //   ]
                      // }}>
                      //   <Text style={{
                      //     textAlign: 'center',
                      //     color: item.value == false ? COLORS.primary :
                      //       "#fff"
                      //   }}> {index + 1} </Text>
                      // </View>
                      // </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      alignSelf: 'center',
                    }}>
                    <Spinner size={35} color={COLORS.primary} />
                  </View>
                </>
              )}

              <TouchableOpacity
                disabled={this.state.disabled}
                onPress={() => {
                  this.savechoice();

                  if (
                    this.state.allClicked == true ||
                    this.state.atlistchoice == true
                  ) {
                    this.setState({visibleModal: false, choice: true});
                  } else {
                    ToastAndroid.showWithGravity(
                      'برجاء اختيار الفصل',
                      ToastAndroid.SHORT,
                      ToastAndroid.CENTER, // +++ i make it BOTTOM instead of CENTER
                    );
                  }
                }}
                style={{width: '100%'}}>
                <View
                  style={{
                    width: '80%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#8A3982',
                    alignSelf: 'center',
                    marginTop: 30,
                    marginBottom: 15,
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#FFFFFF',
                      fontWeight: 'bold',
                      fontStyle: 'normal',
                    }}>
                    تم الاختيار
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>

        {/*  //////////////////////////////////////////////////////////////////////////////////////////                   */}

        <Modal
          visible={this.state.paymentVisable}
          transparent={true}
          animationType="slide">
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.4)',
            }}>
            <View
              style={{
                height: height / 4,
                width: '90%',
                padding: 5,
                alignSelf: 'center',
                backgroundColor: '#fff',
                borderRadius: 15,
                elevation: 10,
              }}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}>
                <Text style={{fontSize: 20}}>{this.state.requestMassage}</Text>
              </View>

              <TouchableOpacity
                style={{
                  // backgroundColor: '#f0f',
                  paddingHorizontal: 17,
                  paddingVertical: 10,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  // margin: 10,
                  position: 'absolute',
                  // top: -10,
                  // right: -1,
                  // marginTop: 10,
                  left: 3,
                  top: 3,
                }}
                onPress={() => {
                  this.setState({
                    paymentVisable: false,
                    useCode: false,
                    code: '',
                    viewprice: false,
                  });
                }}>
                <Text
                  style={{
                    color: '#f00',
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    alignSelf: 'center',
                  }}>
                  X
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  choicesContainer: {
    width: '100%',
    // paddingHorizontal: '20%',
    paddingVertical: 10,
    // backgroundColor: '#f00'
  },
  chooseView: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
    borderRadius: 10,
    transform: [{rotate: '46deg'}],
    elevation: 3,
    marginRight: 110,
  },
  ChooseAll: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    transform: [{rotate: '46deg'}],
    // borderWidth: 1,
    // borderColor: '#ddd',
    elevation: 3,
  },
});
