"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import MyIcons from "./MyIcons";

export default function CustomVideoPlayer() {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => setPlaying(true);

  return (
    <div className="sticky top-0 z-50 w-full bg-white px-3">
      {!playing ? (
        <div className="relative">
          <Image
            src="/poster-img.png"
            alt="video poster"
            className="w-full h-[290px] sm:h-[380px] object-cover rounded-lg"
            width={800}
            height={700}
          />
          <Button
            onClick={handlePlay}
            className="absolute bg-white hover:bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center"
          >
            <div className="w-0 h-0 border-l-[20px] border-l-red-600 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent" />
          </Button>
        </div>
      ) : (
        <iframe
          className="w-full h-[290px] sm:h-[380px] rounded-lg"
          src="https://www.youtube.com/embed/TZe5UqlUg0c?autoplay=1"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}

      <MyIcons />
    </div>
  );
}
