import { PerspectiveCamera, Text, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { damp } from 'maath/easing';
import { useEffect, useRef, useState } from 'react';
import { SRGBColorSpace, type MeshBasicMaterial } from 'three';
import { site } from '../../data/site';
import { sectionFromProgress } from '../../lib/progress-map';
import { useSceneStore } from '../../store/scene-store';
import { DISPLAY_FONT_URL, MONO_FONT_URL } from '../fonts';

const LINES = [`hi, I'm ${site.firstName}`, site.stack.join(' / ')];
const TYPE_MS = 70;
const HOLD_MS = 1700;

function useTypedLine(): string {
  const [text, setText] = useState('');
  useEffect(() => {
    let line = 0;
    let length = 0;
    let deleting = false;
    let timer = 0;
    const step = () => {
      const target = LINES[line] ?? '';
      if (!deleting) {
        length += 1;
        setText(target.slice(0, length));
        if (length >= target.length) {
          deleting = true;
          timer = window.setTimeout(step, HOLD_MS);
          return;
        }
      } else {
        length -= 1;
        setText(target.slice(0, length));
        if (length <= 0) {
          deleting = false;
          line = (line + 1) % LINES.length;
        }
      }
      timer = window.setTimeout(step, deleting ? TYPE_MS / 2 : TYPE_MS);
    };
    timer = window.setTimeout(step, 400);
    return () => window.clearTimeout(timer);
  }, []);
  return text;
}

/** What the monitor shows: a typed line on the hero, the photo once the camera comes close. */
export function MonitorScreen() {
  const typed = useTypedLine();
  const photo = useTexture(site.photo);
  photo.colorSpace = SRGBColorSpace;
  const photoMaterial = useRef<MeshBasicMaterial>(null);
  const showPhoto = useSceneStore((s) => sectionFromProgress(s.progress) >= 1);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => setBlink((b) => !b), 530);
    return () => window.clearInterval(id);
  }, []);

  useFrame((_, delta) => {
    if (photoMaterial.current) {
      damp(photoMaterial.current, 'opacity', showPhoto ? 1 : 0, 0.35, Math.min(delta, 0.1));
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault manual aspect={16 / 9} position={[0, 0, 4]} fov={30} />
      <color attach="background" args={['#070b14']} />
      <mesh position={[0, 0.72, -0.1]}>
        <planeGeometry args={[4, 0.08]} />
        <meshBasicMaterial color="#13203a" />
      </mesh>
      <group visible={!showPhoto}>
        <Text
          font={MONO_FONT_URL}
          fontSize={0.19}
          color="#6b7a99"
          anchorX="left"
          anchorY="middle"
          position={[-1.65, 0.38, 0]}
        >
          ~/avinash $ whoami
        </Text>
        <Text
          font={MONO_FONT_URL}
          fontSize={0.26}
          color="#e6eeff"
          anchorX="left"
          anchorY="middle"
          position={[-1.65, 0.02, 0]}
        >
          {`${typed}${blink ? '█' : ' '}`}
        </Text>
        <Text
          font={MONO_FONT_URL}
          fontSize={0.15}
          color="#ffb45c"
          anchorX="left"
          anchorY="middle"
          position={[-1.65, -0.5, 0]}
        >
          {`${site.role.toLowerCase()} / ${site.location.toLowerCase()}`}
        </Text>
      </group>
      <group position={[0, -0.02, 0.01]}>
        <mesh position={[-0.95, 0, 0]}>
          <planeGeometry args={[1.25, 1.25]} />
          <meshBasicMaterial ref={photoMaterial} map={photo} transparent opacity={0} />
        </mesh>
        <group visible={showPhoto}>
          <Text
            font={DISPLAY_FONT_URL}
            fontSize={0.3}
            color="#f3e6cf"
            anchorX="left"
            anchorY="middle"
            position={[-0.15, 0.22, 0]}
          >
            {site.name}
          </Text>
          <Text
            font={MONO_FONT_URL}
            fontSize={0.14}
            color="#8fd9ff"
            anchorX="left"
            anchorY="middle"
            position={[-0.15, -0.12, 0]}
          >
            {`${site.role} / ${site.location}`}
          </Text>
          <Text
            font={MONO_FONT_URL}
            fontSize={0.12}
            color="#7f8aa6"
            anchorX="left"
            anchorY="middle"
            position={[-0.15, -0.36, 0]}
          >
            {site.stack.join(' / ')}
          </Text>
        </group>
      </group>
    </>
  );
}
