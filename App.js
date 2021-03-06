import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Amplify from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import {REACT_APP_IDENTITY_POOL_ID,REACT_APP_REGION,REACT_APP_USER_POOL_ID,REACT_APP_USER_POOL_WEB_CLIENT_ID,REACT_APP_MQTT_ID} from "@env"

import Header from './components/Header';

Amplify.configure({
  Auth: {
    identityPoolId: REACT_APP_IDENTITY_POOL_ID,
    region: REACT_APP_REGION,
    userPoolId: "us-east-2_UkCohUiyE",
    userPoolWebClientId: REACT_APP_USER_POOL_WEB_CLIENT_ID
  }
});

Amplify.addPluggable(new AWSIoTProvider({
  aws_pubsub_region: REACT_APP_REGION,
  aws_pubsub_endpoint: `wss://${REACT_APP_MQTT_ID}.iot.${REACT_APP_REGION}.amazonaws.com/mqtt`,
}));

Amplify.PubSub.publish('smartbank/check', { message: "is the device powered on?" });

const Separator: () => React$Node = () => {
  return ( <View style={styles.separator} />);
};

const App: () => React$Node = () => {
  const [connection, setConnection] = React.useState("Connecting to device...");
  const [buttons, setButtons] = React.useState(false);

  Amplify.PubSub.subscribe('smartbank/connection').subscribe({
    next: data => {
      if(data.value.message === "Yes"){
        setConnection("Connected.")
        setButtons(true)
      }
    },
    error: error => console.error(error),
    close: () => console.log('Done'),
  });

  const unLock = () => {
    Amplify.PubSub.publish('smartbank/switch', { switch: 1 });
  }
  const lock = () => {
    Amplify.PubSub.publish('smartbank/switch', { switch: 0 });
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header/>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{connection}</Text>
              <Separator />
              <View style={styles.sectionDescription}>
                {buttons && <>
                  <Button
                    buttonStyle={{
                        borderRadius: 60,
                        flex: 1,
                        height: 60,
                        width: 60,  
                    }}
                    icon={
                      <Icon
                        name="unlock-alt"
                        size={35}
                        color="green"
                      />
                    }
                    type="clear"
                    onPress={unLock}
                    color="lightgreen"
                  />
                  <Button
                    buttonStyle={{
                        borderRadius: 60,
                        flex: 1,
                        height: 60,
                        width: 60,  
                    }}
                    icon={
                      <Icon
                        name="lock"
                        size={35}
                        color="red"
                      />
                    }
                    type="clear"
                    onPress={lock}
                    color="darkred"
                  />
                </>}
              </View>
            </View>
            <View style={styles.by}>
              <Text style={styles.byText}>by hcpw</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  by: {
    marginTop: 148,
    // flexDirection: 'column-reverse',
  },
  byText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    color: 'grey',
    fontStyle: 'italic'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.black,
  },
  sectionDescription: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default App;
