// WebGL variable
var gl;

// shader variable
var gShaderProgram;

// projection matrix
var gPMatrix = mat4.create();

// model view matrix
var gMvMatrix = mat4.create();

//model view matrix stack used for recording (push) and loading (pop)
var gMvMatrixStack = new Array();

// buffer list
var gBufferList = new Array();

// mesh list
var gMeshList = new Array();

// keyboard
var gCurrentlyPressedKeys = {}; // hash table

// mouse
var gLastTime = 0;

var gMouseDown = false;
var gLastMouseX = null;
var gLastMouseY = null;

// animation / callback variables
var gZZoom = -20;
var gDragRotationMatrix = mat4.create();
mat4.identity(gDragRotationMatrix);

// **start the WebGL program**
function webGLStart(canvas)
{
    console.log("webGLStart");
    
    // init functions
    initGL(canvas);
    initShaders();
    
    // fill buffer list
    gBufferList.push(new Buffer(gl, "cube", 1, "pictures/crate.gif"));
    gBufferList.push(new Buffer(gl, "sphere", 2, "pictures/moon.gif"));
    
    // fill mesh list
    gMeshList.push(new Mesh(gl, 5, 0, 0, gBufferList[0]));
    gMeshList.push(new Mesh(gl, 0, 0, 0, gBufferList[0]));
    gMeshList.push(new Mesh(gl, -5, 0, 0, gBufferList[0]));
    gMeshList.push(new Mesh(gl, 0, 5, 0, gBufferList[1]));
    gMeshList.push(new Mesh(gl, 0, -5, 0, gBufferList[1]));
    
    // clear the background
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    // keyboard
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    
    // mouse
    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;
    
    // animation function
    tick();
}

// **WebGL initialization**
function initGL(canvas)
{
    console.log("initGL");
    
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
}

// **shader initialization**
function initShaders()
{
    console.log("initShaders");
    
    // get shaders from the document
    var fragmentShader = getShader(gl, gl.FRAGMENT_SHADER, "shaders/fragment.shdr");
    var vertexShader = getShader(gl, gl.VERTEX_SHADER, "shaders/vertex.shdr");
    
    // start the shader program
    gShaderProgram = gl.createProgram();
    gl.attachShader(gShaderProgram, vertexShader);
    gl.attachShader(gShaderProgram, fragmentShader);
    gl.linkProgram(gShaderProgram);

    if (!gl.getProgramParameter(gShaderProgram, gl.LINK_STATUS))
    {
	alert("Could not initialise shaders");
	exit()
    }
    
    gl.useProgram(gShaderProgram);

    // link the attributes between the shader script and the shader program
    // vertex position
    gShaderProgram.vertexPositionAttribute = gl.getAttribLocation(gShaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(gShaderProgram.vertexPositionAttribute);

    // texture coordinates
    gShaderProgram.textureCoordAttribute = gl.getAttribLocation(gShaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(gShaderProgram.textureCoordAttribute);

    // vertex normal
    gShaderProgram.vertexNormalAttribute = gl.getAttribLocation(gShaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(gShaderProgram.vertexNormalAttribute);

    // link the uniform variables between the shader script and the shader program
    // projection matrix
    gShaderProgram.pMatrixUniform = gl.getUniformLocation(gShaderProgram, "uPMatrix");

    // model view matrix
    gShaderProgram.mvMatrixUniform = gl.getUniformLocation(gShaderProgram, "uMVMatrix");

    // normal matrix
    gShaderProgram.nMatrixUniform = gl.getUniformLocation(gShaderProgram, "uNMatrix");

    // sampler for textures
    gShaderProgram.samplerUniform = gl.getUniformLocation(gShaderProgram, "uSampler");

    // use lighting boolean
    gShaderProgram.useLightingUniform = gl.getUniformLocation(gShaderProgram, "uUseLighting");

    // light parameters
    gShaderProgram.directionalColorUniform = gl.getUniformLocation(gShaderProgram, "uDirectionalColor");
    gShaderProgram.ambientColorUniform = gl.getUniformLocation(gShaderProgram, "uAmbientColor");
    gShaderProgram.lightingDirectionUniform = gl.getUniformLocation(gShaderProgram, "uLightingDirection");

    // alpha for blending (transparency)
    gShaderProgram.alphaUniform = gl.getUniformLocation(gShaderProgram, "uAlpha");
}

function getSourceSynch(url)
{
    console.log("getSourceSynch "+url);
    
    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);
    return (req.status === 200) ? req.responseText : null;
}

// compile shaders
function getShader(gl, type, path)
{
    console.log("getShader "+path);
    
    var shader = gl.createShader(type);
    gl.shaderSource(shader, getSourceSynch(path));
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
	alert(gl.getShaderInfoLog(shader));
	return null;
    }

    return shader;
}

// keyboard events
function handleKeyDown(event)
{
    gCurrentlyPressedKeys[event.keyCode] = true;
    
    for (var i = 0; i < gMeshList.length; i++)
    {
	gMeshList[i].handleKeyDown(event);
    }
}

function handleKeyUp(event)
{
    gCurrentlyPressedKeys[event.keyCode] = false;
}

// mouse events
function handleMouseDown(event)
{
    gMouseDown = true;
    gLastMouseX = event.clientX;
    gLastMouseY = event.clientY;
}

function handleMouseUp(event)
{
    gMouseDown = false;
}

function handleMouseMove(event)
{
    if (!gMouseDown)
    {
	return;
    }

    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - gLastMouseX;
    var deltaY = newY - gLastMouseY;

    var newRotationMatrix = mat4.create();

    mat4.identity(newRotationMatrix);
    mat4.rotate(newRotationMatrix, degToRad(deltaX / 5), [ 0, 1, 0 ]);
    mat4.rotate(newRotationMatrix, degToRad(deltaY / 5), [ 1, 0, 0 ]);
    mat4.multiply(newRotationMatrix, gDragRotationMatrix, gDragRotationMatrix);

    gLastMouseX = newX;
    gLastMouseY = newY;
}

// animation function
function tick()
{
    // request a new frame (specified in webgl-utils.js)
    requestAnimFrame(tick);

    // check keyboard keys
    handleKeys();

    // draw scene
    drawScene(true, false);
    
    // animation function
    animate();
}

// check keyboard keys
function handleKeys()
{
    if (gCurrentlyPressedKeys[33])
    {
	// Page Up
	gZZoom -= 0.05;
    }

    if (gCurrentlyPressedKeys[34])
    {
	// Page Down
	gZZoom += 0.05;
    }
    
    for (var i = 0; i < gMeshList.length; i++)
    {
	gMeshList[i].handleKeys(gCurrentlyPressedKeys);
    }
}

// draw the scene
function drawScene(lighting, blending)
{
    // blending and depth test options
    if (blending)
    {
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
	gl.enable(gl.BLEND);
	gl.disable(gl.DEPTH_TEST);
	gl.uniform1f(gShaderProgram.alphaUniform, 0.5);
    }
    else
    {
	gl.disable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LESS);
	gl.uniform1f(gShaderProgram.alphaUniform, 1);
    }
    
    if (lighting)
    {
	// choose the ambient color
	gl.uniform3f(gShaderProgram.ambientColorUniform, 1, 1, 1);

	// choose the lighting direction
	var lightingDirection = [ -1, -1, 0 ];
	var adjustedLD = vec3.create();
	vec3.normalize(lightingDirection, adjustedLD);
	vec3.scale(adjustedLD, -1);
	gl.uniform3fv(gShaderProgram.lightingDirectionUniform, adjustedLD);

	// choose the directional color
	gl.uniform3f(gShaderProgram.directionalColorUniform, 1, 0, 0);
    }
    
    // viewport
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    // clear the buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // projection mode
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, gPMatrix);
    
    // reset the model view matrix
    mat4.identity(gMvMatrix);
    
    // go to the center of the scene
    mat4.translate(gMvMatrix, [ 0.0, 0, -5.0 ]);
    
    // zoom
    mat4.translate(gMvMatrix, [ 0, 0, gZZoom ]);
    
    // drag and drop effect
    mat4.multiply(gMvMatrix, gDragRotationMatrix);
    
    // link the lighting variable with the shader program
    gl.uniform1i(gShaderProgram.useLightingUniform, lighting);
    
    // draw mesh list
    for (var i = 0; i < gMeshList.length; i++)
    {
	// record the matrix
	mvPushMatrix();
	
	// draw
	gMeshList[i].draw(gShaderProgram, gPMatrix, gMvMatrix);
	
	// load the last recorded matrix
	mvPopMatrix();
    }
}

// animation function
function animate()
{
    // recuperate the current time
    var timeNow = new Date().getTime();

    if (gLastTime != 0)
    {
	// calculate the elapsed time
	var elapsed = timeNow - gLastTime;
	
	// draw mesh list
	for (var i = 0; i < gMeshList.length; i++)
	{
	    gMeshList[i].animate(elapsed);
	}
    }

    // set the last time
    gLastTime = timeNow;
}

// record the model view matrix
function mvPushMatrix()
{
    var copy = mat4.create();
    mat4.set(gMvMatrix, copy);
    gMvMatrixStack.push(copy);
}

// load the last recorded model view matrix
function mvPopMatrix()
{
    if (gMvMatrixStack.length == 0)
    {
	throw "Invalid popMatrix!";
    }
    gMvMatrix = gMvMatrixStack.pop();
}