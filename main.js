import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { GUI } from 'dat.gui'

var scene, camera, renderer, sphere;
var floor, ambientLight, light;

var keyboard = {};
var person = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };

function init(){
	//create scene
	scene = new THREE.Scene();
	
	//create Camera
	const fov = 90
	const aspect = innerWidth / innerHeight
	const near = 0.1
	const far = 1000
	camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, person.height, -5);
	camera.lookAt(new THREE.Vector3(0,person.height,0));

	// create sphere
	sphere = new THREE.Mesh(new THREE.
		SphereGeometry(1, 64, 64),  new THREE.
		MeshPhysicalMaterial({map: new THREE.TextureLoader().load('./img/glass.jpg'), color: 0x8418ca
		})
	) 
	sphere.position.y += 1.5;
	sphere.receiveShadow = true;
	sphere.castShadow = true;
	scene.add(sphere) 

	//create planes
	floor = new THREE.Mesh(
		new THREE.PlaneGeometry(20,20, 10,10),
		new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide})
	);
	floor.rotation.x -= Math.PI / 2; 
	floor.receiveShadow = true;
	scene.add(floor);

	const wall = new THREE.Mesh(
		new THREE.PlaneGeometry(20,20, 5,5),
		new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide})
	);
	wall.rotation.x -= Math.PI; 
	wall.position.z = 10
	wall.position.y = 10
	wall.receiveShadow = true;
	scene.add(wall);
	
	const wall2 = new THREE.Mesh(
		new THREE.PlaneGeometry(20,20, 10,10),
		new THREE.MeshPhongMaterial({color:0xffffff, side:THREE.DoubleSide})
	);
	wall2.rotation.y -= Math.PI/2; 
	wall2.position.x = 10
	wall2.position.y = 10
	wall2.receiveShadow = true;
	scene.add(wall2);
	
	//create lights
	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);
	
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3,6,-3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);	
	
	//create renderer
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(innerWidth, innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	document.body.appendChild(renderer.domElement);

	//create Gui
	const gui = new GUI()
	const resFolder = gui.addFolder('Resolution')
	resFolder.add(camera, 'aspect', (innerWidth / 2) + (innerWidth /2) , innerWidth  / innerWidth )
	resFolder.open()


	animate();
}

function animate(){
	requestAnimationFrame(animate);
	
	sphere.rotation.x += 0.01;

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
		camera.rotation.y -= person.turnSpeed;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += person.turnSpeed;
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