// frontend/src/components/ErrorBoundary.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error("Captured error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>Something went wrong</Text>
          <Text>{this.state.error?.toString?.()}</Text>
          <TouchableOpacity onPress={() => this.setState({ hasError: false, error: null, info: null })} style={{ marginTop: 12 }}>
            <Text style={{ color: "#1E90FF" }}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
