"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";

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
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(nextIndex);

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
    },
    [isAnimating, sectionIds]
  );

  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

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

      const activeSection = sectionRefs.current[currentIndex];
      if (!activeSection) return;

      // 자식 요소 중 스크롤 영역 (.scroll-container) 탐색, 없으면 자기 자신
      const scrollContainer =
        (activeSection.querySelector(".scroll-container") as HTMLElement) ||
        activeSection;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      // 화면 높이 대비 20px 이상 여백이 존재할 때만 스크롤 가능 영역으로 판단
      const isScrollable = scrollHeight > clientHeight + 20;

      if (isScrollable) {
        if (direction === "DOWN") {
          // 소수점 픽셀 렌더링 오차를 극복하기 위해 15px 마진 적용
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 15;
          if (!isAtBottom) {
            // 아직 내부 스크롤이 끝까지 안 내려갔으므로 네이티브 스크롤을 하도록 허용
            return;
          }
        } else if (direction === "UP") {
          // 소수점 픽셀 렌더링 오차를 극복하기 위해 15px 마진 적용
          const isAtTop = scrollTop <= 15;
          if (!isAtTop) {
            // 아직 맨 위가 아니므로 네이티브 스크롤을 위로 올리도록 허용
            return;
          }
        }
      }

      // 스크롤이 끝에 도달했거나 스크롤이 불가한 경우 -> 3D 롤링 개시 및 이벤트 차단
      event.preventDefault();

      if (direction === "DOWN" && currentIndex < totalSections - 1) {
        rotateTo(currentIndex + 1);
      } else if (direction === "UP" && currentIndex > 0) {
        rotateTo(currentIndex - 1);
      }
    },
    [currentIndex, isAnimating, totalSections, rotateTo]
  );

  // 마우스 휠 이벤트 (델타 누적 및 디바운스식 연속 스크롤 제어)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isAnimating) {
        // 애니메이션 도중 들어온 모든 휠 이벤트는 무시하고 누적치 리셋
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

      // 누적 델타량이 임계치(80px)를 넘었을 때만 롤링 방향 감지하여 가동
      if (Math.abs(wheelAccumulatorRef.current) >= 80) {
        const direction = wheelAccumulatorRef.current > 0 ? "DOWN" : "UP";
        wheelAccumulatorRef.current = 0; // 누적치 즉시 초기화
        handleScrollDirection(direction, e);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isAnimating, handleScrollDirection]);

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
