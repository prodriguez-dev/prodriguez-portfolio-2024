declare module "nuka-carousel" {
  import * as React from "react";

  export interface CarouselProps {
    autoplay?: boolean;
    autoplayInterval?: number;
    wrapAround?: boolean;
    speed?: number;
    renderCenterLeftControls?: (params: {
      previousSlide: () => void;
    }) => React.ReactNode;
    renderCenterRightControls?: (params: {
      nextSlide: () => void;
    }) => React.ReactNode;
    renderBottomCenterControls?: (params: {
      currentSlide: number;
    }) => React.ReactNode;
    children?: React.ReactNode; // Add this line
  }

  const Carousel: React.FC<CarouselProps>;
  export default Carousel;
}
