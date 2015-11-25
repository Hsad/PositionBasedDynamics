//Its absurd how simple this is
//There are balls just confined.  literally clamped to the edges of the box
//then making distance conections between two of them is enough to hmake them bounce around
//conecting 4 particles with 6 line makes a functioning rigid body.
//this all came together in about 15 minutes once the distance constraint got worked out.
//This is so sick
function Particle(){
	console.log("initiateing Particle");
	this.pos = [] //= new THREE.Vector3().copy(Pos_);
	this.oldPos = [] // = new THREE.Vector3().copy(Vel_);
	this.acc = [] // force accumlators??
	this.invmass = [] // = 1/Mass_;
	this.gravity = new THREE.Vector3(0,-1,0);
	this.timestep;
	this.constraints = [];

	this.numParticles = 50;
	this.numIter = 10;
	this.tempVec = new THREE.Vector3();
	this.meshArray = [];
	this.minForClamp = new THREE.Vector3(-100,-20,-100);
	this.maxForClamp = new THREE.Vector3(100,100,100);

	for (var c=0; c<this.numParticles; c++){
		this.pos.push(new THREE.Vector3(c+Math.random(),c+Math.random(),c+Math.random()));
		this.oldPos.push(new THREE.Vector3(c+Math.random(),c+Math.random(),c+Math.random()));
		this.acc.push(new THREE.Vector3());
		this.invmass.push( 1/5 );
		this.meshArray.push(
				new THREE.Mesh( new THREE.SphereGeometry( sphereRadius, 5, 5 ), 
				new THREE.MeshLambertMaterial( { color: 0x00ff00 } ) ) 
				);
		scene.add( this.meshArray[c] );
	}

	for (var c=15; c < this.numParticles/2; c++){
		this.constraints.push(new DistanceConstraint(this.pos[c*2],this.pos[c*2+1], c*2));
	}
	//four sided geo
	this.constraints.push(new DistanceConstraint(this.pos[0],this.pos[1], 10));
	this.constraints.push(new DistanceConstraint(this.pos[0],this.pos[2], 10));
	this.constraints.push(new DistanceConstraint(this.pos[0],this.pos[3], 10));
	this.constraints.push(new DistanceConstraint(this.pos[1],this.pos[2], 10));
	this.constraints.push(new DistanceConstraint(this.pos[2],this.pos[3], 10));
	this.constraints.push(new DistanceConstraint(this.pos[3],this.pos[1], 10));
	//
	this.constraints.push(new DistanceConstraint(this.pos[8],this.pos[9], 10));
	this.constraints.push(new DistanceConstraint(this.pos[8],this.pos[10], 10));
	this.constraints.push(new DistanceConstraint(this.pos[8],this.pos[11], 10));
	this.constraints.push(new DistanceConstraint(this.pos[9],this.pos[10], 10));
	this.constraints.push(new DistanceConstraint(this.pos[10],this.pos[11], 10));
	this.constraints.push(new DistanceConstraint(this.pos[11],this.pos[9], 10));
	//
	this.constraints.push(new DistanceConstraint(this.pos[12],this.pos[13], 10));
	this.constraints.push(new DistanceConstraint(this.pos[12],this.pos[14], 10));
	this.constraints.push(new DistanceConstraint(this.pos[12],this.pos[15], 10));
	this.constraints.push(new DistanceConstraint(this.pos[13],this.pos[14], 10));
	this.constraints.push(new DistanceConstraint(this.pos[14],this.pos[15], 10));
	this.constraints.push(new DistanceConstraint(this.pos[15],this.pos[13], 10));
	//
	this.constraints.push(new DistanceConstraint(this.pos[8],this.pos[15], 50));
	//
	//hinge?
	this.constraints.push(new DistanceConstraint(this.pos[4],this.pos[5], 10));
	this.constraints.push(new DistanceConstraint(this.pos[4],this.pos[6], 10));
	this.constraints.push(new DistanceConstraint(this.pos[5],this.pos[6], 10));
	this.constraints.push(new DistanceConstraint(this.pos[5],this.pos[7], 10));
	this.constraints.push(new DistanceConstraint(this.pos[6],this.pos[7], 10));
}

Particle.prototype.Verlet = function(){
	for( var x = 0; x < this.numParticles; x++){
		this.tempVec.copy(this.pos[x]);
		//x += x - oldx + a*dt*dt   essentually v + at^2
		this.pos[x].setX(this.pos[x].x + this.pos[x].x - this.oldPos[x].x + this.acc[x].x * this.timestep * this.timestep);
		this.pos[x].setY(this.pos[x].y + this.pos[x].y - this.oldPos[x].y + this.acc[x].y * this.timestep * this.timestep);
		this.pos[x].setZ(this.pos[x].z + this.pos[x].z - this.oldPos[x].z + this.acc[x].z * this.timestep * this.timestep);
		this.oldPos[x].copy(this.tempVec);
	}
}

Particle.prototype.AccumulateForces = function(){
	//apply gravity to everything
	for( var x = 0; x<this.numParticles; x++){
		this.acc[x].copy(this.gravity);
		//this.acc[x].copy(this.tempVec.set(0,0,0).sub(this.pos[x]).normalize()); // gravity
	}
}

Particle.prototype.SatisfyConstraints = function(){
	//wait on this one
	for (var i = 0; i < this.numIter; i++){
		//C1
		//console.log("clamping");
		for (var c = 0; c < this.numParticles; c++){
			this.pos[c].clamp(this.minForClamp, this.maxForClamp);
			//this.pos[c].clampScalar(0, 60 );
			//console.log(this.pos[c]);
		}
		//C2
		//console.log("satisfying");
		for (var x = 0; x < this.constraints.length; x++){
			this.constraints[x].Satisfy();
		}
	}
}

Particle.prototype.TimeStep = function(dt){ //might need to take in a time step
	this.timestep = dt;
	this.AccumulateForces();
	this.Verlet();
	this.SatisfyConstraints();
	this.updateMesh();
}

Particle.prototype.updateMesh = function(){
	for (var x = 0; x<this.numParticles; x++){
		this.meshArray[x].position.x = this.pos[x].x;
		this.meshArray[x].position.y = this.pos[x].y;
		this.meshArray[x].position.z = this.pos[x].z;
	}
}

function DistanceConstraint(particle1, particle2, distance){
	this.p1 = particle1; //reference to particle
	this.p2 = particle2;
	this.dist = distance;
	console.log(this.p1);
	console.log(this.p2);
	this.ray1 = new DebugRay(this.p1, this.p2);
}

DistanceConstraint.prototype.Satisfy = function(){
	/*
	deltaVec.set(0,0,0);
	deltaVec.copy(this.p2);
	deltaVec.sub(this.p1);  //delta = x2-x1
	if (deltaVec.length() != 0){
		var diff = (deltaVec.length() - this.dist) / deltaVec.length();
	}
	else {
		return;
	}
	this.p1.add(deltaVec.multiplyScalar(0.5*diff));
	this.p2.sub(deltaVec.multiplyScalar(0.5*diff));
	console.log(this.p1);
	console.log(this.p2);
	*/
	
	deltaVec.subVectors(this.p1 , this.p2);
	var diff = deltaVec.length() - this.dist;
	deltaVec.normalize();
	deltaVec.multiplyScalar(diff/2);
	this.p1.sub(deltaVec);
	this.p2.add(deltaVec);
	this.ray1.update();


	/*	//delta*=restlength*restlength/(delta*delta+restlength*restlength)-0.5;

	deltaVec.set(0,0,0);
	deltaVec.copy(this.p2);
	deltaVec.sub(this.p1);  //delta = x2-x1
	//console.log(deltaVec);
	//reuseVec.copy(deltaVec);
	//using Sqrt Approximation
	reuseVec.multiplyVectors(deltaVec, deltaVec);
	//console.log(reuseVec);
	reuseVec.addScalar(this.dist*this.dist - 0.5);
	//console.log(reuseVec);
	reuseVec.x = 1/reuseVec.x;
	reuseVec.y = 1/reuseVec.y;
	reuseVec.z = 1/reuseVec.z;
	console.log(reuseVec);
	//delta*=restlength*restlength/(delta*delta+restlength*restlength)-0.5;
	deltaVec.multiply( reuseVec.multiplyScalar(this.dist*this.dist) );
	console.log(deltaVec);
	//console.log(this.dist);
	this.ray1.update()
	this.p1.add(deltaVec);
	this.p2.sub(deltaVec);
	//console.log(this.p1);
	//console.log(this.p2);
	*/
}

function DebugRay(v1,v2){
	var geo = new THREE.Geometry();
	geo.vertices.push(v1);
	geo.vertices.push(v2);
	this.line = new THREE.Line(geo, new THREE.LineBasicMaterial({color: 0xFF00FF, lineWidth: 1}));
	scene.add(this.line);
}

DebugRay.prototype.update = function(){
	//this.line.geometry.vertices[0].copy(v1);
	//this.line.geometry.vertices[1].copy(v2);
	this.line.geometry.verticesNeedUpdate = true;
}
