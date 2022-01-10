import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { GUI } from 'dat.gui'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

var scene, camera, renderer, sphere, sphereCamera;
var floor, ambientLight, light, stats, light2;

var keyboard = {};
var person = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };

function init(){
	//create scene
	scene = new THREE.Scene();
	stats = Stats()

	//create Camera
	const fov = 90
	const aspect = innerWidth / innerHeight
	const near = 0.1
	const far = 1000
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, person.height *2.5 , -7);
	camera.lookAt(new THREE.Vector3(0,person.height ,0));

	
	// create sphere
	
	let sphereMaterial = new THREE.MeshBasicMaterial( );
	let sphereGeo =  new THREE.SphereGeometry(1, 64, 64);
	let mirrorSphere = new THREE.Mesh(sphereGeo, sphereMaterial);
	mirrorSphere.position.set(0, 2, 0);
	mirrorSphere.receiveShadow = true;
	mirrorSphere.castShadow = false;
	scene.add(mirrorSphere);
	
	
	

	//create planes
	floor = new THREE.Mesh(
		new THREE.PlaneGeometry(20,20, 10,10),
		new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( './img/floor.jpg' ), side:THREE.DoubleSide})
		//new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide})
	);
	floor.rotation.x -= Math.PI / 2; 
	floor.receiveShadow = true;
	floor.castShadow = false;
	scene.add(floor);

	const ceiling = new THREE.Mesh(
		new THREE.PlaneGeometry(20,20, 10,10),
		new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load( './img/ceiling.jpg' ), side:THREE.DoubleSide})
	);
	ceiling.rotation.x -= Math.PI / 2; 
	ceiling.position.y = 20
	ceiling.receiveShadow = true;
	scene.add(ceiling);

	const leftwall = new THREE.Mesh(
		new THREE.PlaneGeometry(20,20, 5,5),
		new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide})
	);
	leftwall.rotation.x -= Math.PI; 
	leftwall.position.z = 10
	leftwall.position.y = 10
	leftwall.receiveShadow = true;
	scene.add(leftwall);
	
	const backwall = new THREE.Mesh(
		new THREE.PlaneGeometry(20,20, 10,10),
		new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide})
	);
	 backwall.rotation.y -= Math.PI/2; 
	 backwall.position.x = 10
	 backwall.position.y = 10
	 backwall.receiveShadow = true;
	scene.add( backwall);

	const door = new THREE.Mesh(
	new THREE.PlaneGeometry(20,20, 10,10),
	new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide})
	);
	 door.rotation.y -= Math.PI; 
	 door.position.x = 0
	 door.position.y = 10
	 door.position.z = -10
	 door.receiveShadow = true;
	scene.add(door);

	const window = new THREE.Mesh(
		new THREE.PlaneGeometry(7.5,7.5, 10,10),
		new THREE.MeshPhongMaterial({color:0xfffff, side:THREE.DoubleSide})
	);
	window.rotation.y -= Math.PI/2; 
	window.position.x = -10
	window.position.y = 10
	window.receiveShadow = true;
	scene.add(window);

	const windowwall = new THREE.Mesh(
		new THREE.PlaneGeometry(20,20, 10,10),
		new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide})
	);
	windowwall.rotation.y -= Math.PI/2; 
	windowwall.position.x = -10
	windowwall.position.y = 10
	windowwall.receiveShadow = true;
	scene.add(windowwall);


	
	//add skybox
	let loader = new THREE.CubeTextureLoader();

	let texture = loader.load([
	'./field-skyboxes/Footballfield/negz.jpg',
	'./field-skyboxes/Footballfield/posz.jpg',
	'./field-skyboxes/Footballfield/posy.jpg',
	'./field-skyboxes/Footballfield/negy.jpg',
	'./field-skyboxes/Footballfield/posx.jpg',
	'./field-skyboxes/Footballfield/negx.jpg'
	]);
	
	  scene.background = texture;
	


	//create lights
	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);
	
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3,6,-3);
	light.castShadow = true;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;

	scene.add(light);	


	
	//create renderer
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(innerWidth, innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.body.appendChild(renderer.domElement);

	//create Gui
	//werkt nog niet helemaal
	const gui = new GUI()
	const resFolder = gui.addFolder('Resolution')
	resFolder.add(camera, 'aspect', (innerWidth / 2) + (innerWidth /2) , innerWidth  / innerWidth )
	resFolder.open()



	animate();
}

function animate(){
	renderer.render(scene,camera);
  //	sphereCamera.updateCubeMap( renderer, scene );
	requestAnimationFrame(animate);

	stats.update()
	
	
	
	
	// Keyboard movement inputs
	if(keyboard[87]){ // W key
		
		camera.position.x -= Math.sin(camera.rotation.y) * person.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * person.speed;
	}
	if(keyboard[83]){ // S key
		camera.position.x += Math.sin(camera.rotation.y) * person.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * person.speed;
	}
	if(keyboard[65]){ // A key
		// Redirect motion by 90 degrees
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * person.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * person.speed;
	}
	if(keyboard[68]){ // D key
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * person.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * person.speed;
	}
	
	// Keyboard turn inputs
	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= 0.04;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += 0.04;
	}
	if(keyboard[38]){ // up arrow key
		camera.position.y += person.turnSpeed;
	}
	if(keyboard[40]){ // down arrow key
		camera.position.y -= person.turnSpeed;
	}
	
	renderer.render(scene, camera);
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;