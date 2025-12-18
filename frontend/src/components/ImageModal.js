// frontend/src/components/ImageModal.js
import React from "react";
import { Modal, View, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

export default function ImageModal({ visible, images = [], index = 0, onClose = () => {} }) {
  if (!visible) return null;
  const uri = images[index] || images[0] || null;
  const { width } = Dimensions.get("window");

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.wrapper}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.content}>
          {uri ? <Image source={{ uri }} style={{ width: width - 40, height: (width - 40) * 0.6, borderRadius: 8 }} resizeMode="contain" /> : null}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}><View style={{ padding: 8 }} /></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  backdrop: { ...StyleSheet.absoluteFillObject },
  content: { alignItems: "center" },
  closeBtn: { marginTop: 12 },
});
