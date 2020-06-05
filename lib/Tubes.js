Physijs.scripts.worker = "physi/physijs_worker.js";
Physijs.scripts.ammo = "physi/ammo.js";

var scene, camera, renderer, mesh;
var ground_material, meshFloor, loader, skyBox, keyboard = {}, langit;
var lodr, lodr1, lodr2, lodr3, lodr4, lodr5, lodr6, lodr7, lodr8, lodr9, lodr10;
var mtl, mtl1, mtl2, mtl3, mtl4, mtl5, mtl6, mtl7, mtl8, mtl9, mtl10;
var txt;
var player = { height: 1.8, speed: 0.2, turnSpeed: Math.PI * 0.02 };
var USE_WIREFRAME = false;
var lantai, objload;
var textr, daratanT;
var clock, contr;
var audio;
var audio1;
var fog, dirlight, cloudparticles = [];
var cahaya, cahaya1;
var geosal, hitsal, salju, matsal;

function init()
{
  scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
  scene.setGravity(new THREE.Vector3(0, -30, 0));
  scene.addEventListener("update", function ()
  {
    scene.simulate(undefined, 2);
  });

  // scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1.1, 10000);

  cahaya1 = new THREE.PointLight(0xffffff, 0.9, 10000);
  cahaya1.position.set(50, 50, 50);
  cahaya1.castShadow = false;
  cahaya1.shadow.camera.near = 0.1;
  cahaya1.shadow.camera.far = 25;
  scene.add(cahaya1);

  dirlight = new THREE.DirectionalLight(0xffeedd);
  dirlight.position.set(0, 0, 1);
  scene.add(dirlight);

  audio = new THREE.AudioListener();
  camera.add(audio);
  audio1 = new THREE.Audio(audio);
  lodr = new THREE.AudioLoader().load("Audio/Skyrim_Tundra.mp3", (hasil) =>
  {
    audio1.setBuffer(hasil);
    audio1.play();
  });

  meshFloor = new Physijs.Mesh
  (
    new THREE.PlaneGeometry(100, 100, 100, 100),
    new THREE.MeshLambertMaterial
    ({
      color: 0xffffff,
      wireframe: USE_WIREFRAME,
    })
  );
  meshFloor.rotation.x -= Math.PI / 2;
  meshFloor.receiveShadow = true;
  scene.add(meshFloor);

  var bumper, bumper_geom = new THREE.BoxGeometry(2, 2, 100);

  bumper = new Physijs.BoxMesh
  (
    bumper_geom,
    new THREE.MeshLambertMaterial
    ({
      color: 0xffffff,
      wireframe: USE_WIREFRAME,
    }),

  );
  bumper.position.y = 0.5;
  bumper.position.x = -50;
  bumper.receiveShadow = false;
  bumper.castShadow = true;
  scene.add(bumper);

  bumper = new Physijs.BoxMesh
  (
    bumper_geom,
    new THREE.MeshLambertMaterial
    ({
      color: 0xffffff,
      wireframe: USE_WIREFRAME,
    }),

  );
  bumper.position.y = 0.5;
  bumper.position.x = 50;
  bumper.receiveShadow = false;
  bumper.castShadow = true;
  scene.add(bumper);

  hitsal = 9000;
  geosal = new THREE.Geometry();
  for (let i = 0; i < hitsal; i++)
  {
    tursal = new THREE.Vector3(
      Math.random() * 400 - 200,
      Math.random() * 500 - 250,
      Math.random() * 400 - 200
    );

    tursal.velocity = {};
    tursal.velocity = 0;
    geosal.vertices.push(tursal);
  }
  textr = new THREE.TextureLoader().load("texture/snow.png");
  matsal = new THREE.PointsMaterial({
    map: textr,
    size: 1,
    transparent: true,
  });

  salju = new THREE.Points(geosal, matsal);
  scene.add(salju);

  camera.position.set(0, player.height, -5);
  camera.lookAt(new THREE.Vector3(0, player.height, 0));

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  loader = new THREE.CubeTextureLoader();
  skyBox = loader.load([
    "texture/dark_lf.jpg",
    "texture/dark_rt.jpg",
    "texture/dark_up.jpg",
    "texture/dark_dn.jpg",
    "texture/dark_ft.jpg",
    "texture/dark_bk.jpg",
  ]);

  lodr = new THREE.OBJLoader();
  lodr.load("OBJ/breezehomeLow.obj", function (object)
  {
    scene.add(object);
    object.position.set(20, -1.7, 20);
    object.rotation.y = 4.5;
    object.scale.set(1.6, 1.6, 1.6);
  });

  lodr1 = new THREE.OBJLoader();
  lodr1.load("Tree/Tree.obj", function (object)
  {
    scene.add(object);
    object.position.set(30, 0, 30);
    object.scale.set(2.5, 2.5, 2.5);
  });

  lodr2 = new THREE.OBJLoader();
  lodr2.receiveShadow = true;
  lodr2.castShadow = true;
  lodr2.load("Tree/Tree.obj", function (object)
  {
    scene.add(object);
    object.position.set(37, 0, 49);
    object.scale.set(2.5, 2.5, 2.5);
  });

  var mtl4 = new THREE.MTLLoader();
  mtl4.load('OBJ/medieval-house-2/medieval-house-2.mtl', function (materials) {
    materials.preload();
    let lodr4 = new THREE.OBJLoader();
    lodr4.setMaterials(materials);
    lodr4.load("OBJ/medieval-house-2/medieval-house-2.obj", function (object)
    {
      scene.add(object);
    object.position.set(-30, 1, 30);
    object.rotation.y = 480;
    object.scale.set(2.0, 2.0, 2.0);
    });
  })

  var mtl6 = new THREE.MTLLoader();
  mtl6.load('OBJ/alduin-dragon/alduin-dragon.mtl', function (materials) {
    materials.preload();
    let lodr6 = new THREE.OBJLoader();
    lodr6.setMaterials(materials);
    lodr6.load("OBJ/alduin-dragon/alduin-dragon.obj", function (object)
    {
      scene.add(object);
      object.position.set(300, 200, 30);
      object.rotation.y = 30;
      object.scale.set(0.1, 0.1, 0.1);
    });
  })

  var mtl7 = new THREE.MTLLoader();
  mtl7.load('OBJ/old-house/old-house.mtl', function (materials) {
    materials.preload();
    let lodr7 = new THREE.OBJLoader();
    lodr7.setMaterials(materials);
    lodr7.load("OBJ/old-house/old-house.obj", function (object)
    {
      scene.add(object);
      object.position.set(-30, 0, -30);
      object.rotation.y = 120;
      object.scale.set(2.5, 2.5, 2.5);
    });
  })

  var mtl8 = new THREE.MTLLoader();
  mtl8.load('OBJ/tree-05/tree-05.mtl', function (materials) {
    materials.preload();
    let lodr8 = new THREE.OBJLoader();
    lodr8.setMaterials(materials);
    lodr8.load("OBJ/tree-05/tree-05.obj", function (object)
    {
      scene.add(object);
      object.position.set(-27, 0, -15);
      object.rotation.y = 120;
      object.scale.set(0.2, 0.2, 0.2);
    });
  })

  var mtl9 = new THREE.MTLLoader();
  mtl9.load('OBJ/tree-un/tree-un.mtl', function (materials) {
    materials.preload();
    let lodr9 = new THREE.OBJLoader();
    lodr9.setMaterials(materials);
    lodr9.load("OBJ/tree-un/tree-un.obj", function (object)
    {
      scene.add(object);
      object.position.set(-30, 1, 15);
      object.rotation.y = 120;
      object.scale.set(1.0, 1.0, 1.0);
    });
  })

  lodr9 = new THREE.OBJLoader();
  lodr9.load("OBJ/sand-base.obj", function (object)
  {
    scene.add(object);
    object.position.set(0, 0, 0);
    object.rotation.y = 0;
    object.scale.set(50.0, 80.0, 65.0);
  });

  lodr5 = new THREE.TextureLoader();
  lodr5.load("texture/awan.png", function (texture)
  {
    cloudgeo = new THREE.PlaneBufferGeometry(800, 800);
    cloudmat = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
    });
    for (let p = 0; p < 25; p++)
    {
      let cloud = new THREE.Mesh(cloudgeo, cloudmat);
      cloud.position.set(
        Math.random() * 800 - 400,
        500,
        Math.random() * 500 - 450
      );
      cloud.rotation.x = 1.16;
      cloud.rotation.y = -0.12;
      cloud.rotation.z = Math.random() * 360;
      cloud.material.opacity = 0.6;
      cloudparticles.push(cloud);
      scene.add(cloud);
    }
  });

  scene.background = skyBox;
  clock = new THREE.Clock();
  contr = new THREE.FirstPersonControls(camera, renderer.domElement);
  contr.lookSpeed = 0.08;

  animate();
}

function animate()
{
  requestAnimationFrame(animate);

  // key yang digunakan untuk bergerak

  if (keyboard[87]) {
    // Tombol W
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard[83]) {
    // Tombol S
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if (keyboard[65]) {
    // Tombol A

    // menggerakan motion 90 derajat
    camera.position.x +=
      Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
  }
  if (keyboard[68]) {
    // Tombol D
    camera.position.x +=
      Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z +=
      -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }

  geosal.vertices.forEach((p) => {
    p.velocity -= 0.2 * Math.random() * 0.05;
    p.y += p.velocity;
    if (p.y < -100) {
      p.y = 100;
      p.velocity = 0;
    }
  });
  geosal.verticesNeedUpdate = true;
  salju.rotation.y += 0.003;

  contr.update(clock.getDelta());
  cloudparticles.forEach((p) => {
    p.rotation.z -= 0.002;
  });
  renderer.render(scene, camera);
}

function keyDown(event)
{
  keyboard[event.keyCode] = true;
}

function keyUp(event)
{
  keyboard[event.keyCode] = false;
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
window.onload = init;