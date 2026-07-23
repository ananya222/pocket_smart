import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './OptionCard.styles';

export default function OptionCard({ 
  title, 
  description, 
  iconType, 
  iconName, 
  isSelected, 
  onPress,
  containerStyle
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[{ width: "100%", marginBottom: 12 }, containerStyle]}
    >
      <BlurView
        intensity={100}
        tint="dark"
        style={[styles.optionCard, isSelected && styles.optionCardSelected]}
      >
        <View style={styles.optionHeaderRow}>
          <View style={styles.optionTitleBlock}>
            {iconType === 'feather' ? (
              <Feather name={iconName} size={20} color={isSelected ? "#9D4EDD" : "#8A90A8"} />
            ) : (
              <MaterialCommunityIcons name={iconName} size={22} color={isSelected ? "#9D4EDD" : "#8A90A8"} />
            )}
            <Text style={[styles.optionTitle, isSelected && styles.optionTitleActive]}>
              {title}
            </Text>
          </View>
          <View style={[styles.radioCircle, isSelected && styles.radioCircleActive]}>
            {isSelected && <View style={styles.radioDot} />}
          </View>
        </View>
        <Text style={styles.optionDescription}>{description}</Text>
      </BlurView>
    </TouchableOpacity>
  );
}
