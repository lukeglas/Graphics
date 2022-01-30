import * as matgine from "./matgine.js";
var curScene;
var camera;
var renderer;
var clock;
var cubes = [];
var keyboard = {};
var speed = 0.5;
var scene, camera, renderer, sphere, sphere2, sphereCamera;
var floor, ambientLight, light, stats, light2;
var sphereGeometry1, sphereMaterial1, sphereMesh1;
var pivotPoint;

init();
loadModels();
animate();

function init() {
  clock = new THREE.Clock();
  clock.start();
  matgine.LoadScene("scene.json", "start");



  curScene = matgine.GetScene("start");
  //create camera
  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  ); 
  camera.position.set(0, 1, 2);
  var point = new THREE.PointLight(0xffffff);
  var ambient = new THREE.AmbientLight(0x404040);
  curScene.add(ambient);
  point.position.set(0,2,0)
  curScene.add(point)


  // Circulating Sphere
  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 64, 64), 
    //new THREE.BasicMaterial({color: 0xff0000})
    new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(`./img/moon.jpg`)
  })

  );
  sphere.recieveShadow = true;
  sphere.castShadow = true;
  sphere.position.set(0.5,2,0);
  curScene.add(sphere);

  // Pivot Sphere (NIET VERWIJDEREN, HEEFT EEN FUNCTIEE)
  var sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 64, 64), 
    //new THREE.BasicMaterial({color: 0xff0000})
    new THREE.MeshPhysicalMaterial({map: new THREE.TextureLoader().load(`./img/earth.jpg`),
    color: 0xff0000
  })

  );
  sphere2.recieveShadow = true;
  sphere2.castShadow = true;
  sphere2.position.set(0,-1,0);
  curScene.add(sphere2);

  //Create Pivotpoint
	pivotPoint = new THREE.Object3D();
	sphere2.add(pivotPoint);
	pivotPoint.add(sphere);

  //matgine.instances.set("sun", light);





  //create renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
  animate();
}

function animate() {
  var deltaTime = clock.getDelta();

  UpdateCamera(deltaTime);
  renderer.render(curScene, camera);
  requestAnimationFrame(animate);
  render();
}
async function loadModels() {
  //put all the models to be loaded in this function to keep it clean.
}

function UpdateCamera(deltaTime) {
  if (keyboard[87]) {
    // W key
    camera.position.x -= Math.sin(camera.rotation.y) * speed * deltaTime;
    camera.position.z -= Math.cos(camera.rotation.y) * speed * deltaTime;
  }
  if (keyboard[83]) {
    // S key
    camera.position.x += Math.sin(camera.rotation.y) * speed * deltaTime;
    camera.position.z += Math.cos(camera.rotation.y) * speed * deltaTime;
  }
  if (keyboard[68]) {
    // A key
    // Redirect motion by 90 degrees
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * speed * deltaTime;
    camera.position.z +=
      Math.cos(camera.rotation.y + Math.PI / 2) * speed * deltaTime;
  }
  if (keyboard[65]) {
    // D key
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * speed * deltaTime;
    camera.position.z +=
      Math.cos(camera.rotation.y - Math.PI / 2) * speed * deltaTime;
  }

  // Keyboard turn inputs
  if (keyboard[37]) {
    // left arrow key
    camera.rotation.y += 1 * deltaTime;
  }
  if (keyboard[39]) {
    // right arrow key
    camera.rotation.y -= 1 * deltaTime;
  }
  if (keyboard[38]) {
    // up arrow key
    camera.position.y += 1 * deltaTime;
  }
  if (keyboard[40]) {
    // down arrow key
    camera.position.y -= 1 * deltaTime;
  }
}
function keyDown(event) {
  keyboard[event.keyCode] = true;
}
function keyUp(event) {
  keyboard[event.keyCode] = false;
}

function render () 
{
	pivotPoint.rotation.y += 0.005;
}