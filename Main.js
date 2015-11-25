var scene;
var camera;
var renderer;
var geometry;
var material;
var cube;
var currentTime;
var deltaTime;
var lastTime = Date.now();
var bodies = [];
var PI = 3.14159;
var directionalLight;
var pointGravity = 0.1;
var center = new THREE.Vector3(0,0,0);
var deltaVec = new THREE.Vector3(0,0,0);
var reuseVec = new THREE.Vector3(0,0,0);
var sphereRadius = 1;
var collisionStrength = 8;
var direction = new THREE.Vector3(0,0,0);
var totalEnergy = 0;
var particleObj;

var controls;

function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//geometry = new THREE.BoxGeometry( 1, 1, 1 );
	//material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	//cube = new THREE.Mesh( geometry, material );
	//scene.add( cube );//add cube to be rendered

	camera.position.z = 175;//fix camera to see cube
	camera.position.y = 75;//fix camera to see cube

	controls = new THREE.OrbitControls( camera );
	controls.damping = 0.2;
	controls.addEventListener( 'change', render );

	/*
	for (var x = 0; x < 10; x++){
		bodies[x]=new Body(x*1.5,x,x,10,0,-0.1,0,x);//create objects 
	}*/
	
	window.addEventListener("resize", onWindowResize, false); //for autocalling onWindowResize function

	directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
	directionalLight.position.set( -1, 1, 1 );
	scene.add( directionalLight );

	console.log("about to initiate particle");
	particleObj = new Particle();
}

function render() {
	//keeping track of time between frames
	currentTime = Date.now();
	deltaTime = (currentTime - lastTime) / 1000; 
	lastTime = currentTime;

	//start callback to keep calling render
	requestAnimationFrame( render );

	totalEnergy = 0;

	/*
	//update every body in bodies
	for (var x=0; x<bodies.length; x++){
		//need to calculate the angle to a center point, apply gravity to that point
		//xyz - XYZ = norm(d) * acc = g
		center.set(0,0,0);
		center.sub(bodies[x].loc)
		center.normalize()
		center.multiplyScalar(pointGravity )
		bodies[x].addForceVec(center);
		for (var y=0; y<bodies.length; y++){
			if (x!=y){
				//collision test between every particle
				reuseVec.set(0,0,0);
				reuseVec.subVectors(bodies[x].loc, bodies[y].loc);
				if (reuseVec.length() < sphereRadius * 2){
					direction.copy(reuseVec);
					direction.normalize();
					bodies[x].addForceVec(direction.multiplyScalar(collisionCurve(reuseVec.length())));
					bodies[y].addForceVec(direction.negate().multiplyScalar(collisionCurve(reuseVec.length())));
				}
			}
		}
		bodies[x].update(deltaTime);
		//YOU SHOULD CALCULATE THE ENERGY OF THE SYSTEM
		totalEnergy += Math.pow(bodies[x].vel.length(), 2) / 2;  //Ke = 1/2mv^2   m=1
		center.set(0,0,0);
		center.add(bodies[x].loc);
		totalEnergy += center.length() * pointGravity;  //Pe = mgh

		//console.log("Updating bodies");
		//console.log(x);
	}
	console.log(totalEnergy);
	*/
	//basic animation
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
	//console.log("rotating cube");
	//
	
	particleObj.TimeStep(deltaTime);

	//not sure, renders scene to camera?
	renderer.render( scene, camera );
}

function onWindowResize(){ //needs window.addEventListener to be autocalled
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function getVecFromAToB(vecA, vecB){
	
}

function collisionCurve(len){
	//len is less than 2*sphereRadius
	len = len / 2*sphereRadius;


	return ((Math.log((-len)+1.01)/Math.log(10))+2)/2  *  collisionStrength;
	//return ((Math.log((-len)+1.0001)/Math.log(10))+4)/2  *  collisionStrength;
}
