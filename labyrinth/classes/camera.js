var gId = 0;

function Camera(x, y, z, pitch, yaw)
{
    gId += 1;
    this.id = gId;
    
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.pitch = pitch;
    this.yaw = yaw;
    
    this.speed = 0;
    this.pitchRate = 0;
    this.yawRate = 0;
    this.joggingAngle = 0;
    
    console.log("new Camera, id: "+this.id+" ("+this.x+", "+this.y+", "+this.z+") ("+this.pitch+", "+this.yaw+")");
}

Camera.prototype.set = function(mvMatrix)
{
    // apply transformations
    mat4.rotate(mvMatrix, degToRad(-this.pitch), [ 1, 0, 0 ]);
    mat4.rotate(mvMatrix, degToRad(-this.yaw), [ 0, 0, 1 ]);
    mat4.translate(mvMatrix, [ -this.x, -this.y, -this.z ]);
}

Camera.prototype.handleKeys = function(currentlyPressedKeys)
{
    if (currentlyPressedKeys[65])
    {
	// a
	this.pitchRate = 0.1;
    }
    else if (currentlyPressedKeys[81])
    {
	// q
	this.pitchRate = -0.1;
    }
    else
    {
	this.pitchRate = 0;
    }
    
    if (currentlyPressedKeys[37])
    {
	// Left cursor key
	this.yawRate = 0.1;
    }
    else if (currentlyPressedKeys[39])
    {
	// Right cursor key
	this.yawRate = -0.1;
    }
    else
    {
	this.yawRate = 0;
    }

    if (currentlyPressedKeys[38])
    {
        // Up cursor key
	this.speed = 0.003;
    }
    else if (currentlyPressedKeys[40])
    {
        // Down cursor key
	this.speed = -0.003;
    }
    else
    {
	this.speed = 0;
    }
}

Camera.prototype.animate = function(elapsedTime)
{
    if(this.speed != 0)
    {
	this.x -= Math.sin(degToRad(this.yaw)) * this.speed * elapsedTime;
        this.y += Math.cos(degToRad(this.yaw)) * this.speed * elapsedTime;

        this.joggingAngle += elapsedTime * 0.6;
        this.z = Math.sin(degToRad(this.joggingAngle)) / 20 + 0.4;
    }
    
    this.pitch += this.pitchRate * elapsedTime;
    this.yaw += this.yawRate * elapsedTime;
}