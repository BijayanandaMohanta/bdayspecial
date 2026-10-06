"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export interface WishSample {
  id: number;
  imageUrl: string;
  occasion: string;
  recipient: string;
  message: string;
  sender: string;
}

export const sampleWishes: WishSample[] = [
  {
    id: 1,
    imageUrl:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80",
    occasion: "Happy Birthday",
    recipient: "Sophia",
    message:
      "May your day sparkle with joy and your year be overflowing with endless smiles, sweet moments, and adventure! 🎂✨",
    sender: "With love, Aryan",
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80",
    occasion: "Silver Anniversary",
    recipient: "Priya & Rohan",
    message:
      "25 years of enduring laughter, deep friendship, and unconditional love. Here's to forever more together! 🥂❤️",
    sender: "From all of us",
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&auto=format&fit=crop&q=80",
    occasion: "Sweet 16",
    recipient: "Aarav",
    message:
      "May you keep chasing horizons and shining brighter every single year. Have the most memorable birthday! 🎈🎉",
    sender: "Your Big Sis",
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&auto=format&fit=crop&q=80",
    occasion: "Congratulations",
    recipient: "Ananya",
    message:
      "Your dedication made this breakthrough possible. Couldn't be prouder of your new milestone journey! 🚀🌟",
    sender: "Kabir",
  },
  {
    id: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80",
    occasion: "Party Night",
    recipient: "Neha",
    message:
      "Another trip around the sun celebrated in style! Get ready for tonight's unforgettable vibes. 💃🎶",
    sender: "The Squad",
  },
  {
    id: 6,
    imageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80",
    occasion: "Wedding Day",
    recipient: "Dev & Diya",
    message:
      "A magical start to a lifetime of shared dreams, laughter, and endless coffee conversations. 💍✨",
    sender: "Family & Friends",
  },
];

interface ImageRingProps {
  selectedCard: WishSample | null;
  onSelectCard: (card: WishSample | null) => void;
}

export default function ImageRing({
  selectedCard,
  onSelectCard,
}: ImageRingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const onSelectCardRef = useRef(onSelectCard);

  useEffect(() => {
    onSelectCardRef.current = onSelectCard;
  }, [onSelectCard]);

  // Smooth camera slide when card modal opens or closes
  useEffect(() => {
    if (!cameraRef.current) return;
    if (selectedCard) {
      gsap.to(cameraRef.current.position, {
        x: -4.0,
        y: 4.0,
        z: 15.5,
        duration: 0.85,
        ease: "power3.out",
      });
    } else {
      gsap.to(cameraRef.current.position, {
        x: 4.5,
        y: 4.2,
        z: 14.8,
        duration: 0.85,
        ease: "power3.out",
      });
    }
  }, [selectedCard]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = "";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.026);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.set(4.5, 4.2, 14.8);
    camera.lookAt(0, -0.5, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const textures = sampleWishes.map((item) => {
      const tex = textureLoader.load(item.imageUrl);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    });

    const cylinderGroup = new THREE.Group();
    scene.add(cylinderGroup);

    // Wide outer cylinder configuration
    const cylinderRadius = 8.6;
    const cylinderHeight = 32.0;
    const totalCards = 72;
    const cardWidth = 2.1;
    const cardHeight = 2.8;
    const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight);

    interface CylinderMeshItem {
      mesh: THREE.Mesh;
      baseAngle: number;
      baseY: number;
      data: WishSample;
    }

    const cards: CylinderMeshItem[] = [];
    const interactiveMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < totalCards; i++) {
      const progress = i / totalCards;
      const angle = progress * Math.PI * 2 * 5;
      const initialY = (progress - 0.5) * cylinderHeight;

      const wishData = sampleWishes[i % sampleWishes.length];
      const texture = textures[i % textures.length];
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      (mesh as any).wishData = wishData;
      cylinderGroup.add(mesh);
      interactiveMeshes.push(mesh);

      cards.push({
        mesh,
        baseAngle: angle,
        baseY: initialY,
        data: wishData,
      });
    }

    let targetOffset = 0;
    let currentOffset = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let hasMoved = false;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        hasMoved = true;
      }

      startX = e.clientX;
      startY = e.clientY;
      targetOffset += dy * 0.02 + dx * 0.012;
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!hasMoved && isDragging) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshes);

        if (intersects.length > 0) {
          const hitMesh = intersects[0].object as any;
          if (hitMesh.wishData) {
            onSelectCardRef.current(hitMesh.wishData);
          }
        }
      }
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      hasMoved = false;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasMoved = true;
      }

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      targetOffset += dy * 0.025 + dx * 0.015;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!hasMoved && isDragging && e.changedTouches.length > 0) {
        const touch = e.changedTouches[0];
        const rect = container.getBoundingClientRect();
        mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(interactiveMeshes);
        if (intersects.length > 0) {
          const hitMesh = intersects[0].object as any;
          if (hitMesh.wishData) {
            onSelectCardRef.current(hitMesh.wishData);
          }
        }
      }
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      targetOffset += e.deltaY * 0.01;
    };

    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    container.addEventListener("wheel", onWheel, { passive: true });

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      targetOffset += 0.01;
      currentOffset += (targetOffset - currentOffset) * 0.07;

      const halfHeight = cylinderHeight / 2;

      for (let i = 0; i < cards.length; i++) {
        const item = cards[i];

        let y = item.baseY - currentOffset;
        y =
          ((((y + halfHeight) % cylinderHeight) + cylinderHeight) %
            cylinderHeight) -
          halfHeight;

        const angle = item.baseAngle + currentOffset * 0.22;
        const x = Math.cos(angle) * cylinderRadius;
        const z = Math.sin(angle) * cylinderRadius;

        item.mesh.position.set(x, y, z);
        item.mesh.rotation.y = -angle + Math.PI / 2;
        item.mesh.rotation.x = 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 h-full w-full cursor-pointer"
    />
  );
}
