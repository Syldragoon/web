function Buffer(gl, type, size, src)
{
    console.log("new Buffer "+type+" "+src);
    
    this.gl = gl;
    this.type = type;
    this.size = size;
    this.src = src;
    
    this.vertexPositionBuffer;
    this.vertexTextureCoordBuffer;
    this.vertexIndexBuffer;
    this.vertexNormalBuffer;
    
    this.textures = Array();
    
    this.initBuffer();
    this.initTextures();
}

//cube
Buffer.prototype.initCubeBuffer = function()
{
    console.log("Buffer::initCubeBuffer");
    
    var gl = this.gl;
    
    // **vertex position buffer**
    // init
    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);

    // fill data
    vertices =
    [
        // Front face
        -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    
        // Back face
        -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
    
        // Top face
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
    
        // Bottom face
        -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
    
        // Right face
        1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
    
        // Left face
        -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];
    
    for(var i = 0; i < vertices.length; i++)
    {
	vertices[i] *= this.size/2;
    }
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // fill item size
    this.vertexPositionBuffer.itemSize = 3;

    // fill number of items
    this.vertexPositionBuffer.numItems = 24;

    // **vertex normal buffer**
    // init
    this.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);

    // fill data
    var vertexNormals =
    [
        // Front face
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    
        // Back face
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
    
        // Top face
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    
        // Bottom face
        0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,
    
        // Right face
        1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
    
        // Left face
        -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = 24;

    // **vertex texture coord buffer**
    // init
    this.vertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);

    // fill data
    var textureCoords =
    [
        // Front face
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    
        // Back face
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
    
        // Top face
        0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    
        // Bottom face
        1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
    
        // Right face
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
    
        // Left face
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

    // fill item size
    this.vertexTextureCoordBuffer.itemSize = 2;

    // fill number of items
    this.vertexTextureCoordBuffer.numItems = 24;

    // **index vertex buffer**
    // init
    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);

    // fill data
    var cubeVertexIndices =
    [
        0, 1, 2, 0, 2, 3, // Front face
        4, 5, 6, 4, 6, 7, // Back face
        8, 9, 10, 8, 10, 11, // Top face
        12, 13, 14, 12, 14, 15, // Bottom face
        16, 17, 18, 16, 18, 19, // Right face
        20, 21, 22, 20, 22, 23 // Left face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);

    // fill item size
    this.vertexIndexBuffer.itemSize = 1;

    // fill number of items
    this.vertexIndexBuffer.numItems = 36;
}

// plan
Buffer.prototype.initPlanBuffer = function()
{
    console.log("Buffer::initPlanBuffer");
    
    var gl = this.gl;
    
    // **vertex position buffer**
    // init
    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);

    // fill data
    vertices =
    [
        // Front face
        -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
    ];
    
    for(var i = 0; i < vertices.length; i++)
    {
	vertices[i] *= this.size/2;
    }
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // fill item size
    this.vertexPositionBuffer.itemSize = 3;

    // fill number of items
    this.vertexPositionBuffer.numItems = 4;

    // **vertex normal buffer**
    // init
    this.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);

    // fill data
    var vertexNormals =
    [
        // Front face
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
    
        // Back face
        0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = 8;

    // **vertex texture coord buffer**
    // init
    this.vertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);

    // fill data
    var textureCoords =
    [
        // Front face
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    
        // Back face
        1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

    // fill item size
    this.vertexTextureCoordBuffer.itemSize = 2;

    // fill number of items
    this.vertexTextureCoordBuffer.numItems = 8;

    // **index vertex buffer**
    // init
    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);

    // fill data
    var cubeVertexIndices =
    [
        0, 1, 2, 0, 2, 3, // Front face
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);

    // fill item size
    this.vertexIndexBuffer.itemSize = 1;

    // fill number of items
    this.vertexIndexBuffer.numItems = 6;
}

// sphere
Buffer.prototype.initSphereBuffer = function()
{
    console.log("Buffer::initSphereBuffer");
    
    var gl = this.gl;
    
    var latitudeBands = 30;
    var longitudeBands = 30;
    
    // fill data
    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];

    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++)
    {

	var theta = latNumber * Math.PI / latitudeBands;
	var sinTheta = Math.sin(theta);
	var cosTheta = Math.cos(theta);

	for (var longNumber = 0; longNumber <= longitudeBands; longNumber++)
	{
	    var phi = longNumber * 2 * Math.PI / longitudeBands;
	    var sinPhi = Math.sin(phi);
	    var cosPhi = Math.cos(phi);

	    var x = cosPhi * sinTheta;
	    var y = cosTheta;
	    var z = sinPhi * sinTheta;
	    var u = 1 - (longNumber / longitudeBands);
	    var v = 1 - (latNumber / latitudeBands);

	    normalData.push(x);
	    normalData.push(y);
	    normalData.push(z);

	    textureCoordData.push(u);
	    textureCoordData.push(v);

	    vertexPositionData.push(this.size * x);
	    vertexPositionData.push(this.size * y);
	    vertexPositionData.push(this.size * z);
	}
    }

    var indexData = [];

    for (var latNumber = 0; latNumber < latitudeBands; latNumber++)
    {
	for (var longNumber = 0; longNumber < longitudeBands; longNumber++)
	{
	    var first = (latNumber * (longitudeBands + 1)) + longNumber;
	    var second = first + longitudeBands + 1;

	    indexData.push(first);
	    indexData.push(second);
	    indexData.push(first + 1);

	    indexData.push(second);
	    indexData.push(second + 1);
	    indexData.push(first + 1);
	}
    }

    // **vertex normal buffer**
    this.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = normalData.length / 3;

    // **vertex texture coord buffer**
    this.vertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
    this.vertexTextureCoordBuffer.itemSize = 2;
    this.vertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

    // **vertex position buffer**
    this.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = vertexPositionData.length / 3;

    // **vertex index buffer**
    this.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
    this.vertexIndexBuffer.itemSize = 1;
    this.vertexIndexBuffer.numItems = indexData.length;
}

Buffer.prototype.initBuffer = function()
{
    console.log("Buffer::initBuffer");
    
    if(this.type == "cube")
    {
	this.initCubeBuffer();
    }
    else if(this.type == "plan")
    {
	this.initPlanBuffer();
    }
    else if(this.type == "sphere")
    {
	this.initSphereBuffer();
    }
    else
    {
	console.log("Unknown type: cube as default");
	this.initCubeBuffer();
    }
}

// texture loading function
Buffer.prototype.handleLoadedTextures = function()
{
    console.log("Buffer::handleLoadedTextures")
    
    var gl = this.gl;
    
    // flip the texture on y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // load texture[0] with a nearest neighborhood filtering
    gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textures[0].image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    
    // load texture[1] with a linear filtering
    gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textures[1].image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // load texture[2] with a linear filtering for closed objects and linear mipmap filtering for objects far away
    gl.bindTexture(gl.TEXTURE_2D, this.textures[2]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.textures[2].image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    
    // end of the loading
    gl.bindTexture(gl.TEXTURE_2D, null);
}

Buffer.prototype.initTextures = function()
{
    console.log("Buffer::initTextures");
    
    // create textures
    var image = new Image();

    for (var i = 0; i < 3; i++)
    {
	var texture = gl.createTexture();
	texture.image = image;
	this.textures.push(texture);
    }
    
    // load textures
    var buffer = this;
    image.onload = function()
    {
	buffer.handleLoadedTextures()
    }

    // image source file
    image.src = this.src;
}