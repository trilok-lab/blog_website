// frontend/src/components/Snackbar.js
import React from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

let currentToast = null;

export const showSnackbar = (message, type = "info", duration = 3500) => {
  if (currentToast) currentToast.show(message, type, duration);
};

export default class Snackbar extends React.PureComponent {
  state = { visible: false, message: "", type: "info" };
  anim = new Animated.Value(0);

  componentDidMount() { currentToast = this; }
  componentWillUnmount() { if (currentToast === this) currentToast = null; }

  show = (message, type = "info", duration = 3500) => {
    this.setState({ visible: true, message, type }, () => {
      Animated.timing(this.anim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
      setTimeout(this.hide, duration);
    });
  };

  hide = () => {
    Animated.timing(this.anim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      this.setState({ visible: false, message: "" });
    });
  };

  render() {
    const { visible, message, type } = this.state;
    const bg = type === "error" ? "#e74c3c" : type === "success" ? "#2ecc71" : "#333";
    if (!visible) return null;

    return (
      <Animated.View style={[styles.container, { transform: [{ translateY: this.anim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }] }]}>
        <View style={[styles.snack, { backgroundColor: bg }]}>
          <Text style={styles.text}>{message}</Text>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: { position: "absolute", bottom: 80, left: 20, right: 20, zIndex: 9999, alignItems: "center" },
  snack: { padding: 12, borderRadius: 8, maxWidth: "100%" },
  text: { color: "#fff" }
});
