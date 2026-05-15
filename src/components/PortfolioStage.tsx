"use client";
// 프로젝트 자료를 Stage Manager형 3D 포트폴리오 화면으로 구성하는 앱

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Mail, RotateCcw } from "lucide-react";
import * as THREE from "three";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import styles from "./PortfolioStage.module.css";

type StagePlane = {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  idle: THREE.Vector3;
  staged: THREE.Vector3;
  idleRotation: THREE.Euler;
  stagedRotation: THREE.Euler;
};

const stageProjects = projects.slice(0, 10);

export default function PortfolioStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const selectedRef = useRef<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedProject = selectedIndex === null ? null : stageProjects[selectedIndex];
  const stageMode = selectedIndex !== null;

  const proof = useMemo(
    () => [
      { label: "frontend", value: "2년 10개월" },
      { label: "shipped", value: "10+" },
      { label: "product flow", value: "6+" },
    ],
    [],
  );

  useEffect(() => {
    selectedRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.15, 8.4);

    const stack = new THREE.Group();
    scene.add(stack);

    const loader = new THREE.TextureLoader();
    const planes: StagePlane[] = stageProjects.map((project, index) => {
      const texture = loader.load(project.imageUrl);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        opacity: 0.9,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.74), material);
      const offset = index - (stageProjects.length - 1) / 2;
      const idle = new THREE.Vector3(offset * 0.38, -offset * 0.11, -Math.abs(offset) * 0.16);
      const staged = new THREE.Vector3(-3.55, 1.85 - index * 0.42, -index * 0.04);
      const idleRotation = new THREE.Euler(-0.12, -offset * 0.075, -offset * 0.038);
      const stagedRotation = new THREE.Euler(-0.04, 0.24, 0.012);

      mesh.position.copy(idle);
      mesh.rotation.copy(idleRotation);
      mesh.renderOrder = stageProjects.length - index;
      stack.add(mesh);

      return { mesh, idle, staged, idleRotation, stagedRotation };
    });

    const railGeometry = new THREE.TorusGeometry(3.9, 0.008, 8, 140);
    const railMaterial = new THREE.MeshBasicMaterial({
      color: 0x8ec5ff,
      opacity: 0.18,
      transparent: true,
    });
    const rail = new THREE.Mesh(railGeometry, railMaterial);
    rail.rotation.x = Math.PI * 0.5;
    rail.position.z = -2.1;
    scene.add(rail);

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    let frame = 0;
    let animationId = 0;
    const animate = () => {
      frame += 0.012;
      const activeIndex = selectedRef.current;
      const isStaged = activeIndex !== null;

      planes.forEach((plane, index) => {
        const active = index === activeIndex;
        const position = isStaged ? plane.staged : plane.idle;
        const rotation = isStaged ? plane.stagedRotation : plane.idleRotation;
        const scale = active ? 1.1 : isStaged ? 0.84 : 1;
        const opacity = active ? 0.96 : isStaged ? 0.46 : 0.9;

        plane.mesh.position.lerp(position, 0.07);
        plane.mesh.rotation.x += (rotation.x - plane.mesh.rotation.x) * 0.07;
        plane.mesh.rotation.y += (rotation.y - plane.mesh.rotation.y) * 0.07;
        plane.mesh.rotation.z += (rotation.z - plane.mesh.rotation.z) * 0.07;
        plane.mesh.scale.lerp(new THREE.Vector3(scale, scale, 1), 0.08);
        plane.mesh.material.opacity += (opacity - plane.mesh.material.opacity) * 0.08;
        plane.mesh.position.y += Math.sin(frame + index * 0.6) * 0.0016;
      });

      stack.rotation.y = Math.sin(frame * 0.7) * (isStaged ? 0.012 : 0.036);
      rail.rotation.z += 0.0012;
      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
      planes.forEach((plane) => {
        plane.mesh.geometry.dispose();
        plane.mesh.material.map?.dispose();
        plane.mesh.material.dispose();
      });
      railGeometry.dispose();
      railMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <main className={`${styles.stage} ${stageMode ? styles.stageOpen : ""}`}>
      <div className={styles.canvasLayer}>
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>

      <nav className={styles.topbar} aria-label="포트폴리오 내비게이션">
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark} />
          <span>
            <strong>{profile.businessName}</strong>
            <small>three.js portfolio</small>
          </span>
        </Link>
        <div className={styles.topActions}>
          <a href={profile.contact.github} target="_blank" rel="noopener noreferrer">
            GitHub
            <ArrowUpRight size={15} />
          </a>
          <a href={`mailto:${profile.contact.email}`}>
            Contact
            <Mail size={15} />
          </a>
        </div>
      </nav>

      <section className={styles.workspace} aria-label="프로젝트 작업대">
        <aside className={styles.leftDock}>
          <div className={styles.intro}>
            <p className={styles.kicker}>stage manager archive</p>
            <h1>폴더를 넘기듯 프로젝트를 엽니다.</h1>
            <p>
              기존 섹션형 포트폴리오를 지우고, 프로젝트 이미지가 위아래로 쌓인
              작업대에서 바로 선택하고 탐색하는 화면으로 다시 구성했습니다.
            </p>
          </div>

          <div className={styles.proofGrid}>
            {proof.map((item) => (
              <div key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.projectRail} aria-label="프로젝트 목록">
            {stageProjects.map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={selectedIndex === index ? styles.activeThumb : ""}
              >
                <span className={styles.thumbImage}>
                  <Image
                    src={project.imageUrl}
                    alt=""
                    fill
                    sizes="96px"
                    className={styles.coverImage}
                  />
                </span>
                <span className={styles.thumbText}>
                  <strong>{project.title}</strong>
                  <small>{project.techStack.slice(0, 2).join(" / ")}</small>
                </span>
              </button>
            ))}
          </div>

          <div className={styles.leftDockFooter}>
            {stageMode ? (
              <button type="button" onClick={() => setSelectedIndex(null)}>
                <RotateCcw size={16} />
                전체 폴더 보기
              </button>
            ) : (
              <button type="button" onClick={() => setSelectedIndex(0)}>
                첫 프로젝트 열기
                <ArrowUpRight size={16} />
              </button>
            )}
          </div>
        </aside>

        <section className={styles.fileDeck} aria-label="프로젝트 파일 더미">
          {!stageMode ? (
            <div className={styles.folderStack}>
              {stageProjects.slice(0, 7).map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={styles.folderCard}
                  style={{
                    "--folder-index": index,
                    "--folder-accent": project.accentColor,
                  } as CSSProperties}
                >
                  <span className={styles.folderTab}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.folderImage}>
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      priority={index < 2}
                      sizes="(max-width: 900px) 88vw, 52vw"
                      className={styles.coverImage}
                    />
                  </span>
                  <span className={styles.folderMeta}>
                    <strong>{project.title}</strong>
                    <small>{project.summary}</small>
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {selectedProject ? (
            <article className={styles.detailPanel}>
              <div
                className={styles.detailGlow}
                style={{ background: selectedProject.accentColor }}
              />
              <div className={styles.detailImage}>
                <Image
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  fill
                  priority
                  sizes="(max-width: 900px) 92vw, 48vw"
                  className={styles.coverImage}
                />
              </div>
              <div className={styles.detailCopy}>
                <p className={styles.kicker}>opened project</p>
                <h2>{selectedProject.title}</h2>
                <p>{selectedProject.summary}</p>
                {selectedProject.origin ? (
                  <blockquote>{selectedProject.origin}</blockquote>
                ) : null}
                <div className={styles.techList}>
                  {selectedProject.techStack.slice(0, 7).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
                <div className={styles.detailActions}>
                  <Link href={`/projects/${selectedProject.id}`} prefetch={false}>
                    자세히 보기
                    <ArrowUpRight size={16} />
                  </Link>
                  {selectedProject.liveUrl ? (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      실행 화면
                      <ArrowUpRight size={16} />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ) : null}
        </section>
      </section>
    </main>
  );
}
