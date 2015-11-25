function Body(xl,yl,zl,m,velx,vely,velz,id){
	console.log(xl);
	console.log(yl);
	console.log(velx);
	console.log(vely);
	this.mass = m;
	this.acc = new THREE.Vector3(0,0,0);
	this.vel = new THREE.Vector3(velx,vely,velz);
	this.loc = new THREE.Vector3(xl,yl,zl);
	this.ID = id;
	//657D75ABCA

	//console.log(this.loc);
	//console.log(this.vel);

	this.mesh = new THREE.Mesh( new THREE.SphereGeometry( sphereRadius, 5, 5 ), 
			new THREE.MeshLambertMaterial( { color: 0x00ff00 } ) );
	scene.add( this.mesh );//add sphere to be rendered
}

Body.prototype.update = function(delta){
	//console.log(delta);
	//console.log("printing acc, vel, and loc, then them + and *, and what they are again");
	//console.log(this.acc);
	//console.log(this.vel);
	//console.log(this.loc);
	//console.log(this.acc + this.vel * this.loc);
	//console.log(this.acc);
	//console.log(this.vel);
	//console.log(this.loc);
	//need to call with orbital mathmatics
	//should react to forces of all bodies
	//or cound have classes of heavy bodies and smaller satilites
	this.vel.x += this.acc.x * delta;
	this.vel.y += this.acc.y * delta;
	this.vel.z += this.acc.z * delta;
	this.loc.x += this.vel.x * delta;
	this.loc.y += this.vel.y * delta;
	this.loc.z += this.vel.z * delta;
	this.mesh.position.x = this.loc.x;
	this.mesh.position.y = this.loc.y;
	this.mesh.position.z = this.loc.z;
	//console.log(this.loc);
	this.acc.x = 0;
	this.acc.y = 0;
	this.acc.z = 0;
}

Body.prototype.addForce = function(xForce,yForce,zForce){
	this.acc.x += xForce;
	this.acc.y += yForce;
	this.acc.z += zForce;
}

Body.prototype.addForceVec = function(vec){
	//console.log(vec)
	//console.log("about to add to acceleration");
	//console.log(this.acc);
	this.acc.add(vec);
	//console.log(this.acc);
}
