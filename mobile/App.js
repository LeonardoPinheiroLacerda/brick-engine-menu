import { useEffect } from "react";
import { StyleSheet, View, StatusBar, Platform } from "react-native";
import { WebView } from "react-native-webview";
import * as NavigationBar from "expo-navigation-bar";

export default function App() {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("inset-touch");
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#30b3ff" />
      <WebView
        source={{
          uri: `https://LeonardoPinheiroLacerda.github.io/brick-engine-menu?t=${new Date().getTime()}`,
        }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsFullscreenVideo={true}
        incognito={true}
        cacheEnabled={false}
        cacheMode="LOAD_NO_CACHE"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#30b3ff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
});
