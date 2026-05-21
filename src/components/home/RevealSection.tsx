"use client";
// 섹션 진입 시 공통 fade-up 모션을 적용하는 래퍼 컴포넌트

import { motion, useReducedMotion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealSectionProps = HTMLMotionProps<"section"> & {
  children: ReactNode;
  innerClassName?: string;
};

export default function RevealSection({
  children,
  className,
  innerClassName,
  ...props
}: RevealSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { duration: 0.24 },
        },
      }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.48,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        },
      };

  return (
    <motion.section
      className={cn("px-5 py-20 sm:px-8 lg:py-28", className)}
      initial="hidden"
      variants={variants}
      viewport={{ once: true, margin: "-80px" }}
      whileInView="visible"
      {...props}
    >
      <div className={cn("mx-auto max-w-[1120px]", innerClassName)}>
        {children}
      </div>
    </motion.section>
  );
}
