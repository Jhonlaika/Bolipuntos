/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Platform,
  StatusBar,
  useColorScheme,
  SafeAreaView,
  Text
} from 'react-native';
import { Provider } from 'react-redux'
import Navigation from './src/navigations/Navigation';
import store from './src/state/store';
import { colors } from './src/utils/constants';

const App = () => {

  Text.defaultProps = {
    ...Text.defaultProps,
  color:colors.black,
  };

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      {Platform.OS === 'ios' && <SafeAreaView style={{ flex: 0, backgroundColor: '#196f3d' }} />}
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={'#196f3d'}
        />
        <Navigation />
      </SafeAreaView>
    </Provider>
  );
};

export default App;
