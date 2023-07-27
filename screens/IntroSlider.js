import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import AppIntroSlider from 'react-native-app-intro-slider';
import {FONTS, images} from '../constants';

const slides = [
  {
    key: 1,
    title: 'Title 1',
    text: 'الطب دراسة لإنقاذ الأرواح',
    image: images.intro_1,
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'لا يمكنك أن تكون طبيبًا جيدًا بدون معاناة',
    image: images.intro_2,
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Rocket guy',
    text: 'لا تذهب إلى الطبيب الذي ماتت نباتاته المكتبية',
    image: images.intro_3,
    backgroundColor: '#22bcb5',
  },
  {
    key: 4,
    title: 'Rocket guy',
    text: 'وجود الطبيب هو بداية العلاج',
    image: images.intro_4,
    backgroundColor: '#22bcb5',
  },
];

export default class IntroSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _renderItem = ({item}) => {
    return (
      <View style={styles.slide}>
        <ImageBackground
          style={{width: 300, height: 300}}
          resizeMode="contain"
          source={item.image}></ImageBackground>
        {/* <Text style={styles.title}>{nameTeacher}</Text> */}
        {/* <Image source={item.image} /> */}
        <Text style={styles.description}>{item.text}</Text>
      </View>
    );
  };

  _onDone = async () => {
    await AsyncStorage.setItem('switch', 'Auth');
    this.props.navigation.navigate('Auth');
  };

  render() {
    return (
      <>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />
        <AppIntroSlider
          activeDotStyle={{width: 30, backgroundColor: '#a13e6c'}}
          dotStyle={{backgroundColor: '#062d6e'}}
          renderItem={this._renderItem}
          data={slides}
          onDone={this._onDone}
          nextLabel="التالي"
          renderNextButton={() => (
            <View>
              <Text style={styles.introButtons}>التالي</Text>
            </View>
          )}
          renderDoneButton={() => (
            <View>
              <Text style={styles.introButtons}>انهاء</Text>
            </View>
          )}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  introButtons: {
    color: '#062d6e',
    marginTop: 15,
    fontFamily: FONTS.fontFamily,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 30,
    fontFamily: FONTS.fontFamily,
  },
  description: {
    fontSize: 18,
    fontFamily: FONTS.fontFamily,
  },
});
