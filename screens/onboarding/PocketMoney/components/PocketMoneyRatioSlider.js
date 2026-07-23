import React, { useRef, useState } from "react";
import { View, Text, Platform } from "react-native";
import { styles } from "./PocketMoneyRatioSlider.styles";

export default function PocketMoneyRatioSlider({ savingRatio, onRatioChange }) {
  const containerRef = useRef(null);
  const [sliderLayout, setSliderLayout] = useState({ pageY: 0, height: 240 });

  const measureSlider = () => {
    if (containerRef.current) {
      containerRef.current.measure((x, y, w, h, pageX, pageYOffset) => {
        if (h > 0) {
          setSliderLayout({ pageY: pageYOffset, height: h });
        }
      });
    }
  };

  const handleTouch = (pageY) => {
    const { pageY: pageYOffset, height: trackContainerHeight } = sliderLayout;
    if (trackContainerHeight === 0) return;

    const relativeY = pageY - pageYOffset;
    const margin = 10;
    const clampedY = Math.max(margin, Math.min(trackContainerHeight - margin, relativeY));
    const trackHeight = trackContainerHeight - margin * 2;
    const ratio = 1 - (clampedY - margin) / trackHeight;
    // Round to nearest 5 for clean snapping
    const newRatio = Math.round(ratio * 100 / 5) * 5;
    onRatioChange(Math.max(0, Math.min(100, newRatio)));
  };

  const spendingPercent = 100 - savingRatio;
  const trackHeight = sliderLayout.height - 20;
  const knobBottom = (savingRatio / 100) * trackHeight - 4;

  return (
    <View style={styles.sliderColumn}>
      <Text style={styles.sliderLabel}>Spending</Text>

      <View
        ref={containerRef}
        style={styles.sliderTrackContainer}
        onLayout={measureSlider}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={(evt) => handleTouch(evt.nativeEvent.pageY)}
        onResponderMove={(evt) => handleTouch(evt.nativeEvent.pageY)}
      >
        <View style={styles.sliderTrack}>
          <View
            style={[
              styles.sliderActiveTrack,
              { height: `${spendingPercent}%` },
            ]}
          />
        </View>

        <View style={[styles.sliderThumb, { bottom: knobBottom }]}>
          <View style={styles.sliderThumbInner} />
        </View>
      </View>

      <Text style={styles.sliderLabel}>Saving</Text>
    </View>
  );
}
