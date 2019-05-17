/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { 
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  TextInput,
  Button,
} from 'react-native';
import UniversalLoginSDK from "universal-login-sdk";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: "", 
      contractAddress: "", 
      balance: 0,
      username: ""
    };
    this.sdk = new UniversalLoginSDK('http://localhost:3311', 'http://localhost:18545');
    // this.tokenContract = new Contract('0x0E2365e86A50377c567E1a62CA473656f0029F1e', Token.interface, this.sdk.provider)
  }

  register = async () => {
    const { username } = this.state;
    // TODO: add validation for username...
    const usernameEth = username + '.mylogin.eth';
    const [privateKey, contractAddress] = await this.sdk.create(usernameEth);
    
    const getBalance = await this.sdk.provider.getBalance(contractAddress)
    
    const balance = (getBalance/(Math.pow(10,18))).toString();
    this.setState({privateKey, contractAddress, balance});
  }  

   execute = async () => {
    // Executes a transaction
    const { contractAddress, privateKey } = this.state;

    const message = {
      from: this.state.contractAddress,
      to: "0x1234567890000000000000000000000000000000", // hardcoded from example
      data: "0x0",
      value: "100000000000000000",
      gasToken: "0x0E2365e86A50377c567E1a62CA473656f0029F1e", // get this address from your terminal
      gasPrice: 1000000000,
      gasLimit: 1000000
    };

    await this.sdk.execute(message, privateKey);

    const getBalance = await this.sdk.provider.getBalance(contractAddress)
    const balance = (getBalance/(Math.pow(10,18))).toString();
    this.setState({balance});
  }
  render() {
    const { privateKey, contractAddress, balance } = this.state;
    return (
      <View style={styles.container}>
        <Text> Enter username (.mylogin.eth) </Text>
        {
          this.state.contractAddress.length == 0 
          ? <View>
              <TextInput
                style={styles.txtUsername}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Enter Username!"
                onChangeText={(text) => this.setState({username: text})}
              />
              <Button
                onPress={() => this.register()}
                title="Register"
                color="#841584"
              />
            </View>
          :  <View>
              <Text> Your device private key: { privateKey } </Text>
              <Text> Your contract address: { contractAddress } </Text>
              <Text> Your balance: { balance } </Text>
              <Button
                onPress={() => this.execute()}
                title="Transfer 0.1 ether"
                color="#841584"
              />
            </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  txtUsername: {
    height: 40, 
    width: 200, 
    borderColor: "black", 
    borderWidth: 1, 
    padding: 5, 
    marginTop: 10,
  }
});
