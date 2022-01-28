import * as matgine from "./matgine.js";
var curscene, camera, renderer, clock, cubes = [];
var floor, ceiling, leftwall, rightwall, backwall, door;
var keyboard = {};
var speed = 0.2;

init();
loadModels();
animate();

function init() {
  clock = new THREE.Clock();
  clock.start();
  matgine.LoadScene("scene.json", "start");
  curscene = matgine.GetScene("start");
  //create camera
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  camera.position.set(0, 0.02, 0);
  camera.position.z = 1;
  var light = new THREE.DirectionalLight(0xffffff, 5);
  var ambient = new THREE.AmbientLight(0x404040);
  curscene.add(ambient);
  curscene.add(light);
  //matgine.instances.set("sun", light);

//create planes
	floor = new THREE.Mesh(
		new THREE.PlaneGeometry(1,1, 1,1),
		new THREE.MeshBasicMaterial( { color:0xffffff, side:THREE.DoubleSide})
		
	);
	floor.rotation.x -= Math.PI / 2; 
  
	floor.receiveShadow = true;
	floor.castShadow = false;
	curscene.add(floor);

	ceiling = new THREE.Mesh(
		new THREE.PlaneGeometry(1,1, 1,1),
		new THREE.MeshBasicMaterial( {color:0xffffff, side:THREE.DoubleSide})
	);
	ceiling.rotation.x -= Math.PI / 2; 
	ceiling.position.y = 1
	ceiling.receiveShadow = true;
	curscene.add(ceiling);

// door
	// door = new THREE.Mesh(
	// 	new THREE.PlaneGeometry(1,1, 1,1),
	// 	new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide})
	// );
	// door.position.z = 1
	// door.receiveShadow = true;
	// curscene.add(door);
	
   // rightwall
	 rightwall = new THREE.Mesh(
		new THREE.PlaneGeometry(1,1, 1,1),
		new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide})
	);
	 rightwall.rotation.y -= Math.PI/2; 
	 rightwall.position.x = 0.5
	 rightwall.position.y = 0.5
	 rightwall.receiveShadow = true;
	curscene.add( rightwall);

// backwall
	backwall = new THREE.Mesh(
	new THREE.PlaneGeometry(1,1, 1,1),
	new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide})
	);
	 backwall.rotation.y -= Math.PI; 
	 backwall.position.x = 0
	 backwall.position.y = 0.5
	 backwall.position.z = -0.5
	 backwall.receiveShadow = true;
	curscene.add(backwall);


 // leftwall
	leftwall = new THREE.Mesh(
		new THREE.PlaneGeometry(1,1, 1,1),
		new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide})
	);
	leftwall.rotation.y -= Math.PI/2; 
	leftwall.position.x = -0.5
	leftwall.position.y = 0.5
	leftwall.receiveShadow = true;
	curscene.add(leftwall);


	
	//add skybox
	// let loader = new THREE.CubeTextureLoader();

	// let texture = loader.load([
	// './field-skyboxes/Footballfield/negz.jpg',
	// './field-skyboxes/Footballfield/posz.jpg',
	// './field-skyboxes/Footballfield/posy.jpg',
	// './field-skyboxes/Footballfield/negy.jpg',
	// './field-skyboxes/Footballfield/posx.jpg',
	// './field-skyboxes/Footballfield/negx.jpg'
	// ]);
	
	//   curscene.background = texture;




  

  //create renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  window.addEventListener("keydown", keyDown);
  window.addEventListener("keyup", keyUp);
}

function animate() {
  var deltaTime = clock.getDelta();
  if(matgine.instances.has("avocado")) // dit is nodig want anders probeert hij het te doen voordat het object is ingeladen!
  {
    matgine.instances.get("avocado").rotation.y += 0.1;
  }


  UpdateCamera(deltaTime);
  renderer.render(curscene, camera);
  requestAnimationFrame(animate);
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
