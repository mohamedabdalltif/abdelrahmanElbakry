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
  constructor() {
    super();
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
            <Text style={{fontSize: 14, fontWeight: '700', color: '#7294b6'}}>
              السعر
            </Text>

            <Text style={[styles.headerText, {color: '#f00'}]}>
              {'-' + this.props.item.expense_amount + ' جنيه'}
            </Text>
          </View>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 14, fontWeight: '700', color: '#7294b6'}}>
              تاريخ الدفع
            </Text>
            <Text style={[styles.headerText]}>
              {moment(this.props.item.expense_date)
                .format('LLLL')
                .toString()
                .split(' ')[1] +
                ' ' +
                moment(this.props.item.expense_date)
                  .format('LLLL')
                  .toString()
                  .split(' ')[2] +
                ' ' +
                moment(this.props.item.expense_date)
                  .format('LLLL')
                  .toString()
                  .split(' ')[3]}
            </Text>
          </View>

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
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <Text style={{fontWeight: '700', color: '#7294b6'}}>تم شراء :</Text>
            <Text
              style={[styles.headerText, {width: '50%', textAlign: 'right'}]}>
              {this.props.item.expense_for}
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontWeight: '700', color: '#7294b6'}}>
              يوم الدفع :
            </Text>
            <Text style={[styles.headerText, {textAlign: 'right'}]}>
              {
                moment(this.props.item.expense_date)
                  .format('LLLL')
                  .toString()
                  .split(',')[0]
              }
            </Text>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontWeight: '700', color: '#7294b6'}}>
              وقت الدفع :
            </Text>
            <Text style={[styles.headerText, {textAlign: 'right'}]}>
              {moment(this.props.item.expense_date)
                .format('LLLL')
                .toString()
                .slice(-8)}
            </Text>
          </View>

          {/* <View style={{width:"40%",fontWeight:"700"}}>
                        <Text style={{fontSize:14,fontWeight:"700"}}>تاريخ الشحن </Text>
                    <Text style={[styles.headerText]}>{moment(this.props.item.expense_date).format('LLLL').toString() }</Text>
                    </View> */}

          {/* <View style={{width:"50%"}}>
                        <Text style={{fontSize:14,fontWeight:"700"}}>الرقم التسلسلي </Text>
                    <Text style={[styles.headerText]}>{this.props.item.card_id }</Text>
                    </View> */}
        </View>
        <View style={{height: 1, backgroundColor: '#ddd'}} />
      </View>
    );
  }
}

export default class ExpensesDetails extends React.Component {
  constructor(props) {
    super(props);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.state = {
      expenses: [],
      charging_records_count: 0,
      loading: true,
      more_or_not: false,
      response: '',
    };
  }

  componentDidMount() {
    this.get_expenses();
  }

  updateLayout = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const array = [...this.state.expenses];
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
        expenses: array,
      };
    });
  };

  async get_expenses() {
    this.setState({loading: true});
    let StudentData = JSON.parse(await AsyncStorage.getItem('AllData'));

    let data_to_send = {
      init_record_no: this.state.expenses.length,
      student_id: StudentData.student_id,
    };
    axios
      .post(AppRequired.Domain + `select_expenses_history.php`, data_to_send)
      .then((res) => {
        // alert(JSON.stringify(res.data));
        // console.log(res.data)
        if (res.status == 200) {
          if (res.data != 'error') {
            if (res.data.expenses_records.length > 0) {
              this.setState({
                expenses: this.state.expenses.concat(res.data.expenses_records),
                charging_records_count: res.data.expenses_records_count,
                more_or_not: true,
              });
              // console.log(this.state.exams)
            } else {
              this.setState({response: 'empty'});
              // Alert.alert('لا يوجد مصروفات مسبقه');
            }
          } else {
            Alert.alert('خطأ');
          }
        } else {
          Alert.alert('أدمن', 'حدث شئ خطأ');
        }
        this.setState({loading: false});
      });
  }

  render() {
    return (
      <>
        {this.state.loading && !this.state.more_or_not ? (
          // null
          <View style={styles.emptyPage}>
            <Spinner color={COLORS.primary} size={40} />
          </View>
        ) : this.state.response == 'empty' ? (
          <View style={styles.emptyPage}>
            <Text style={[styles.textEmpty, {fontFamily: FONTS.fontFamily}]}>
              لا يوجد مصروفات مسبقه
            </Text>
          </View>
        ) : (
          <ScrollView>
            {this.state.expenses.map((item, key) => (
              <ExpandableItemComponent
                key={item.expense_id}
                onClickFunction={this.updateLayout.bind(this, key)}
                item={item}
                navigation={this.props.navigation}
              />
            ))}

            {this.state.expenses.length < this.state.charging_records_count ? (
              <TouchableOpacity
                onPress={() => {
                  this.get_expenses();
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
