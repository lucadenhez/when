"use client";

// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import PhoneAuthComponent from "./test_components/phone_number_test";
import Link from "next/link";
import { motion } from "framer-motion";
import ParticlesBackground from "./components/particles_background.jsx";

interface Props {
  containerRef: MutableRefObject<HTMLDivElement | null>;
}

const MovingButterfly = ({ containerRef }: Props) => {
  return (
    <div className="text-center w-full flex justify-center z-10 animate-bounce">
      <motion.div drag dragConstraints={containerRef}>
        <img className="size-10" src={"images/icons/when_icon.png"}></img>
      </motion.div>
    </div>
  );
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#89CFF0_100%)]"></div>
      <div className="h-screen w-full relative">
        <ParticlesBackground />
        <div
          ref={containerRef}
          className="absolute inset-0 grid place-content-center overflow-hidden space-y-2 z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <MovingButterfly containerRef={containerRef} />
          </motion.div>
          <div className="text-center m-auto space-y-5">
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <h1 className="text-4xl font-bold">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 inline-block text-transparent bg-clip-text">
                    When
                  </span>
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <h2 className="text-lg font-semibold">
                  Collaborative planning made simple.
                </h2>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={"/login"}>
                  <button className="text-lg font-semibold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 py-3 px-6 rounded-full text-white">
                    Let's go!
                  </button>
                </Link>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="">
        <PhoneAuthComponent />
      </div>
    </>
  );
}
