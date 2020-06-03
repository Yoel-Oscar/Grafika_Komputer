var scene, camera, renderer, mesh;                                  //  inisialisasi
var meshFloor, loader,skyBox,keyboard = {}, langit;                //   latar
var lodr, lodr1, lodr2, lodr3, lodr4, lodr5;                                    //    objek
var txt;                                                         //     terrain
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 }; 
var USE_WIREFRAME = false;                                     //       untuk menampilkan wireframe dari objek mesh
var lantai, objload;                                                     //        karakter
var textr, daratanT;                                         //         daratan dan teksture
var clock, contr;
var audio;
var audio1;
var fog, dirlight, cloudparticles = [];

//cahaya
var cahaya, cahaya1;                                                 

// salju turun
var geosal, hitsal, salju, matsal;

function init(){

    //Latar awal dari scene hingga audio
	scene     = new THREE.Scene();
	camera    = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 1.1, 10000);
    
    
    cahaya1   = new THREE.PointLight(0xffffff, 0.9, 18);
    cahaya1.position.set(38,2,30);
    cahaya1.castShadow = true;
    cahaya1.shadow.camera.near = 0.1;
    cahaya1.shadow.camera.far  = 25;
    scene.add(cahaya1);
    
    // fogColor = new THREE.Color(0xffffff);
    // scene.background = fogColor;
    // scene.fog = new THREE.FogExp2(fogColor, 0.1);
    
    dirlight = new THREE.DirectionalLight(0xffeedd);
    dirlight.position.set(0,0,1);
    scene.add(dirlight);
    

    // code untuk audio
    audio  = new THREE.AudioListener();
    camera.add(audio);
    audio1 = new THREE.Audio(audio); 
    lodr   = new THREE.AudioLoader().load('Audio/Skyrim_Tundra.mp3',(
        (hasil)=>{
            audio1.setBuffer(hasil);
            audio1.play();
        }
    ));
    
    
	meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100, 100,100),
        new THREE.MeshLambertMaterial({
            color : 0xfafafa, 
            wireframe:USE_WIREFRAME})
    );
    
	meshFloor.rotation.x   -= Math.PI / 2; // cara untuk memutar 90 derajat
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);
    
    
    // teksture dan salju
    
    hitsal = 9000;         // Jumlah dari salju 
    geosal = new THREE.Geometry();
    for(let i=0; i<hitsal; i++) {
        tursal = new THREE.Vector3(
            Math.random() * 400-200,  //math random yang dikurangi setengahnya
            Math.random() * 500-250,
            Math.random() * 400-200
        )
        //turun salju

        tursal.velocity = {};
        tursal.velocity = 0;         // di inisialisasi dengan jumlah kecepatan 0
        geosal.vertices.push(tursal);
    }
    textr  = new THREE.TextureLoader().load('texture/snow.png'); //material dari salju
    matsal = new THREE.PointsMaterial({
        map         : textr,
        size        : 1,
        transparent : true      // dilakukan transparant, karena jika tidak akan memunculkan bayangan dibelakangnya
    })

    salju = new THREE.Points(geosal, matsal);
    scene.add(salju);
    
    camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));
	
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
    
    loader = new THREE.CubeTextureLoader();
    skyBox = loader.load([

    'texture/dark_lf.jpg',
    'texture/dark_rt.jpg', 
    'texture/dark_up.jpg',
    'texture/dark_dn.jpg',
    'texture/dark_ft.jpg',
    'texture/dark_bk.jpg',
    

    ]);
    lodr = new THREE.OBJLoader();

    lodr.load(
    
    'OBJ/breezehomeLow.obj',
    function(object){
        
        scene.add(object);
        object.position.set(20, -1.7, 20);
        object.rotation.y = 4.5
        object.scale.set(1.6,1.6,1.6);
        },
    
    
    );

    lodr1 = new THREE.OBJLoader();

    lodr1.load(
    
    'Tree/Tree.obj',
    function(object){
        
        scene.add(object);
        object.position.set(30, 0, 30);
        object.scale.set(2.5, 2.5 ,2.5);
        },
    
    
    );

    lodr2 = new THREE.OBJLoader();
    lodr2.receiveShadow = true;
    lodr2.castShadow    = true;

    lodr2.load('Tree/Tree.obj',function(object){
        
        scene.add(object);
        object.position.set(37, 0, 49);
        object.scale.set(2.5, 2.5 ,2.5);
        
        },
    
    
    );
    

    

    // lodr4 = new THREE.MTLLoader();
    // lodr4.setTexturePath('OBJ');
    // lodr4.setPath('OBJ');
    // lodr4.load("Pine_4m.mtl", function(object){
    //     object.preload();
        
    //     objload = new THREE.OBJLoader();
    //     objload.setMaterials(object);
    //     objload.setPath('OBJ');
    //     objload.load("Pine_4m.obj", function(mesh){
            
    //         scene.add(mesh);


    //     });
    // });

    lodr5 = new THREE.TextureLoader();
    lodr5.load("texture/awan.png", function(texture){

        cloudgeo = new THREE.PlaneBufferGeometry(800,800);
        cloudmat = new THREE.MeshLambertMaterial({
            map :texture,
            transparent :true
        
        });
        for(let p = 0; p<25; p++){
            let cloud = new THREE.Mesh(cloudgeo, cloudmat);
            cloud.position.set(
                Math.random()*800 - 400, 500,
                Math.random()*500 - 450
            );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random()*360;
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

function animate(){
	requestAnimationFrame(animate);
	
	
    // key yang digunakan untuk bergerak
    
	if(keyboard[87]){ // Tombol W
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // Tombol S
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
    if(keyboard[65]){ // Tombol A
        
		// menggerakan motion 90 derajat
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // Tombol D
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}
	
    geosal.vertices.forEach(p => {
        p.velocity -= 0.2 *Math.random() * 0.05;
        p.y += p.velocity;
        if(p.y < -100){
            p.y = 100;
            p.velocity = 0;
        }
    })
    geosal.verticesNeedUpdate = true;
    salju.rotation.y += 0.003;
    
    contr.update(clock.getDelta());
    cloudparticles.forEach(p => {
        p.rotation.z -=0.002;
    });
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