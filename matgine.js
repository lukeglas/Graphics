import { GLTFLoader } from "./threejs_imports/GLTFLoader.js";

const models = new Map();
const textures = new Map();
const scenes = new Map();
const modelLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const jsonLoader = new THREE.ObjectLoader();

export const instances = new Map();

export async function LoadModel(path, name) {
  if (models.has(name)) {
    throw new Error("Model already loaded");
  }
  var prom = false;
  modelLoader.load(
    path,
    function (gltf) {
      console.log(gltf.scene);
      models.set(name, gltf);
      console.log("Set " + name + " to " + models.has(name));
      prom = true;
    },
    // called while loading is progressing
    function (xhr) {
      console.log("Loading");
    },
    // called when loading has errors
    function (error) {
      throw new Error(error);
    }
  );
}

export function ModelExists(name) {
  return models.has(name);
}

export function LoadTexture(path, name) {
  if (textures.has(name)) {
    throw new Error("Texture already loaded");
  }
  var texture = textureLoader.load(path);
  textures.set(name, texture);
  print("Loaded " + name);
}

export function InstantiateModel(scene, name) {
  console.log(models.has(name));
  if (models.has(name)) {
    var geo = models.get(name);
    var nModel = geo.scene.clone();
    scene.add(nModel);
    return nModel;
  } else {
    throw new Error("Model " + name + " not found");
  }
}

export function WaitThenCreate(name, instanceName) {
  var handle = setInterval(function () {
    if (ModelExists(name)) {
      instances.set(instanceName, loaders.InstantiateModel(scene, name));
      clearInterval(handle);
    }
  }, 1);
}

export function LoadScene(path, name) {
  var nScene = new THREE.Scene();
  nScene.background = new THREE.Color(0xffffff);

  scenes.set(name, nScene);
  getJSON(path, function (statusCode, data) {
    data.Models.forEach((element) => {
      LoadModel(element.path, element.name);
    });
    data.Scene.forEach((element) => {
      WaitSetCreate(element, nScene);
    });
    console.log(data);
    var scene = new THREE.Scene();
  });
}

export function GetScene(name) {
  if (!scenes.has(name)) throw new Error("Scene not " + name + " found");
  return scenes.get(name);
}

function WaitSetCreate(data, nScene) {
  var handle = setInterval(function () {
    if (ModelExists(data.model)) {
    var nObject = InstantiateModel(nScene, data.model)
        nObject.position.set(data.position.x, data.position.y, data.position.z);
        nObject.scale.set(data.scale.x, data.scale.y, data.scale.z);
        nObject.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
      instances.set(data.name, nObject);

      clearInterval(handle);
    }
  }, 1);
}

function getJSON(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
}
