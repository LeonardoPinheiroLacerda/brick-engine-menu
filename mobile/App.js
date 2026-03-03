import { useEffect } from "react";
import { StyleSheet, View, StatusBar, Platform } from "react-native";
import { WebView } from "react-native-webview";
import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("inset-touch");
    }
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.outerContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#30b3ff" />
        <SafeAreaView
          style={styles.container}
          edges={["top", "bottom", "left", "right"]}
        >
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
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#30b3ff",
  },
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
