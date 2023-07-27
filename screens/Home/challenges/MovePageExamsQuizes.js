import * as React from 'react';
import {View, StyleSheet, Dimensions, StatusBar} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import {Container} from 'native-base';

import Exam from './Exam';
import Quiz from './Quiz';

const initialLayout = {width: Dimensions.get('window').width};
import {COLORS} from '../../../constants';

export default function MovePageExamsQuizes({navigation}) {
  const FirstRoute = () => <Exam navigation={navigation} />;

  const SecondRoute = () => <Quiz navigation={navigation} />;

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: '1', title: 'الامتحانات المحلولة'},
    {key: '2', title: 'الكويزات المحلولة'},
  ]);

  const renderScene = SceneMap({
    1: FirstRoute,
    2: SecondRoute,
  });

  return (
    <Container>
      <StatusBar backgroundColor={COLORS.secondary} />
      {/* <StatusBar
        backgroundColor={Constants.colorApp}
        // barStyle="light-content"
      /> */}
      {/* <View
        style={{
          height: 90,
          width: '100%',
          backgroundColor: Constants.colorApp,
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 25,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 22,
            // fontWeight: 'bold',
            fontFamily: Constants.fontFamily,
            color: '#fff',
          }}>
          قائمة الامتحانات المحلولة
        </Text>
      </View> */}
      <View style={{height: 35, backgroundColor: COLORS.primary}}></View>

      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={{backgroundColor: COLORS.primary}}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
