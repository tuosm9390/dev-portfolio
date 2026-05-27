"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

const WHEEL_TRANSITION_THRESHOLD = 32;

interface Page3DRollerProps {
  children: React.ReactNode[];
}

export default function Page3DRoller({ children }: Page3DRollerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartY = useRef(0);
  const wheelAccumulatorRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(currentIndex);

  const totalSections = children.length;

  // 각 섹션의 id 추출
  const sectionIds = React.useMemo(() => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return (child.props as { id?: string }).id || "";
      }
      return "";
    }) || [];
  }, [children]);

  // 모바일/태블릿 디바이스 판단 (반응형 2D 폴백용)
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // 3D 회전 애니메이션 실행 함수
  const rotateTo = useCallback(
    async (nextIndex: number) => {
      if (
        isAnimatingRef.current ||
        nextIndex === currentIndexRef.current ||
        nextIndex < 0 ||
        nextIndex >= totalSections
      ) {
        return;
      }
      isAnimatingRef.current = true;
      setIsAnimating(true);
      setCurrentIndex(nextIndex);
      currentIndexRef.current = nextIndex;

      // 모션 진행 시간(0.8초) 동안 추가 제스처 입력 차단
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 롤링 완료 후 URL 해시 silent 업데이트
      const targetId = sectionIds[nextIndex];
      if (targetId && window.location.hash !== `#${targetId}`) {
        window.history.pushState(null, "", `#${targetId}`);
      } else if (nextIndex === 0 && window.location.hash !== "" && window.location.hash !== "#top") {
        window.history.pushState(null, "", window.location.pathname + window.location.search);
      }

      setIsAnimating(false);
      isAnimatingRef.current = false;
    },
    [sectionIds, totalSections]
  );

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const getActiveScrollState = useCallback((direction: "UP" | "DOWN") => {
    const activeSection = sectionRefs.current[currentIndexRef.current];
    if (!activeSection) {
      return { canScrollFurther: false, scrollContainer: null };
    }

    const scrollContainer =
      (activeSection.querySelector(".scroll-container") as HTMLElement) ||
      activeSection;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
    const isScrollable = scrollHeight > clientHeight + 20;

    if (!isScrollable) {
      return { canScrollFurther: false, scrollContainer };
    }

    const canScrollFurther =
      direction === "DOWN"
        ? scrollTop + clientHeight < scrollHeight - 15
        : scrollTop > 15;

    return { canScrollFurther, scrollContainer };
  }, []);

  // 해시 변경 감지 및 최초 로드 시 해시 이동 처리
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) {
        rotateTo(0);
        return;
      }

      if (hash === "top") {
        rotateTo(0);
        return;
      }

      const targetIdx = sectionIds.findIndex((id) => id === hash);
      if (targetIdx !== -1) {
        rotateTo(targetIdx);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // 컴포넌트 마운트 시 최초 해시 체크 (약간의 딜레이를 주어 hydration과 Next.js 렌더링 후 이동되게 함)
    const timer = setTimeout(handleHashChange, 150);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      clearTimeout(timer);
    };
  }, [sectionIds, rotateTo]);

  // 이전/다음 섹션 이동 판별
  const handleScrollDirection = useCallback(
    (direction: "UP" | "DOWN", event: Event) => {
      if (isAnimating) {
        event.preventDefault();
        return;
      }

      const { canScrollFurther } = getActiveScrollState(direction);
      if (canScrollFurther) {
        return;
      }

      // 스크롤이 끝에 도달했거나 스크롤이 불가한 경우 -> 3D 롤링 개시 및 이벤트 차단
      event.preventDefault();

      if (direction === "DOWN" && currentIndex < totalSections - 1) {
        rotateTo(currentIndex + 1);
      } else if (direction === "UP" && currentIndex > 0) {
        rotateTo(currentIndex - 1);
      }
    },
    [currentIndex, getActiveScrollState, isAnimating, totalSections, rotateTo]
  );

  // 마우스 휠 이벤트 (델타 누적 및 디바운스식 연속 스크롤 제어)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimatingRef.current) {
        // 애니메이션 도중 들어온 모든 휠 이벤트는 무시하고 누적치 리셋
        wheelAccumulatorRef.current = 0;
        e.preventDefault();
        return;
      }

      const direction = e.deltaY > 0 ? "DOWN" : "UP";
      const { canScrollFurther } = getActiveScrollState(direction);

      if (canScrollFurther) {
        wheelAccumulatorRef.current = 0;
        return;
      }

      // 반대 방향 휠 조작 시 이전 누적치 정화(리셋)
      if (
        (wheelAccumulatorRef.current > 0 && e.deltaY < 0) ||
        (wheelAccumulatorRef.current < 0 && e.deltaY > 0)
      ) {
        wheelAccumulatorRef.current = 0;
      }

      // 델타 값 누적
      wheelAccumulatorRef.current += e.deltaY;

      // 짧은 휠 제스처에도 섹션 전환이 시작되도록 낮은 임계치만 적용
      if (Math.abs(wheelAccumulatorRef.current) >= WHEEL_TRANSITION_THRESHOLD) {
        const nextDirection = wheelAccumulatorRef.current > 0 ? "DOWN" : "UP";
        wheelAccumulatorRef.current = 0; // 누적치 즉시 초기화
        handleScrollDirection(nextDirection, e);
      } else {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [getActiveScrollState, handleScrollDirection]);

  // 터치 이벤트 (모바일/트랙패드 제스처)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const activeSection = sectionRefs.current[currentIndex];
      if (!activeSection) return;

      const scrollContainer =
        (activeSection.querySelector(".scroll-container") as HTMLElement) ||
        activeSection;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isScrollable = scrollHeight > clientHeight + 5;

      const touchCurrentY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchCurrentY;

      if (isScrollable) {
        // 내부 스크롤 처리 중일 때는 swipe 가로채지 않고 터치 스크롤 허용
        if (deltaY > 0 && scrollTop + clientHeight < scrollHeight - 5) {
          return;
        }
        if (deltaY < 0 && scrollTop > 5) {
          return;
        }
      }

      // 오버플로우 한계 돌파 시 기본 스크롤 차단
      if (Math.abs(deltaY) > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      // 최소 40px 이상의 확실한 드래그가 일어났을 때만 트리거
      if (Math.abs(deltaY) < 40) return;

      const direction = deltaY > 0 ? "DOWN" : "UP";
      handleScrollDirection(direction, e);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex, handleScrollDirection]);

  // 키보드 방향키 내비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 폼에 포커스가 있을 때는 작동 안 함
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.hasAttribute("contenteditable"))
      ) {
        return;
      }

      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        handleScrollDirection("DOWN", e);
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        handleScrollDirection("UP", e);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleScrollDirection]);

  return (
    <div ref={containerRef} className="cube-viewport">
      <div
        className="cube-roller"
        style={
          isMobile
            ? { transform: "none", transformOrigin: "center" }
            : { transform: "translateZ(-50vh)", transformStyle: "preserve-3d" }
        }
      >
        {children.map((child, idx) => {
          // 최적화: 현재 보이는 인덱스 주변 (-1, 0, +1) 면만 노출하여 성능 병목 차단
          const isVisible = Math.abs(idx - currentIndex) <= 1;

          return (
            <motion.div
              key={idx}
              ref={(el) => {
                sectionRefs.current[idx] = el;
              }}
              className="cube-face"
              initial={false}
              animate={{
                transform: isMobile
                  ? `translateY(${(idx - currentIndex) * 100}vh) translateZ(0px) rotateX(0deg)`
                  : `rotateX(${(currentIndex - idx) * 90}deg) translateZ(50vh)`,
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 1, 0.5, 1],
              }}
              style={{
                display: isVisible ? "block" : "none",
                transformOrigin: "center center",
                pointerEvents: idx === currentIndex ? "auto" : "none",
              }}
            >
              {child}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
