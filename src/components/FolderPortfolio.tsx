"use client";
// 폴더 박스형 3D 프로젝트 포트폴리오 화면을 구성하는 클라이언트 컴포넌트

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { ArrowUpRight, RotateCcw, X } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import styles from "./FolderPortfolio.module.css";

type FileObject = {
  id: string;
  group: THREE.Group;
  mesh: THREE.Mesh;
  index: number;
};

const MAX_VISIBLE_PROJECTS = 10;
const FILE_WIDTH = 0.58;
const FILE_HEIGHT = 2.15;
const FILE_DEPTH = 1.16;

function targetForFile(index: number, isHovered: boolean, isSelected: boolean) {
  if (isSelected) {
    if (isHovered) {
      return {
        position: new THREE.Vector3(
          -3.45,
          FILE_HEIGHT * 0.34 + index * 0.035,
          1.35 - index * 0.18,
        ),
        rotation: new THREE.Euler(-0.02, 0.28, 0.02),
        scale: 0.72,
      };
    }

    return {
      position: new THREE.Vector3(
        -3.55,
        FILE_HEIGHT * 0.32 + index * 0.03,
        1.46 - index * 0.18,
      ),
      rotation: new THREE.Euler(-0.02, 0.24, 0.015),
      scale: 0.64,
    };
  }

  const centerOffset = (MAX_VISIBLE_PROJECTS - 1) / 2;
  const lean = (index - centerOffset) * 0.012;

  return {
    position: new THREE.Vector3(
      (index - centerOffset) * 0.64,
      FILE_HEIGHT / 2 + (isHovered ? 0.1 : 0),
      isHovered ? 0.16 : 0,
    ),
    rotation: new THREE.Euler(0, lean, (index - centerOffset) * -0.018),
    scale: isHovered ? 1.13 : 1,
  };
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      materials.forEach((material) => material.dispose());
    }
  });
}

export default function FolderPortfolio() {
  const visibleProjects = useMemo(
    () => projects.slice(0, MAX_VISIBLE_PROJECTS),
    [],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const selectedProject =
    visibleProjects.find((project) => project.id === selectedId) ??
    visibleProjects[0];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileObjectsRef = useRef<FileObject[]>([]);
  const selectedIdRef = useRef<string | null>(null);
  const hoveredIdRef = useRef<string | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    selectedIdRef.current = selectedId;
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("folder-portfolio-update"));
    });
  }, [selectedId]);

  useEffect(() => {
    hoveredIdRef.current = hoveredId;
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("folder-portfolio-update"));
    });
  }, [hoveredId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const canvasElement = canvas;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: canvasElement,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 80);
    camera.position.set(0.2, 5.6, 6);
    camera.lookAt(0, 1, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 2.2);
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(2, 6, 4);
    scene.add(ambient, key);

    const folder = new THREE.Group();
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: "#f5f0e7",
      roughness: 0.82,
      metalness: 0.02,
    });
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: "#efe5d4",
      roughness: 0.86,
    });
    const base = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.18, 2.1), baseMaterial);
    base.position.set(0, -0.09, 0.1);
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(8.8, 2.62, 0.18), wallMaterial);
    backWall.position.set(0, 1.22, -0.7);
    const frontLip = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.22, 0.16), wallMaterial);
    frontLip.position.set(0, 0.02, 1.17);
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.42, 2.1), wallMaterial);
    leftWall.position.set(-4.4, 1.08, 0.1);
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.42, 2.1), wallMaterial);
    rightWall.position.set(4.4, 1.08, 0.1);
    const shelfTop = new THREE.Mesh(new THREE.BoxGeometry(8.8, 0.12, 2.1), wallMaterial);
    shelfTop.position.set(0, 2.54, 0.1);
    folder.add(base, backWall, frontLip, leftWall, rightWall, shelfTop);
    scene.add(folder);

    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: "#d8d2c5",
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
    });
    const textures: THREE.Texture[] = [];
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: "#f6f4ef",
      roughness: 0.68,
    });
    const files: FileObject[] = visibleProjects.map((project, index) => {
      const group = new THREE.Group();

      const spineMaterial = new THREE.MeshStandardMaterial({
        color: project.accentColor,
        roughness: 0.58,
      });
      const geometry = new THREE.BoxGeometry(FILE_WIDTH, FILE_HEIGHT, FILE_DEPTH);
      const mesh = new THREE.Mesh(geometry, [
        sideMaterial,
        sideMaterial,
        sideMaterial,
        sideMaterial,
        spineMaterial,
        sideMaterial,
      ]);
      mesh.userData.projectId = project.id;

      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(FILE_WIDTH * 1.18, FILE_DEPTH * 1.16),
        shadowMaterial.clone(),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(0, -FILE_HEIGHT / 2 - 0.02, 0.08);

      const labelCanvas = document.createElement("canvas");
      labelCanvas.width = 192;
      labelCanvas.height = 768;
      const context = labelCanvas.getContext("2d");
      if (context) {
        context.fillStyle = project.accentColor;
        context.fillRect(0, 0, 192, 768);
        context.fillStyle = "rgba(255,255,255,0.18)";
        context.fillRect(22, 24, 148, 720);
        context.save();
        context.translate(68, 704);
        context.rotate(-Math.PI / 2);
        context.fillStyle = "#ffffff";
        context.font = "700 42px system-ui";
        context.fillText(project.title.slice(0, 26), 0, 0);
        context.restore();
        context.save();
        context.translate(138, 704);
        context.rotate(-Math.PI / 2);
        context.fillStyle = "rgba(255,255,255,0.78)";
        context.font = "600 24px system-ui";
        context.fillText(project.techStack.slice(0, 2).join(" / "), 0, 0);
        context.restore();
      }
      const labelTexture = new THREE.CanvasTexture(labelCanvas);
      labelTexture.colorSpace = THREE.SRGBColorSpace;
      textures.push(labelTexture);
      const label = new THREE.Mesh(
        new THREE.PlaneGeometry(FILE_WIDTH * 0.82, FILE_HEIGHT * 0.72),
        new THREE.MeshBasicMaterial({ map: labelTexture }),
      );
      label.position.set(0, 0.05, FILE_DEPTH / 2 + 0.004);

      group.add(shadow, mesh, label);
      const target = targetForFile(index, false, false);
      group.position.copy(target.position);
      group.rotation.copy(target.rotation);
      group.scale.setScalar(target.scale);
      scene.add(group);

      return { id: project.id, group, mesh, index };
    });
    fileObjectsRef.current = files;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function resize() {
      const width = canvasElement.clientWidth;
      const height = canvasElement.clientHeight;
      renderer.setSize(width, height, false);
      const isMobile = width < 700;
      camera.fov = isMobile ? 62 : 46;
      camera.position.set(
        isMobile ? 0.25 : 0.2,
        isMobile ? 6.4 : 5.6,
        isMobile ? 7.7 : 6,
      );
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      camera.lookAt(0, 1, 0);
      renderFrame();
    }

    function setPointer(event: PointerEvent) {
      const rect = canvasElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function pickFile(event: PointerEvent) {
      setPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(
        files.map((file) => file.mesh),
        false,
      );
      return intersects[0]?.object.userData.projectId as string | undefined;
    }

    function animate() {
      frameRef.current = null;
      let shouldContinue = false;
      const isSelected = selectedIdRef.current !== null;

      files.forEach((file) => {
        const target = targetForFile(
          file.index,
          hoveredIdRef.current === file.id,
          isSelected && selectedIdRef.current !== file.id,
        );
        if (selectedIdRef.current === file.id) {
          target.position.set(-1.45, FILE_HEIGHT / 2 + 0.05, 0.24);
          target.rotation.set(0, 0.1, -0.04);
          target.scale = hoveredIdRef.current === file.id ? 1.22 : 1.14;
        }

        file.group.position.lerp(target.position, 0.18);
        file.group.rotation.x += (target.rotation.x - file.group.rotation.x) * 0.18;
        file.group.rotation.y += (target.rotation.y - file.group.rotation.y) * 0.18;
        file.group.rotation.z += (target.rotation.z - file.group.rotation.z) * 0.18;
        const nextScale = THREE.MathUtils.lerp(file.group.scale.x, target.scale, 0.18);
        file.group.scale.setScalar(nextScale);

        if (
          file.group.position.distanceTo(target.position) > 0.004 ||
          Math.abs(file.group.scale.x - target.scale) > 0.003
        ) {
          shouldContinue = true;
        }
      });

      renderFrame();
      if (shouldContinue) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }

    function requestAnimation() {
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }

    function renderFrame() {
      renderer.render(scene, camera);
    }

    function handlePointerMove(event: PointerEvent) {
      const nextHovered = pickFile(event) ?? null;
      hoveredIdRef.current = nextHovered;
      setHoveredId(nextHovered);
      requestAnimation();
    }

    function handlePointerLeave() {
      hoveredIdRef.current = null;
      setHoveredId(null);
      requestAnimation();
    }

    function handlePointerDown(event: PointerEvent) {
      const projectId = pickFile(event);
      if (projectId) {
        selectedIdRef.current = projectId;
        setSelectedId(projectId);
        requestAnimation();
      }
    }

    function handleUpdate() {
      requestAnimation();
    }

    resize();
    canvasElement.addEventListener("pointermove", handlePointerMove);
    canvasElement.addEventListener("pointerleave", handlePointerLeave);
    canvasElement.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", resize);
    window.addEventListener("folder-portfolio-update", handleUpdate);
    requestAnimation();

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      canvasElement.removeEventListener("pointermove", handlePointerMove);
      canvasElement.removeEventListener("pointerleave", handlePointerLeave);
      canvasElement.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", resize);
      window.removeEventListener("folder-portfolio-update", handleUpdate);
      fileObjectsRef.current = [];
      disposeObject(folder);
      files.forEach((file) => disposeObject(file.group));
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
    };
  }, [visibleProjects]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        selectedIdRef.current = null;
        setSelectedId(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function selectProject(project: Project | null) {
    selectedIdRef.current = project?.id ?? null;
    setSelectedId(project?.id ?? null);
  }

  return (
    <main className={styles.stage} aria-label="portfolio">
      <section
        className={`${styles.workspace} ${selectedId ? styles.workspaceSelected : ""}`}
      >
        <div className={styles.canvasShell}>
          <canvas ref={canvasRef} className={styles.canvas} />
        </div>

        <nav className={styles.accessList} aria-label="프로젝트 파일 선택">
          {visibleProjects.map((project) => (
            <button
              className={styles.accessButton}
              key={project.id}
              onClick={() => selectProject(project)}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              type="button"
            >
              <span>{project.title}</span>
            </button>
          ))}
        </nav>

        {selectedId ? (
          <article className={styles.detailPanel} aria-live="polite">
            <button
              className={styles.closeButton}
              type="button"
              onClick={() => selectProject(null)}
              aria-label="프로젝트 닫기"
            >
              <X size={18} />
            </button>

            <div className={styles.detailImageWrap}>
              <Image
                src={selectedProject.imageUrl}
                alt={`${selectedProject.title} 화면`}
                fill
                sizes="(max-width: 900px) 100vw, 48vw"
                className={styles.detailImage}
              />
            </div>
            <div className={styles.detailBody}>
              <p className={styles.detailKicker}>
                {selectedProject.techStack.slice(0, 3).join(" / ")}
              </p>
              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.summary}</p>

              <div className={styles.techList}>
                {selectedProject.techStack.slice(0, 6).map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>

              <div className={styles.actionRow}>
                <Link href={`/projects/${selectedProject.id}`}>
                  프로젝트 문서
                  <ArrowUpRight size={16} />
                </Link>
                <button type="button" onClick={() => selectProject(null)}>
                  <RotateCcw size={16} />
                  폴더 전체 보기
                </button>
              </div>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}
