"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface PhotoCard {
  id: string;
  src: string;
  alt: string;
  label: string;
}

const photoCards: PhotoCard[] = [
  { id: "hobby", src: "/images/hobby.png", alt: "Hobby", label: "Hobby" },
  { id: "workspace", src: "/images/workspace.png", alt: "Workspace", label: "Workspace" },
  { id: "seoul", src: "/images/seoul.png", alt: "Seoul", label: "Seoul" },
  { id: "avatar", src: "/images/avatar.png", alt: "Me :)", label: "Me :)" },
];

export default function PhotoStack() {
  const [cards, setCards] = useState<PhotoCard[]>(photoCards);
  const [isSpread, setIsSpread] = useState(false);

  // Click card to bring it to the front (end of the array) and collapse
  const handleCardClick = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent container click from triggering

    if (!isSpread) {
      // If stacked, clicking anywhere spreads the cards
      setIsSpread(true);
    } else {
      // If spread, click a card shuffles it to top and stacks them back
      const clickedCard = cards[index];
      const newCards = [...cards];
      newCards.splice(index, 1);
      newCards.push(clickedCard);
      setCards(newCards);
      setIsSpread(false);
    }
  };

  const handleContainerClick = () => {
    // If stacked, click the container to spread them
    if (!isSpread) {
      setIsSpread(true);
    } else {
      // If spread, click empty container space to stack them back
      setIsSpread(false);
    }
  };

  // Pre-defined offsets for fan-out effect when active
  const getFanStyles = (index: number, total: number) => {
    if (!isSpread) {
      // Stacked offsets
      const rotations = [-5, 3, -2, 4];
      const xOffsets = [-4, 6, -2, 2];
      const yOffsets = [-6, -2, 4, 0];
      return {
        x: xOffsets[index % 4],
        y: yOffsets[index % 4],
        rotate: rotations[index % 4],
        scale: 1,
      };
    }

    // Spread/fan out offsets
    const spreadIndex = index - (total - 1) / 2; // relative index from center
    return {
      x: spreadIndex * 130, // horizontal spread spacing
      y: Math.abs(spreadIndex) * 15 - 10, // slight vertical curve
      rotate: spreadIndex * 8, // fan rotation angle
      scale: 1.05,
    };
  };

  return (
    <div
      onClick={handleContainerClick}
      className="relative w-[320px] h-[340px] flex items-center justify-center cursor-pointer select-none"
    >
      {cards.map((card, index) => {
        const isTopCard = index === cards.length - 1;
        const fan = getFanStyles(index, cards.length);

        return (
          <motion.div
            key={card.id}
            onClick={(e) => handleCardClick(index, e)}
            animate={{
              x: fan.x,
              y: fan.y,
              rotate: fan.rotate,
              scale: fan.scale,
              zIndex: index,
            }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
            }}
            className="group absolute w-[210px] bg-white p-3 pb-8 shadow-xl border border-black/5 rounded-sm origin-center"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100 rounded-sm">
              <Image
                alt={card.alt}
                src={card.id === "avatar" ? `${card.src}?v=3` : card.src}
                fill
                unoptimized={card.id === "avatar"}
                sizes="(max-width: 768px) 100vw, 210px"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[1500ms] ease-in-out pointer-events-none"
                priority={isTopCard}
              />
            </div>
            <p className="mt-3 text-center font-mono text-[10px] italic opacity-60">
              {card.label}
            </p>
          </motion.div>
        );
      })}

      {/* Floating Instructions Text */}
      <motion.div
        animate={{ opacity: 0.4 }}
        className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest pointer-events-none text-black font-mono text-center"
      >
        {isSpread ? "Click Card to Stack" : "Click Stack to Spread"}
      </motion.div>
    </div>
  );
}
