import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { GUI } from 'dat.gui'
//import { OrbitControls} from '.orbit-controls-es6';

//create renderer
const renderer = new THREE.WebGLRenderer(
	{
	antialias: true
})
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(window.
	devicePixelRatio) 
document.body.appendChild(renderer.
	domElement)

// create scene
const scene = new THREE.Scene() 

//create sphere

const sphere = new THREE.Mesh(new THREE.
	SphereGeometry(50, 64, 64), new THREE.
	MeshPhysicalMaterial({map: new THREE.TextureLoader().load('./img/glass.jpg'), color: 0x8418ca
    })
) 
//var x = sphere.position.x;
//var z = sphere.position.z;

//sphere.position.x = x * Math.cos(theta) + z * Math.sin(theta);
//sphere.position.z = z * Math.cos(theta) - x * Math.sin(theta);


scene.add(sphere) 
//create camera
const fov = 50
const aspect = innerWidth / innerHeight
const near = 1
const far = 1000
const camera = new THREE.
PerspectiveCamera(
	fov,
	aspect,
	near,
	far
)
camera.position.set(0,0,500)

//controls = new OrbitControls(camera, renderer.domElement)

// create plane
const square = new THREE.BoxGeometry(1,0.1,1)
const lightsquare = new THREE.MeshBasicMaterial({color: 0xE0C4A8})
const darksquare = new THREE.MeshBasicMaterial({color: 0x6A4236})

const board = new THREE.Group()

for (let x =0; x< 10; x++){
	for( let z = 0; z <10; z++){
		let cube
		if (z % 2 ==0 ){
			cube =new THREE.Mesh(square, x % 2 ==0 ? lightsquare : darksquare);
			} else {
				cube =new THREE.Mesh(square, x % 2 ==0 ? darksquare : lightsquare);
			}
			cube.position.set(x,0,z);
			board.add(cube);
	}
}
scene.add(board)


// create Light
const pointlight = new THREE.PointLight(0xffffff,1)
pointlight.position.set(200,200,200)
scene.add(pointlight)
var lightAmb = new THREE.AmbientLight(0x444444);
scene.add(lightAmb);

//create Gui
const gui = new GUI()
const resFolder = gui.addFolder('Resolution')
//resFolder.add(aspect, 'Resolution', 0, Math.PI * 2)
//resFolder.open()

const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 100, 250)
cameraFolder.open()

//add table
//var mtlLoaderTable = new THREE.MTLLoader();
//mtlLoaderChair.setBaseUrl('assets/table/');
///mtlLoaderChair.setPath('assets/table/');
//mtlLoaderChair.load('table.mtl', function (materials) {
//materials.preload();
//materials.materials.fusta_taula.map.magFilter = THREE.NearestFilter;
//materials.materials.fusta_taula.map.minFilter = THREE.LinearFilter;

//var objLoaderChair = new THREE.OBJLoader();
//objLoaderChair.setMaterials(materials);
//objLoaderChair.setPath('assets/table/');
//objLoaderChair.load('table.obj', function (object) {
//object.position.y = -40;
//object.position.z = 330;
//object.scale.set(80,80,80);
//object.rotation.x = .01;
//scene.add(object);
//});
//});




if (typeof browser === "undefined") {
    var browser = chrome;
}

function animate(){
	//controls.update()
	renderer.render( scene, camera );
	requestAnimationFrame(animate)
	sphere.rotation.x -= 0.01
	
	
}
animate()
