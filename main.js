import * as THREE from "three";
import { GUI } from "dat.gui";
import { LegacyGLTFLoader } from "three/examples/jsm/loaders/deprecated/LegacyGLTFLoader.js";
import Stats from "three/examples/jsm/libs/stats.module";


var scene, camera, renderer, sphere, sphere2, sphereCamera;
var floor, ambientLight, light, stats, light2;
var sphereGeometry1, sphereMaterial1, sphereMesh1;
var pivotPoint;

var keyboard = {};
var person = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };

function init() {
  //create scene
  scene = new THREE.Scene();
  stats = Stats();
  //create Camera
  const fov = 90;
  const aspect = innerWidth / innerHeight;
  const near = 0.1;
  const far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, person.height * 3, -15);
  camera.lookAt(new THREE.Vector3(0, person.height, 0));

  // create sphere
  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshPhysicalMaterial({
      map: new THREE.TextureLoader().load("./img/glass.jpg"),
      color: 0xff0000,
    })
  );

  sphere.receiveShadow = true;
  sphere.castShadow = true;
  sphere.position.set(7, 2, 0);
  scene.add(sphere);

  // create sphere
  sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 64, 64),
    new THREE.MeshPhysicalMaterial({
      map: new THREE.TextureLoader().load("./img/glass.jpg"),
      color: 0xff0000,
    })
  );

  sphere2.receiveShadow = true;
  sphere2.castShadow = true;
  sphere2.position.set(0, -1, 0);
  scene.add(sphere2);

  pivotPoint = new THREE.Object3D();
  sphere2.add(pivotPoint);
  pivotPoint.add(sphere);

  //#region
  //create planes
  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 10, 10),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("./img/floor.jpg"),
      side: THREE.DoubleSide,
    })
    //new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide})
  );
  floor.rotation.x -= Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 10, 10),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("./img/ceiling.jpg"),
      side: THREE.DoubleSide,
    })
  );
  ceiling.rotation.x -= Math.PI / 2;
  ceiling.position.y = 20;
  ceiling.receiveShadow = true;
  scene.add(ceiling);

  const leftwall = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 5, 5),
    new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  leftwall.rotation.x -= Math.PI;
  leftwall.position.z = 10;
  leftwall.position.y = 10;
  leftwall.receiveShadow = true;
  scene.add(leftwall);

  const rightwall = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  rightwall.rotation.y -= Math.PI / 2;
  rightwall.position.x = 10;
  rightwall.position.y = 10;
  rightwall.receiveShadow = true;
  scene.add(rightwall);

  const window = new THREE.Mesh(
    new THREE.PlaneGeometry(7.5, 7.5, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0xfffff, side: THREE.DoubleSide })
  );
  window.rotation.y -= Math.PI / 2;
  window.position.x = -10;
  window.position.y = 10;
  window.receiveShadow = true;
  scene.add(window);

  const windowwall = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 10, 10),
    new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide })
  );
  windowwall.rotation.y -= Math.PI / 2;
  windowwall.position.x = -10;
  windowwall.position.y = 10;
  windowwall.receiveShadow = true;
  scene.add(windowwall);


  //add skybox
  let loader = new THREE.CubeTextureLoader();

  let texture = loader.load([
    "./field-skyboxes/Footballfield/negz.jpg",
    "./field-skyboxes/Footballfield/posz.jpg",
    "./field-skyboxes/Footballfield/posy.jpg",
    "./field-skyboxes/Footballfield/negy.jpg",
    "./field-skyboxes/Footballfield/posx.jpg",
    "./field-skyboxes/Footballfield/negx.jpg",
  ]);

  scene.background = texture;

  //create lights
  ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  light = new THREE.PointLight(0xffffff, 0.8, 18);
  light.position.set(-3, 6, -3);
  light.castShadow = true;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 25;

  scene.add(light);

  //create renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  //create Gui
  //werkt nog niet helemaal
  const gui = new GUI();
  const resFolder = gui.addFolder("Resolution");
  resFolder.add(
    camera,
    "aspect",
    innerWidth / 2 + innerWidth / 2,
    innerWidth / innerWidth
  );
  resFolder.open();

  //#endregion
  animate();
}

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  render();

  stats.update();

  //#region
  // Keyboard movement inputs
  if (keyboard[87]) {
    // W key

    camera.position.x -= Math.sin(camera.rotation.y) * person.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * person.speed;
  }
  if (keyboard[83]) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * person.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * person.speed;
  }
  if (keyboard[65]) {
    // A key
    // Redirect motion by 90 degrees
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * person.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * person.speed;
  }
  if (keyboard[68]) {
    // D key
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * person.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * person.speed;
  }

  // Keyboard turn inputs
  if (keyboard[37]) {
    // left arrow key
    camera.rotation.y -= 0.04;
  }
  if (keyboard[39]) {
    // right arrow key
    camera.rotation.y += 0.04;
  }
  if (keyboard[38]) {
    // up arrow key
    camera.position.y += person.turnSpeed;
  }
  if (keyboard[40]) {
    // down arrow key
    camera.position.y -= person.turnSpeed;
  }

  renderer.render(scene, camera);
}

function keyDown(event) {
  keyboard[event.keyCode] = true;
}

function keyUp(event) {
  keyboard[event.keyCode] = false;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

window.onload = init;
//#endregion

function render() {
  pivotPoint.rotation.y += 0.02;
}
