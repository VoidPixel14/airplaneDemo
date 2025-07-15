import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    85,
    window.innerWidth / window.innerHeight,
    0.1,
    400
);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 3, 2);
scene.add(light);

const fadePlane = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
);
fadePlane.position.z = 4.9;
scene.add(fadePlane);

const loader = new GLTFLoader();
let airplane: THREE.Object3D;
let animationProgress = 0;
let animationEnded = false;

loader.load(
    '/models/plane.glb',
    (gltf) => {
        airplane = gltf.scene;
        scene.add(airplane);

        airplane.position.set(0.225, 0, 0);
        airplane.scale.set(0.01, 0.01, 0.01);
    },
    undefined,
    (err) => {
        console.error('Error loading model:', err);
    }
);

function animate() {
    requestAnimationFrame(animate);

    if (airplane && animationProgress <= 0.6) {
        animationProgress += 0.01;

        const scale = THREE.MathUtils.lerp(0.01, 0.2, animationProgress);
        airplane.scale.set(scale, scale, scale);

        airplane.position.z = THREE.MathUtils.lerp(0, -0.5, animationProgress);

        if (animationProgress >= 0.5) {
            fadePlane.material.opacity = THREE.MathUtils.lerp(0, 50, animationProgress - 0.5);
        }

        if (animationProgress >= 0.55 && !animationEnded) {
            animationEnded = true;

            setTimeout(() => {
                window.location.href = "plane.html";
            }, 500);
        }
    }

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
