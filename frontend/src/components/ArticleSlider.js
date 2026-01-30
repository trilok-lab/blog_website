// frontend/src/components/ArticleSlider.js

import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import client from "../api/client";

const { width } = Dimensions.get("window");
const CARD_WIDTH = 200;
const AUTO_SCROLL_MS = 2000;

export default class ArticleSlider extends React.PureComponent {
  state = {
    items: [],
    index: 0,
  };

  timer = null;
  listRef = React.createRef();

  async componentDidMount() {
    await this.load();
    this.startAutoScroll();
  }

  componentWillUnmount() {
    this.stopAutoScroll();
  }

  load = async () => {
    try {
      const res = await client.get("/api/articles/slider/");
      const data = res.data?.results || res.data || [];
      this.setState({ items: data });
    } catch (e) {
      console.log("slider load error", e);
    }
  };

  startAutoScroll = () => {
    this.stopAutoScroll();
    this.timer = setInterval(this.handleNext, AUTO_SCROLL_MS);
  };

  stopAutoScroll = () => {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  };

  handleNext = () => {
    const { items, index } = this.state;
    if (!items.length) return;

    // LAST ITEM → jump back silently
    if (index === items.length - 1) {
      this.listRef.current?.scrollToIndex({
        index: 0,
        animated: false,
      });
      this.setState({ index: 0 });
      return;
    }

    const nextIndex = index + 1;
    this.setState({ index: nextIndex }, () => {
      this.listRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    });
  };

  onMomentumEnd = (e) => {
    const newIndex = Math.round(
      e.nativeEvent.contentOffset.x / (CARD_WIDTH + 32)
    );
    this.setState({ index: newIndex });
  };

  renderItem = ({ item }) => {
    const img = item.image?.startsWith("http")
      ? item.image
      : `${client.defaults.baseURL}${item.image}`;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => this.props.onPress(item)}
        style={styles.card}
      >
        {img && <Image source={{ uri: img }} style={styles.image} />}
        <View style={styles.overlay}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    if (!this.state.items.length) return null;

    return (
      <View style={{ marginBottom: 16 }}>
        <FlatList
          ref={this.listRef}
          data={this.state.items}
          keyExtractor={(i) => i.id.toString()}
          renderItem={this.renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 32}
          decelerationRate="fast"
          onMomentumScrollEnd={this.onMomentumEnd}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 150,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
