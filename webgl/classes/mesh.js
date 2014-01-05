function Mesh(gl, x, y, z, buffer)
{
    console.log("new Mesh "+x+" "+y+" "+z);
    
    this.gl = gl;
    this.x = x;
    this.y = y;
    this.z = z;
    this.buffer = buffer;
    
    this.xRot = 0;
    this.yRot = 0;
    this.zRot = 0;
    
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.zSpeed = 0;
    
    this.filter = 0;
    this.sampler = 0;
}

Mesh.prototype.drawMesh = function(shaderProgram, pMatrix, mvMatrix)
{
    var gl = this.gl;
    
    // get vertex position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.buffer.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    // get vertex texture coord buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.vertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.buffer.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    // get vertex normal buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.buffer.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0)
    
    // active texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.buffer.textures[this.filter]);
    
    // choose sampler for texture
    gl.uniform1i(shaderProgram.samplerUniform, this.sampler);
    
    // get the vertex index buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.vertexIndexBuffer);
    
    // draw
    setMatrixUniforms(gl, shaderProgram, pMatrix, mvMatrix);
    
    gl.drawElements(gl.TRIANGLES, this.buffer.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
}

Mesh.prototype.draw = function(shaderProgram, pMatrix, mvMatrix)
{
    // apply transformations
    mat4.translate(mvMatrix, [ this.x, this.y, this.z ]);
    mat4.rotate(mvMatrix, degToRad(this.xRot), [ 1, 0, 0 ]);
    mat4.rotate(mvMatrix, degToRad(this.yRot), [ 0, 1, 0 ]);
    mat4.rotate(mvMatrix, degToRad(this.zRot), [ 0, 0, 1 ]);
    
    // draw mesh
    this.drawMesh(shaderProgram, pMatrix, mvMatrix);
}

Mesh.prototype.handleKeyDown = function(event)
{
    if (String.fromCharCode(event.keyCode) == "F")
    {
	this.filter += 1;
	if (this.filter == 3)
	{
	    this.filter = 0;
	}
    }
}

Mesh.prototype.handleKeys = function(currentlyPressedKeys)
{
    if (currentlyPressedKeys[37])
    {
	// Left cursor key
	this.ySpeed -= 1;
    }

    if (currentlyPressedKeys[39])
    {
	// Right cursor key
	this.ySpeed += 1;
    }

    if (currentlyPressedKeys[38])
    {
        // Up cursor key
	this.xSpeed -= 1;
    }

    if (currentlyPressedKeys[40])
    {
        // Down cursor key
	this.xSpeed += 1;
    }
}


Mesh.prototype.animate = function(elapsedTime)
{
    this.xRot += (this.xSpeed * elapsedTime) / 1000.0;
    this.yRot += (this.ySpeed * elapsedTime) / 1000.0;
    this.zRot += (this.zSpeed * elapsedTime) / 1000.0;
}