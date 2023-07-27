import * as React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
// import firebase from 'react-native-firebase';
// import PushNotification from 'react-native-push-notification';
import RNBootSplash from 'react-native-bootsplash';

import {
  Login,
  Signup,
  ForgetPassword,
  EnterCodeForResetPassword,
  NewPassword,
} from './screens/Auth';
import {SelectSubject} from './screens/Home';

import SwitchControle from './screens/SwitchControle';
import IntroSlider from './screens/IntroSlider';
import Tabs from './navigation/tabs';

const Auth = createStackNavigator(
  {
    Login: {screen: Login},
    Signup: {screen: Signup},
    ForgetPassword: {screen: ForgetPassword},
    EnterCodeReset: {screen: EnterCodeForResetPassword},
    NewPassword: {screen: NewPassword},
  },

  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const IntroSliderPage = createStackNavigator(
  {
    IntroSlider: {screen: IntroSlider},
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

const AppSwitch = createSwitchNavigator({
  SwitchControle: {screen: SwitchControle},
});

const HomePagesTabs = createStackNavigator(
  {
    SelectSubject: {screen: SelectSubject},
    MainApp: {screen: Tabs},
  },
  {
    initialRouteName: 'SelectSubject',
    headerMode: 'none',
  },
);

const MainApp = createAppContainer(
  createSwitchNavigator(
    {
      AppSwitch: AppSwitch,
      IntroSlider: IntroSliderPage,
      Auth: Auth,
      HomePages: HomePagesTabs,
    },
    {
      headerMode: 'none',
      navigationOptions: {
        headerVisible: false,
      },
    },
  ),
);

export default class App extends React.Component {
  componentDidMount() {
    RNBootSplash.hide({fade: true});
    // this.createNotificationListeners();
    // this.clearNotification();
  }
  // clearNotification() {
  //   PushNotification.cancelAllLocalNotifications({id: 123});
  // }

  // async createNotificationListeners() {
  //   // when app oppening
  //   this.notificationListener = firebase
  //     .notifications()
  //     .onNotification((notification) => {
  //       const {title, body} = notification;
  //       PushNotification.localNotification({
  //         title: title,
  //         message: body,
  //       });

  //       // setTimeout(() => {
  //       //   PushNotification.removeDeliveredNotifications();
  //       // }, 9000);
  //       // PushNotification.cancelAllLocalNotifications();

  //       // this.displayNotification(title, body);
  //     });

  //   // when app is on cash
  //   this.notificationOpenedListener = firebase
  //     .notifications()
  //     .onNotificationOpened((notificationOpen) => {
  //       // const {title, body} = notificationOpen.notification;
  //       // this.displayNotification(title, body);
  //     });

  //   // when app is colsed
  //   const notificationOpen = await firebase
  //     .notifications()
  //     .getInitialNotification();
  //   if (notificationOpen) {
  //     // const {title, body} = notificationOpen.notification;
  //     // this.displayNotification(title, body);
  //   }
  // }

  render() {
    return <MainApp />;
  }
}
