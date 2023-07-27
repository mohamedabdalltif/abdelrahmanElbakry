import * as React from 'react';
import {Dimensions} from 'react-native';
import {TabView, TabBar} from 'react-native-tab-view';

import ChargeDetails from './ChargeDetails';
import ExpensesDetails from './ExpensesDetails';
import {COLORS, FONTS} from '../../../constants';
import {StatusBar} from 'react-native';

const initialLayout = {width: Dimensions.get('window').width};
const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{backgroundColor: 'white', height: 2}}
    style={{backgroundColor: COLORS.primary, height: 70, paddingTop: 10}}
    labelStyle={{
      fontFamily: FONTS.fontFamily,
      fontWeight: 'bold',
      fontSize: 17,
    }}
  />
);

export default class MoneyTransactionsDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {key: 'first', title: 'الشحن'},
        {key: 'second', title: 'المصروفات'},
      ],
    };
  }

  renderScene = ({route}) => {
    // alert(route.key)
    switch (route.key) {
      case 'first':
        return <ChargeDetails />;

      case 'second':
        return <ExpensesDetails />;
    }
  };
  render() {
    const {index, routes} = this.state;
    return (
      <>
        <StatusBar backgroundColor={COLORS.secondary} />
        <TabView
          navigationState={{index: index, routes: routes}}
          renderScene={this.renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={(index) => this.setState({index})}
          initialLayout={initialLayout}
        />
      </>
    );
  }
}
