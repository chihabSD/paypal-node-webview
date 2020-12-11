

import React, {useEffect, useRef, useState} from 'react';

import {
  View,
  Text,
  I18nManager,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {WebView} from 'react-native-webview';
// import Modal from 'react-native-modal';
// import Modal2 from 'react-native-modal';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import handleIcons from '../../_helpers/handleIcons';
import CustomHeader from '../Header/CustomHeader';
import Break from '../Shared/Formik/Break';
import FormikInputs from '../Shared/Formik/FormikInputs';
import CustomStatusBar from '../StatusBar';
import colors from '../Styles/colors';
import Fonts from '../Styles/Fonts';
import handleText from '../Styles/handleText';

const PaymentBase = ({navigation}) => {
  const [state, setState] = useState({showModal: false, statues: 'Pending'});
  const [loader, setLoader] = useState(false);
  const [methods, setMethods] = useState([{id: 0, name: 'Paypal'}]);
  // handle data response
  const handleDataResponse = (data) => {
    // title in localhost:3000/sucess then
    if (data.title === 'success') {
      setState({showModal: false, statues: 'Complete'});
      //  navigation.navigate('OrderConfirmation')
    } else if (data.title === 'cancel') {
      setState({showModal: false, statues: 'cancel'});
    } else {
      return;
    }
  };

  //   let jsCode = `
  //   document.paypalForm.submit()
  // `;

  const jsCode = `
    setTimeout(() => {
     
      document.paypalForm.submit();
    }, 100);
`;

  //  setTimeout(() => {
  //   //       this.webref.injectJavaScript(run);
  //   //     }, 10000);
  const webViewRef = useRef();
  const onlOAD = () => {
    webViewRef.current.injectJavaScript(jsCode);
  };
  useEffect(() => {
    if (state.statues === 'Complete') {
      // setLoader(true);
      setTimeout(() => {
        // setLoader(false);
        return navigation.navigate('OrderConfirmation');
      }, 10);
    }
  }, [state.statues]);
  useEffect(() => {
    setState({showModal: false});
  }, []);
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <CustomStatusBar color={'white'} />
      <View
        style={{
          height: 70,
          backgroundColor: 'white',
          shadowColor: '#000',
          paddingHorizontal: 20,
          shadowOffset: {
            width: 0,
            height: 0.1,
          },
          shadowColor: 'black',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          elevation: 5,
          paddingTop: 5,
          borderBottomWidth: 1,
          borderBottomColor: '#d1d1d1',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('Checkout')}>
            {handleIcons('AntDesign', 30, 'arrowleft', 'black')}
          </TouchableOpacity>
          <Text
            style={{
              marginHorizontal: 10,
              color: 'black',
              fontFamily: Fonts.MEDIUM,
              fontSize: 20,
            }}>
            {I18nManager.isRTL ? 'إعدادت الحساب' : 'Pay with'}
          </Text>
          <View />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}></View>
            <View style={{alignItems:'flex-end', flex:1}}>
              {loader ? <ActivityIndicator /> : null}
            </View>
        </View>

        {/* <CustomHeader
    
          title={I18nManager.isRTL ? 'إعدادت الحساب' : 'Pay with'}
          goBack={() => navigation.navigate('Checkout')}
        /> */}
      </View>
      <View>
        <TouchableOpacity
          onPress={() => setState({showModal: true})}
          style={{width: 200, height: 100}}>
          <Text> Pay with payal </Text>
        </TouchableOpacity>
      </View>
      <Modal
        style={{height: 100}}
        onRequestClose={() => setState({showModal: false})}
        visible={state.showModal}>
        <CustomStatusBar />
        <View
          style={{
            height: 70,
            backgroundColor: colors.PRIMARY,
            shadowColor: '#000',

            shadowOffset: {
              width: 0,
              height: 0.1,
            },
            shadowColor: 'black',

            elevation: 5,
            paddingTop: 5,
            borderBottomWidth: 1,
            borderBottomColor: '#d1d1d1',
          }}>
          <CustomHeader
            // titleColor="black"
            title={
              I18nManager.isRTL
                ? 'إعدادت الحساب'
                : 'Login in to your Paypal account'
            }
            goBack={() => setState({showModal: false})}
          />
        </View>

        <WebView
          ref={webViewRef}
          onLoadEnd={onlOAD}
          // injectedJavaScript={jsCode}
          // javaScriptEnabled={}
          originWhitelist={['*']}
          domStorageEnabled={true}
          source={{uri: 'http://localhost:3000'}}
          onNavigationStateChange={(data) =>
            handleDataResponse(data)
          }></WebView>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  circle: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: '#d1d1d1',
    borderRadius: 25 / 2,
  },
  btns: {
    backgroundColor: colors.BLUE,

    marginTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
    borderRadius: 5,
  },
});
export default PaymentBase;
