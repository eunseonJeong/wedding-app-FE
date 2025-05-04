import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export const useScrollObserver = () => {
  const [activeSection, setActiveSection] = useState("hero");

  // 각 섹션에 대한 intersection observer hook 설정
  const { ref: heroRef, inView: heroInView } = useInView({ threshold: 0.5 });
  const { ref: coupleRef, inView: coupleInView } = useInView({
    threshold: 0.5,
  });
  const { ref: galleryRef, inView: galleryInView } = useInView({
    threshold: 0.5,
  });
  const { ref: locationRef, inView: locationInView } = useInView({
    threshold: 0.5,
  });
  const { ref: messageRef, inView: messageInView } = useInView({
    threshold: 0.5,
  });

  // 현재 보이는 섹션 업데이트
  useEffect(() => {
    if (heroInView) setActiveSection("hero");
    else if (coupleInView) setActiveSection("couple");
    else if (galleryInView) setActiveSection("gallery");
    else if (locationInView) setActiveSection("location");
    else if (messageInView) setActiveSection("message");
  }, [heroInView, coupleInView, galleryInView, locationInView, messageInView]);

  return {
    activeSection,
    refs: {
      heroRef,
      coupleRef,
      galleryRef,
      locationRef,
      messageRef,
    },
  };
};
