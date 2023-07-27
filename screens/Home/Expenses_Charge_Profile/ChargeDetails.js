import * as React from 'react';
import {
  Text,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  View,
  ScrollView,
  UIManager,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
import axios from 'axios';
import {Spinner} from 'native-base';
import {AppRequired, COLORS, FONTS} from '../../../constants';

const {width, height} = Dimensions.get('window');

class ExpandableItemComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layoutHeight: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.item.isExpanded) {
      this.setState(() => {
        return {
          layoutHeight: null,
        };
      });
    } else {
      this.setState(() => {
        return {
          layoutHeight: 0,
        };
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.layoutHeight !== nextState.layoutHeight) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <View>
        {/*Header of the Expandable List Item*/}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.props.onClickFunction}
          style={{
            width: '95%',
            alignSelf: 'center',
            // borderColor: COLORS.secondary,
            // borderWidth: 1,
            paddingHorizontal: 5,
            paddingVertical: 15,
            borderTopLeftRadius: 7,
            borderTopStartRadius: 7,
            borderBottomLeftRadius: this.props.item.isExpanded ? 0 : 7,
            borderBottomRightRadius: this.props.item.isExpanded ? 0 : 7,
            // backgroundColor: '#fff',
            marginBottom: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '40%'}}>
            {/* //#7294b6 */}
            {/* #99b4d0 */}
            <Text style={{fontSize: 16, color: '#7294b6', fontWeight: '700'}}>
              السعر
            </Text>
            <Text style={[styles.headerText, {color: 'green'}]}>
              {this.props.item.charge_price + ' جنيه'}
            </Text>
          </View>
          <View
            style={{
              width: '50%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 14, color: '#7294b6', fontWeight: '700'}}>
              رقم الكارت
            </Text>
            <Text style={[styles.headerText]}>
              {this.props.item.charge_code_id}
            </Text>
          </View>
          {/* #8A3982 */}

          <Icon
            name={this.props.item.isExpanded ? 'arrow-down' : 'arrow-left'}
            style={{
              fontSize: 20,
              color: '#7294b6',
              marginLeft: 10,
              alignSelf: 'center',
            }}
          />
        </TouchableOpacity>

        <View
          style={{
            height: this.state.layoutHeight,
            overflow: 'hidden',
            marginBottom: 10,
            width: '95%',
            alignSelf: 'center',
            paddingHorizontal: 5,
            // paddingVertical: 15,
            borderBottomLeftRadius: 7,
            borderBottomRightRadius: 7,
            // flexDirection:"row"

            // backgroundColor: '#fff',
          }}>
          {/*Content under the header of the Expandable List Item*/}
          <View
            style={{
              justifyContent: 'space-between',
              marginTop: 5,
              flexDirection: 'row',
            }}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: '#7294b6', fontWeight: '700'}}>
                كود الكارت :
              </Text>
            </View>
            <Text
              style={[styles.headerText, {width: '50%', textAlign: 'right'}]}>
              {this.props.item.card_code.slice(0, 5) +
                '-' +
                this.props.item.card_code.slice(5, 10) +
                '-' +
                this.props.item.card_code.slice(10)}

              {/* {alert(JSON.stringify(this.props.item))} */}
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: '#7294b6', fontWeight: '700'}}>
              تاريخ الشحن :
            </Text>
            <Text style={[styles.headerText, {textAlign: 'right'}]}>
              {moment(this.props.item.charge_date)
                .format('LLLL')
                .toString()
                .slice(0, -8)}
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: '#7294b6', fontWeight: '700'}}>
              يوم الشحن :
            </Text>
            <Text style={[styles.headerText, {textAlign: 'right'}]}>
              {
                moment(this.props.item.charge_date)
                  .format('LLLL')
                  .toString()
                  .split(',')[0]
              }
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{color: '#7294b6', fontWeight: '700'}}>
              وقت الشحن :
            </Text>
            <Text style={[styles.headerText, {textAlign: 'right'}]}>
              {moment(this.props.item.charge_date)
                .format('LLLL')
                .toString()
                .slice(-8)}
            </Text>
          </View>

          {/* <View style={{width:"40%",fontWeight:"700"}}>
                        <Text style={{fontSize:14,fontWeight:"700"}}>تاريخ الشحن </Text>
                    <Text style={[styles.headerText]}>{moment(this.props.item.charge_date).format('LLLL').toString() }</Text>
                    </View> */}

          {/* <View style={{width:"50%"}}>
                        <Text style={{fontSize:14,fontWeight:"700"}}>الرقم التسلسلي </Text>
                    <Text style={[styles.headerText]}>{this.props.item.card_id }</Text>
                    </View> */}
        </View>
        <View
          style={{
            height: 1,
            width: '90%',
            alignSelf: 'center',
            backgroundColor: '#ddd',
          }}
        />
      </View>
    );
  }
}

export default class ChargeDetails extends React.Component {
  constructor(props) {
    super(props);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.state = {
      charges: [],
      charging_records_count: 0,
      loading: true,
      more_or_not: false,
      response: '',
      firstTime: true,
    };
  }

  componentDidMount() {
    // if(this.state.firstTime){
    this.get_charages();
    // }
  }

  updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.charges];
    //For Single Expand at a time
    array.map((value, placeindex) =>
      placeindex === index
        ? (array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'])
        : (array[placeindex]['isExpanded'] = false),
    );
    //For Multiple Expand at a time
    //array[index]['isExpanded'] = !array[index]['isExpanded'];
    this.setState(() => {
      return {
        charges: array,
      };
    });
  };

  get_charages = async () => {
    this.setState({loading: true});
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));
    let data_to_send = {
      init_record_no: this.state.charges.length,
      student_id: StudentData.student_id,
    };

    axios
      .post(AppRequired.Domain + `select_charging_history.php`, data_to_send)
      .then((res) => {
        // alert(JSON.stringify(res.data.charging_records_count));
        // alert(JSON.stringify(res.data));

        if (res.status == 200) {
          this.setState({loading: false});
          if (res.data != 'error') {
            if (res.data.charging_records.length > 0) {
              this.setState({
                charges: this.state.charges.concat(res.data.charging_records),
                charging_records_count: res.data.charging_records_count,
                more_or_not: true,
                firstTime: false,
              });

              // console.log(this.state.exams)
            } else {
              this.setState({response: 'empty'});
              // Alert.alert('أدمن', 'لم يتم الشحن مسبفا');
            }
          } else {
            Alert.alert('أدمن', 'خطأ');
          }
        } else {
          Alert.alert('أدمن', 'حدث شئ خطأ');
        }
        // this.setState({ loading: false });
      });
  };

  render() {
    return (
      <>
        {this.state.loading && !this.state.more_or_not ? (
          <View style={styles.emptyPage}>
            <Spinner color={COLORS.primary} size={40} />
          </View>
        ) : this.state.response == 'empty' ? (
          <View style={styles.emptyPage}>
            <Text style={[styles.textEmpty, {fontFamily: FONTS.fontFamily}]}>
              لم يتم الشحن مسبقا
            </Text>
          </View>
        ) : (
          // null
          <ScrollView>
            {this.state.charges.map((item, key) => (
              <ExpandableItemComponent
                key={item.charge_id}
                onClickFunction={this.updateLayout.bind(this, key)}
                item={item}
                navigation={this.props.navigation}
              />
            ))}
            {this.state.charges.length < this.state.charging_records_count ? (
              <TouchableOpacity
                onPress={() => {
                  this.get_charages();
                }}
                style={{
                  alignSelf: 'center',
                  paddingVertical: 10,
                }}>
                {this.state.loading && this.state.more_or_not ? (
                  // null
                  <Spinner color={COLORS.primary} size={28} style={{}} />
                ) : (
                  <Text>See More...</Text>
                )}
              </TouchableOpacity>
            ) : null}
          </ScrollView>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    paddingTop: 15,
    backgroundColor: '#F5FCFF',
  },

  header: {
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderRadius: 7,
    backgroundColor: '#fff',
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
    // fontFamily: 'serif',
    // letterSpacing: 3
  },
  separator: {
    height: 0.5,
    backgroundColor: '#808080',
    width: '95%',
    marginLeft: 16,
    marginRight: 16,
  },
  text: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  content: {
    // paddingBosubcategoryom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
  },
  emptyPage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textEmpty: {
    fontSize: 20,
  },
});
