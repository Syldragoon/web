var gId = 0;

function Mesh(gl, buffer)
{
    this.gl = gl;
    this.buffer = buffer;
    
    gId += 1;
    this.id = gId;
    
    this.x = 0;
    this.y = 0;
    this.z = 0;
    
    this.pitch = 0;
    this.yaw = 0;
    
    this.filter = 0;
    this.sampler = 0;
    
    console.log("new Mesh, id: "+this.id);
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

Mesh.prototype.generateFrontWall = function(groundSize, i, j)
{
    this.x = -groundSize/2 + 0.5 + j;
    this.y = groundSize/2 - i;
    this.z = this.buffer.size/2;
    
    this.pitch = 90;
    
    console.log("Mesh::generateFrontWall ("+this.x+", "+this.y+")");
}

Mesh.prototype.generateSideWall = function(groundSize, i, j)
{
    this.x = -groundSize/2 + j;
    this.y = groundSize/2 - 0.5 - i;
    this.z = this.buffer.size/2;
    
    this.pitch = 90;
    this.yaw = 90;
    
    console.log("Mesh::generateSideWall ("+this.x+", "+this.y+")");
}

Mesh.prototype.draw = function(shaderProgram, pMatrix, mvMatrix)
{
    // record the matrix
    mvPushMatrix(mvMatrix);
    
    // apply transformations
    mat4.translate(mvMatrix, [ this.x, this.y, this.z ]);
    mat4.rotate(mvMatrix, degToRad(this.pitch), [ 1, 0, 0 ]);
    mat4.rotate(mvMatrix, degToRad(this.yaw), [ 0, 1, 0 ]);
    
    // draw mesh
    this.drawMesh(shaderProgram, pMatrix, mvMatrix);
    
    // load the last recorded matrix
    mvPopMatrix(mvMatrix);
}

Mesh.prototype.handleKeys = function(currentlyPressedKeys)
{
}

Mesh.prototype.animate = function(elapsedTime)
{
}