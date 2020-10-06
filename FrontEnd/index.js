/**
 * @format
 */

import {AppRegistry} from 'react-native';
import React from 'react';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import configureStore from './src/store.js';

const store = configureStore();

const ProviderComponent = () =>
    <Provider store={store}>
        <App/>
    </Provider>

AppRegistry.registerComponent(appName, () => ProviderComponent);
