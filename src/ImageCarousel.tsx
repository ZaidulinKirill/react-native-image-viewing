/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ComponentType, useCallback, useRef, useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  ViewProps,
  VirtualizedList,
} from "react-native";

import ImageItem from "./components/ImageItem/ImageItem";

import useImageIndexChange from "./hooks/useImageIndexChange";
import { ImageSource } from "./@types";
import useRequestClose from "./hooks/useRequestClose";

type Props = {
  images: ImageSource[];
  keyExtractor?: (image: ImageSource, index: number) => string;
  imageIndex: number;
  onRequestClose: () => void;
  onImageIndexChange?: (imageIndex: number) => void;
  onLongPress?: (image: ImageSource) => void;
  backgroundColor?: string;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
  delayLongPress?: number;
  style?: ViewProps['style'];
  containerWidth?: number
};

const DEFAULT_BG_COLOR = "#000";
const DEFAULT_DELAY_LONG_PRESS = 800;
const SCREEN = Dimensions.get("screen");
const SCREEN_WIDTH = SCREEN.width;

function ImageCarousel({
  images,
  keyExtractor,
  imageIndex,
  onLongPress = () => {},
  onImageIndexChange,
  onRequestClose,
  swipeToCloseEnabled,
  backgroundColor = DEFAULT_BG_COLOR,
  doubleTapToZoomEnabled,
  delayLongPress = DEFAULT_DELAY_LONG_PRESS,
  containerWidth = SCREEN_WIDTH,
  style
}: Props) {
  const imageList = useRef<VirtualizedList<ImageSource>>(null);
  const [currentImageIndex, onScroll] = useImageIndexChange(imageIndex, SCREEN);
  const [opacity, onRequestCloseEnhanced] = useRequestClose(onRequestClose);

  useEffect(() => {
    if (onImageIndexChange) {
      onImageIndexChange(currentImageIndex);
    }
  }, [currentImageIndex]);

  const onZoom = useCallback(
    (isScaled: boolean) => {
      // @ts-ignore
      imageList?.current?.setNativeProps({ scrollEnabled: !isScaled });
    },
    [imageList]
  );

  return (
    <View style={[styles.container, { opacity: 1, backgroundColor }, style]}>
      <VirtualizedList
        ref={imageList}
        data={images}
        horizontal
        pagingEnabled
        windowSize={2}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        initialScrollIndex={imageIndex}
        getItem={(_, index) => images[index]}
        getItemCount={() => images.length}
        getItemLayout={(_, index) => ({
          length: containerWidth,
          offset: containerWidth * index,
          index,
        })}
        renderItem={({ item: imageSrc }) => (
          <ImageItem
            onZoom={onZoom}
            imageSrc={imageSrc}
            onRequestClose={() => {}}
            onLongPress={onLongPress}
            delayLongPress={delayLongPress}
            swipeToCloseEnabled={swipeToCloseEnabled}
            doubleTapToZoomEnabled={doubleTapToZoomEnabled}
          />
        )}
        onMomentumScrollEnd={onScroll}
        //@ts-ignore
        keyExtractor={(imageSrc, index) =>
          keyExtractor
            ? keyExtractor(imageSrc, index)
            : typeof imageSrc === "number"
            ? `${imageSrc}`
            : imageSrc.uri
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    top: 0,
  },
  footer: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    bottom: 0,
  },
});

const EnhancedImageCarousel = (props: Props) => (
  <ImageCarousel key={props.imageIndex} {...props} />
);

export default EnhancedImageCarousel;
