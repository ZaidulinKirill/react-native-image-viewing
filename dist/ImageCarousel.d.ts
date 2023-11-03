/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
import { ImageSource } from "./@types";
declare type Props = {
    images: ImageSource[];
    keyExtractor?: (image: ImageSource, index: number) => string;
    imageIndex: number;
    onImageIndexChange?: (imageIndex: number) => void;
    onLongPress?: (image: ImageSource) => void;
    backgroundColor?: string;
    swipeToCloseEnabled?: boolean;
    doubleTapToZoomEnabled?: boolean;
    delayLongPress?: number;
};
declare const EnhancedImageCarousel: (props: Props) => JSX.Element;
export default EnhancedImageCarousel;
