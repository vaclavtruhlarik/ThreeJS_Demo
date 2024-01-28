import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

if (WebGL.isWebGLAvailable()) {
    const clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();

    let object;
    let mixer;
    let controls;
    let obj_to_render = "ship_in_a_bottle";

    // Load the object
    const loader = new GLTFLoader();
    loader.load(
        "public/" + obj_to_render + "/scene.gltf",
        function (gltf) {
            object = gltf.scene;
            scene.add(object);

            // Animation Mixer
            mixer = new THREE.AnimationMixer(object);

            // Play all animations
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        },
        function (xhr) {
            // Log loading of the object
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
            console.error(error);
        }
    );

    // Adding lights
    const top_light = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
    top_light.position.set(5000, 5000, 5000); // top-left-ish
    top_light.castShadow = true;
    scene.add(top_light);

    const ambient_light = new THREE.AmbientLight(0x333333, 1);
    scene.add(ambient_light);

    // Add controls
    controls = new OrbitControls(camera, renderer.domElement);

    // Render the scene
    function animate() {
        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        if (mixer) {
            mixer.update(delta);
        }

        renderer.render(scene, camera);
    }

    // Listener for resizing
    window.addEventListener("resize", function () {
        camera.aspect = this.window.innerWidth / this.window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    });

    animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    console.log(warning);
    document.getElementById("container").appendChild(warning);
}
