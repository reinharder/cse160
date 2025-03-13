import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://unpkg.com/three/examples/jsm/loaders/MTLLoader.js';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Enable shadows
renderer.shadowMap.enabled = true;

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Load a texture
const textureLoader = new THREE.TextureLoader();
const cubeTexture = textureLoader.load('texture/dirt4.png');

// Create a textured cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ map: cubeTexture });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// Add multiple light sources
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xff0000, 1, 10);
pointLight.position.set(-2, 2, 2);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Variable to store the loaded object
let loadedObject;

// Load the "Walking astronaut" model
const mtlLoader = new MTLLoader();
mtlLoader.load('astronaut/astronaut.mtl', function (materials) {
    materials.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('astronaut/astronaut.obj', function (object) {
        object.position.set(1, 0.5, 0);
        object.scale.set(0.5, 0.5, 0.5); // Make the object smaller
        object.castShadow = true;
        object.receiveShadow = true;
        scene.add(object);
        loadedObject = object; // Store the reference to the loaded object
    });
});

// Add a skybox
const skyboxLoader = new THREE.TextureLoader();
skyboxLoader.load('texture/gold_nebula.png', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.background = texture;
    scene.environment = texture;
});

// Create spheres that orbit the cube
const spheres = [];
for (let i = 0; i < 20; i++) {
    const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    const distance = Math.random() * 3 + 1; // Distance from the cube
    const angle = Math.random() * Math.PI * 2;
    sphere.position.set(Math.cos(angle) * distance, Math.sin(angle) * distance, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add(sphere);
    spheres.push({ mesh: sphere, angle: angle, distance: distance, speed: 0.01 + (3 / distance) * 0.01 }); // Closer spheres move faster
}

// Set the camera position
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Rotate the loaded object if it exists
    if (loadedObject) {
        loadedObject.rotation.x += 0.01;
        loadedObject.rotation.y += 0.01;
    }

    // Update each sphere's movement around the cube
    spheres.forEach((sphereData) => {
        sphereData.angle += sphereData.speed;
        sphereData.mesh.position.x = Math.cos(sphereData.angle) * sphereData.distance;
        sphereData.mesh.position.z = Math.sin(sphereData.angle) * sphereData.distance;
    });

    controls.update();
    renderer.render(scene, camera);
}
animate();
