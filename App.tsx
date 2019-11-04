import React, {Component, useEffect} from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import {Alert, Platform, Text, View} from 'react-native';
import {AuthenticationType} from 'expo-local-authentication';

class RootComponent extends Component {
  async componentDidMount() {
    await this.handleAuth();
  }

  handleBiometricAuthFailure = async (error: string) => {
    switch (error) {
      case 'NOT_ENROLLED':
        Alert.alert(
          `Not Enrolled`,
          'This device does not have biometric login enabled.',
        );
        break;
      case 'NOT_PRESENT':
        Alert.alert('', 'This device does not have the required hardware.');
        return;
      case 'AUTHENTICATION_FAILED':
        Alert.alert('', 'Authentication failed too many times');
        break;
      case 'NOT_AVAILABLE':
        Alert.alert('', 'Authentication is not available.');
        break;
      default:
        Alert.alert(
          'Unable to use Fingerprint or Face Authentication.',
          `${error}`,
        );
    }
  };

  handleAndroidAfter = async () => {
    await LocalAuthentication.cancelAuthenticate();
  };

  handleBiometricAuthSuccess = async () => {
    Alert.alert('', 'Successfully authenticated');
    if (Platform.OS === 'android') {
      this.handleAndroidAfter();
    }
  };
  authenticateBiometrics = async () => {
    const authenticateResult = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Please authenticate to proceed',
      fallbackLabel: 'Fallback label',
    });
    if (authenticateResult.success) {
      this.handleBiometricAuthSuccess();
    } else {
      this.handleBiometricAuthFailure(authenticateResult.error);
    }
  };

  handleAndroidBefore = async () => {
    const supportedTypesResult = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const showAndroidFingerprintAlert = supportedTypesResult.includes(
      AuthenticationType.FINGERPRINT,
    );
    if (showAndroidFingerprintAlert) {
      Alert.alert(
        'Fingerprint Scan',
        'Place your finger over the touch sensor.',
        [],
        {},
      );
    }
  };

  handleEnrolledBiometricDevice = async () => {
    if (Platform.OS === 'android') {
      this.handleAndroidBefore();
    }
    this.authenticateBiometrics();
  };

  handleAuth = async () => {
    try {
      const isEnrolledResult = await LocalAuthentication.isEnrolledAsync();
      if (isEnrolledResult) {
        await this.handleEnrolledBiometricDevice();
      } else {
        Alert.alert('Phone not able to use Face or Fingerprint.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert(`Error`, error.message);
      debugger;
    }
  };

  render() {
    return (
      <View>
        <Text>lol</Text>
      </View>
    );
  }
}

export default RootComponent;
