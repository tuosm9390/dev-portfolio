"use client";
// 프로젝트 목록을 3D 파일 스택과 Stage Manager 레이아웃으로 보여주는 첫 화면

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ExternalLink, Layers3, RotateCcw } from "lucide-react";
import * as THREE from "three";
import { projects } from "@/data/projects";

type StagePlane = {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  idle: THREE.Vector3;
  selected: THREE.Vector3;
  rotationIdle: THREE.Euler;
  rotationSelected: THREE.Euler;
};

const visibleProjects = projects.slice(0, 8);

export default function PortfolioStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const selectedIndexRef = useRef<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedProject = selectedIndex === null ? null : visibleProjects[selectedIndex];
  const isSelected = selectedIndex !== null;

  const stageCopy = useMemo(
    () => ({
      eyebrow: "three.js portfolio stage",
      title: "프로젝트를 파일처럼 펼쳐 보는 작업대.",
      body:
        "서류 폴더처럼 쌓인 작업물을 고르면, 목록은 왼쪽 스택으로 물러나고 선택한 프로젝트가 작업 화면에 열립니다.",
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.2, 8.5);

    const group = new THREE.Group();
    scene.add(group);

    const textureLoader = new THREE.TextureLoader();
    const planes: StagePlane[] = visibleProjects.map((project, index) => {
      const texture = textureLoader.load(project.imageUrl);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.86,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.65, 1.72), material);
      const offset = index - (visibleProjects.length - 1) / 2;
      const idle = new THREE.Vector3(offset * 0.46, -offset * 0.08, -Math.abs(offset) * 0.18);
      const selected = new THREE.Vector3(-3.65, 1.55 - index * 0.42, -index * 0.08);
      const rotationIdle = new THREE.Euler(-0.12, offset * -0.09, offset * -0.035);
      const rotationSelected = new THREE.Euler(-0.05, 0.22, 0.02);

      mesh.position.copy(idle);
      mesh.rotation.copy(rotationIdle);
      mesh.renderOrder = visibleProjects.length - index;
      group.add(mesh);

      return { mesh, idle, selected, rotationIdle, rotationSelected };
    });

    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0x93a4ff,
      transparent: true,
      opacity: 0.18,
    });
    const grid = new THREE.GridHelper(9, 16, 0x93a4ff, 0x93a4ff);
    grid.material = wireMaterial;
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -1.85;
    grid.position.y = -1.1;
    scene.add(grid);

    let frame = 0;
    let animationId = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      frame += 0.01;
      const currentSelected = selectedIndexRef.current;
      const selectedMode = currentSelected !== null;

      planes.forEach((plane, index) => {
        const destination = selectedMode ? plane.selected : plane.idle;
        const rotation = selectedMode ? plane.rotationSelected : plane.rotationIdle;
        const active = index === currentSelected;

        plane.mesh.position.lerp(destination, 0.065);
        plane.mesh.rotation.x += (rotation.x - plane.mesh.rotation.x) * 0.07;
        plane.mesh.rotation.y += (rotation.y - plane.mesh.rotation.y) * 0.07;
        plane.mesh.rotation.z += (rotation.z - plane.mesh.rotation.z) * 0.07;
        plane.mesh.position.y += Math.sin(frame + index * 0.7) * 0.0018;
        plane.mesh.scale.lerp(
          new THREE.Vector3(active ? 1.12 : 1, active ? 1.12 : 1, 1),
          0.08,
        );
        plane.mesh.material.opacity += ((active ? 0.98 : selectedMode ? 0.58 : 0.86) - plane.mesh.material.opacity) * 0.08;
      });

      group.rotation.y = Math.sin(frame * 0.7) * (selectedMode ? 0.015 : 0.035);
      grid.rotation.z += 0.0008;
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
      grid.geometry.dispose();
      wireMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  return (
    <section className="relative min-h-screen overflow-hidden px-4 pb-10 pt-26 md:px-6 md:pt-30">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,22,0.18),rgba(7,10,22,0.8))]" />
      <div className="section-shell relative min-h-[calc(100vh-8rem)]">
        <div className="absolute inset-0 min-h-[48rem] overflow-hidden rounded-[2.2rem] border border-white/8 bg-[linear-gradient(145deg,rgba(18,23,39,0.82),rgba(7,9,18,0.96))] shadow-[0_32px_90px_rgba(0,0,0,0.34)]">
          <canvas
            ref={canvasRef}
            className="h-full w-full"
            aria-hidden="true"
          />
        </div>

        <div className={`relative grid min-h-[calc(100vh-8rem)] gap-5 py-6 transition-[grid-template-columns] duration-500 lg:py-8 ${isSelected ? "lg:grid-cols-[13rem_minmax(0,1fr)]" : "lg:grid-cols-[minmax(0,0.88fr)_minmax(460px,1.12fr)]"}`}>
          <div className={`z-10 flex flex-col justify-between rounded-[1.8rem] border border-white/10 bg-black/18 p-5 backdrop-blur-md transition-all duration-500 md:p-6 ${isSelected ? "lg:min-h-full" : "lg:max-w-[33rem]"}`}>
            <div>
              <span className="eyebrow">{stageCopy.eyebrow}</span>
              {!isSelected ? (
                <>
                  <h1 className="mt-6 max-w-[12ch] text-[clamp(2.5rem,8vw,5.8rem)] font-semibold leading-[0.95] text-white">
                    {stageCopy.title}
                  </h1>
                  <p className="body-copy mt-6">{stageCopy.body}</p>
                </>
              ) : (
                <>
                  <p className="mt-6 text-xs uppercase tracking-[0.18em] text-white/38">
                    project stack
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">
                    선택한 파일을 중심으로 봅니다.
                  </h2>
                </>
              )}
            </div>

            <div className={`${isSelected ? "mt-7 space-y-3" : "mt-8 grid gap-3 sm:grid-cols-2 lg:hidden"}`}>
              {visibleProjects.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`group flex min-h-20 w-full items-center gap-3 rounded-[1.15rem] border p-2 text-left ${selectedIndex === index ? "border-white/28 bg-white/12" : "border-white/8 bg-white/[0.045] hover:border-white/16 hover:bg-white/[0.075]"}`}
                >
                  <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-[0.8rem] border border-white/10 bg-black/20">
                    <Image
                      src={project.imageUrl}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover object-top"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-white/86">
                      {project.title}
                    </span>
                    <span className="mt-1 block truncate text-xs text-white/44">
                      {project.techStack.slice(0, 2).join(" / ")}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {isSelected ? (
                <button
                  type="button"
                  onClick={() => setSelectedIndex(null)}
                  className="secondary-button px-4 py-2 text-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  전체 보기
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(0)}
                    className="primary-button"
                  >
                    첫 프로젝트 열기
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <Link href="#contact" className="secondary-button">
                    협업 문의
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="relative z-10 hidden min-h-[34rem] lg:block">
            {!isSelected ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-[42rem]">
                  {visibleProjects.slice(0, 6).map((project, index) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setSelectedIndex(index)}
                      className="group absolute left-1/2 top-1/2 block w-[min(38rem,46vw)] origin-center overflow-hidden rounded-[1.4rem] border border-white/12 bg-black/24 text-left shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-sm"
                      style={{
                        transform: `translate(-50%, -50%) translate(${(index - 2.5) * 34}px, ${(index - 2.5) * 18}px) rotate(${(index - 2.5) * -3.2}deg)`,
                        zIndex: 20 - index,
                      }}
                    >
                      <span className="relative block aspect-[16/9]">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          sizes="46vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
                        <span className="absolute bottom-5 left-5 right-5">
                          <span className="surface-chip border-white/12 bg-black/32 text-white/72">
                            {String(index + 1).padStart(2, "0")}
                            {project.techStack[0]}
                          </span>
                          <span className="mt-3 block text-3xl font-semibold leading-none text-white">
                            {project.title}
                          </span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedProject ? (
              <article className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(22,27,44,0.94),rgba(8,10,19,0.98))] p-6 shadow-[0_28px_80px_rgba(0,0,0,0.36)]">
                <div
                  className="absolute inset-x-0 top-0 h-44 opacity-55"
                  style={{
                    background: `linear-gradient(135deg, ${selectedProject.accentColor}55, transparent 62%)`,
                  }}
                />
                <div className="relative grid h-full grid-rows-[minmax(0,1fr)_auto] gap-6">
                  <div className="grid min-h-0 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                    <div className="relative min-h-[22rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/24">
                      <Image
                        src={selectedProject.imageUrl}
                        alt={selectedProject.title}
                        fill
                        priority
                        sizes="(max-width: 1279px) 70vw, 46vw"
                        className="object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-transparent" />
                    </div>

                    <div className="flex min-h-0 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <span className="surface-chip border-white/12 bg-white/6 text-white/72">
                          <Layers3 className="h-4 w-4" />
                          opened file
                        </span>
                        <span className="text-xs uppercase tracking-[0.18em] text-white/34">
                          {String((selectedIndex ?? 0) + 1).padStart(2, "0")} / {visibleProjects.length}
                        </span>
                      </div>
                      <h2 className="mt-5 text-[clamp(2.1rem,4vw,4.8rem)] font-semibold leading-[0.96] text-white">
                        {selectedProject.title}
                      </h2>
                      <p className="mt-5 text-base leading-8 text-white/68">
                        {selectedProject.summary}
                      </p>
                      {selectedProject.origin ? (
                        <div className="mt-5 rounded-[1.25rem] border border-white/8 bg-white/[0.04] p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-white/36">
                            why
                          </p>
                          <p className="mt-2 text-sm leading-6 text-white/62">
                            {selectedProject.origin}
                          </p>
                        </div>
                      ) : null}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {selectedProject.techStack.slice(0, 6).map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-white/62"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 border-t border-white/8 pt-5">
                    <Link
                      href={`/projects/${selectedProject.id}`}
                      prefetch={false}
                      className="primary-button px-5 py-3"
                    >
                      자세히 보기
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    {selectedProject.liveUrl ? (
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="secondary-button px-5 py-3"
                      >
                        방문하기
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ) : null}
          </div>

          {selectedProject ? (
            <article className="panel relative z-10 rounded-[1.7rem] p-4 lg:hidden">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.2rem] border border-white/10 bg-black/20">
                <Image
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  fill
                  sizes="92vw"
                  className="object-cover object-top"
                />
              </div>
              <h2 className="mt-5 text-3xl font-semibold leading-tight text-white">
                {selectedProject.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/66">
                {selectedProject.summary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {selectedProject.techStack.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs text-white/62"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/projects/${selectedProject.id}`}
                  prefetch={false}
                  className="primary-button px-5 py-3"
                >
                  자세히 보기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
