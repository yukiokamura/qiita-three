import Head from "next/head";
import { useEffect, useRef } from "react";
import { useAnimationFrame } from "../customHooks/useAnimationFrame";
import styles from "../styles/Home.module.css";
import GL from "../gl";
import GUI from "lil-gui";
import Stats from "three/examples/jsm/libs/stats.module.js";
export default function Home() {
  const glRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const guiRef = useRef(null);
  const statsRef = useRef(null);
  useEffect(() => {
    const resizeHandler = (e) => {
      glRef.current.onResize(window.innerWidth, window.innerHeight);
    };
    statsRef.current = new Stats();
    canvasWrapRef.current.appendChild(statsRef.current.dom);
    guiRef.current = new GUI();
    glRef.current = new GL(canvasWrapRef.current, guiRef.current);

    window.addEventListener("resize", resizeHandler);

    return (e) => {
      window.removeEventListener("resize", resizeHandler);
      glRef.current.destory();
    };
  }, []);

  useAnimationFrame(() => {
    if (statsRef.current) statsRef.current.update();
    if (glRef.current) glRef.current.update();
  });
  return (
    <div className={styles.container}>
      <Head>
        <title>Qiita particle three.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.canvas} ref={canvasWrapRef}>
        <canvas></canvas>
      </div>
    </div>
  );
}
