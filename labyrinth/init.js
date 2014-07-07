// **WebGL initialization**
function initGL(canvas)
{
    console.log("initGL");
    
    var gl;
    
    try
    {
	// get context
	gl = canvas.getContext("experimental-webgl");

	// viewport
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
    }
    catch (e)
    {
    }

    if (!gl)
    {
	alert("Could not initialise WebGL, sorry :-(");
	exit()
    }
    
    return gl;
}

// **shader program initialization**
function initShaderProgram(gl)
{
    console.log("initShaderProgram");
    
    // get shaders from the document
    var fragmentShader = getShader(gl, gl.FRAGMENT_SHADER, "shaders/fragment.shdr");
    var vertexShader = getShader(gl, gl.VERTEX_SHADER, "shaders/vertex.shdr");
    
    // start the shader program
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
	alert("Could not initialise shaders");
	exit()
    }
    
    gl.useProgram(shaderProgram);
    
    // link the attributes between the shader script and the shader program
    // vertex position
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    // texture coordinates
    shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

    // vertex normal
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    // link the uniform variables between the shader script and the shader program
    // projection matrix
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");

    // model view matrix
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    // normal matrix
    shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

    // sampler for textures
    shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

    // use lighting boolean
    shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");

    // light parameters
    shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
    shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
    shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");

    // alpha for blending (transparency)
    shaderProgram.alphaUniform = gl.getUniformLocation(shaderProgram, "uAlpha");
    
    return shaderProgram;
}