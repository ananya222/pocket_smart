import React from "react";
import { View, Text } from "react-native";
import { styles } from "./SavingsGoalPreview.styles";

export default function SavingsGoalPreview({ searchQuery, renderGoalIllustration, metrics }) {
  return (
    <>
      <Text style={styles.sectionTitle}>Goal Preview:</Text>
      <View
        style={[
          styles.previewCard,
          { marginBottom: metrics.marginSpacing, padding: metrics.innerCardPadding },
        ]}
      >
        <View
          style={[
            styles.previewImageContainer,
            { width: metrics.previewSize, height: metrics.previewSize },
          ]}
        >
          {renderGoalIllustration(metrics.previewImgSize)}
        </View>
        <Text style={styles.previewText} numberOfLines={2}>
          {searchQuery || "Savings Goal"}
        </Text>
      </View>
    </>
  );
}
