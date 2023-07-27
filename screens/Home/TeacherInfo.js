import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Dimensions,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5Brands from 'react-native-vector-icons/FontAwesome5Pro';
import AsyncStorage from '@react-native-community/async-storage';

import {AppRequired, COLORS, FONTS, images} from '../../constants';
import {StatusBar} from 'react-native';
const {width, height} = Dimensions.get('window');

export default class TeacherInfo extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor={COLORS.secondary} />
        <ScrollView>
          {/**                       header                 */}
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
                <FontAwesome5
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
                عن د/ محمد عطية
              </Text>
            </View>
            <View style={{flex: 1}} />
          </View>

          {/**                        End header                 */}

          {/**                        Teacher Info                                  */}

          <View
            style={{
              elevation: 5,
              borderRadius: 15,
              backgroundColor: '#fff',
              width: '90%',
              alignSelf: 'center',
              marginVertical: 20,
              padding: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  height: 110,
                  width: 110,
                  backgroundColor: '#fff',
                  borderRadius: 100,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={images.appOwner}
                  style={{flex: 1, height: 30, width: 80}}
                />
              </View>

              <View style={{flex: 2, padding: 10}}>
                <Text style={{fontSize: 18, fontFamily: FONTS.fontFamily}}>
                  دكتور / محمد عطية
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FONTS.fontFamily,
                    alignSelf: 'flex-start',
                    textAlign: 'center',
                  }}>
                  「Biology With Mohamed Atya」
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              borderWidth: 2,
              borderColor: '#ddd',
              width: '90%',
              alignSelf: 'center',
            }}
          />

          {/* <View
            style={{
              elevation: 5,
              borderRadius: 15,
              backgroundColor: '#fff',
              width: '90%',
              alignSelf: 'center',
              marginVertical: 20,
              padding: 10,
            }}>
            <Text
              style={{
                fontSize: 22,
                fontFamily: FONTS.fontFamily,
                alignSelf: 'center',
              }}>
              رساله الأستاذ / {AppRequired.teacherName}
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                width: '90%',
                alignSelf: 'center',
                marginTop: 5,
              }}
            />

            <Text
              style={{
                fontSize: 19,
                fontFamily: FONTS.fontFamily,
                alignSelf: 'center',
                textAlign: 'center',
              }}>
              {AppRequired.teacherMessage}
            </Text>
          </View> */}

          {/* <View
            style={{
              borderWidth: 2,
              borderColor: '#ddd',
              width: '90%',
              alignSelf: 'center',
            }}
          /> */}

          <View
            style={{
              elevation: 5,
              borderRadius: 15,
              backgroundColor: '#fff',
              width: '90%',
              alignSelf: 'center',
              marginVertical: 20,
              padding: 10,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
            <View
              style={{flexDirection: 'row', alignItems: 'center', padding: 2}}>
              <View>
                <Text style={{fontFamily: FONTS.fontFamily, fontSize: 20}}>
                  {AppRequired.teacherPhone}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={async () => {
                    Linking.openURL('tel:' + AppRequired.teacherPhone);
                  }}
                  style={{
                    // flex: 1,
                    marginLeft: 10,

                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FontAwesome name="phone-square" color="#1cb48e" size={33} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      'https://wa.me/+20' + AppRequired.teacherPhone,
                    );
                  }}
                  style={{
                    // flex: 1,
                    marginHorizontal: 10,

                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FontAwesome5Brands
                    name="whatsapp-square"
                    color="#1cb48e"
                    size={33}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                width: '95%',
                alignSelf: 'center',
              }}
            />

            <View
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                width: '95%',
                alignSelf: 'center',
              }}
            />

            <View
              style={{flexDirection: 'row', alignItems: 'center', padding: 2}}>
              <View>
                <Text style={{fontFamily: FONTS.fontFamily, fontSize: 20}}>
                  {AppRequired.teacherPhoneTwo}
                </Text>
              </View>

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={async () => {
                    Linking.openURL('tel:' + AppRequired.teacherPhoneTwo);
                  }}
                  style={{
                    // flex: 1,
                    marginLeft: 10,

                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FontAwesome name="phone-square" color="#1cb48e" size={33} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      'https://wa.me/+20' + AppRequired.teacherPhoneTwo,
                    );
                  }}
                  style={{
                    // flex: 1,
                    marginHorizontal: 10,

                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <FontAwesome5Brands
                    name="whatsapp-square"
                    color="#1cb48e"
                    size={33}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                width: '95%',
                alignSelf: 'center',
              }}
            />

            <View
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                width: '95%',
                alignSelf: 'center',
              }}
            />
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center', padding: 2}}
              onPress={async () => {
                // const supported = await Linking.canOpenURL(
                //   AppRequired.facebookLink,
                // );
                // alert(supported);
                // if (supported) {
                await Linking.openURL(AppRequired.facebookLink);
                // } else {
                //   await Linking.openURL('fb://');
                // }
              }}>
              <View style={{flex: 1, marginHorizontal: 10}}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: FONTS.fontFamily,
                    fontSize: 18,
                    textAlign: 'right',
                  }}>
                  {AppRequired.facebookName}
                </Text>
              </View>

              <View
                style={{
                  // flex: 1,
                  marginHorizontal: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesome5Brands
                  name="facebook-square"
                  color="#007aff"
                  size={33}
                />
              </View>
            </TouchableOpacity>
            {AppRequired.youtubeLink == '' ? null : (
              <>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    width: '80%',
                    alignSelf: 'center',
                  }}
                />
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 2,
                  }}
                  onPress={async () => {
                    const supported = await Linking.canOpenURL(
                      AppRequired.youtubeLink,
                    );
                    if (supported) {
                      await Linking.openURL(AppRequired.youtubeLink);
                    } else {
                      await Linking.openURL('https://www.youtube.com/');
                    }
                  }}>
                  <View style={{flex: 3}}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: FONTS.fontFamily,
                        fontSize: 18,
                        marginLeft: 30,
                      }}>
                      {AppRequired.youtubeName}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <FontAwesome5Brands name="youtube" color="#f00" size={33} />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
