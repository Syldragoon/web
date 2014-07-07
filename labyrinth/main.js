// WebGL variable
var gl;

// shader program
var gShaderProgram;

// projection matrix
var gPMatrix = mat4.create();

// model view matrix
var gMvMatrix = mat4.create();

// camera
var gCamera;

// mesh list
var gMeshList = new Array();

// event listener
var gEventListener;

// animation
var gLastTime = 0;

// wall matrices
var gFrontWallMatrix = [
    [1,1,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1],
];
var gSideWallMatrix = [
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1],
];

// **start the WebGL program**
function webGLStart(canvas)
{
    console.log("webGLStart");
    
    // init gl and shader program
    gl = initGL(canvas);
    gShaderProgram = initShaderProgram(gl);
    
    groundSize = gSideWallMatrix.length;
    
    // buffers
    groundBuffer = new Buffer(gl, "plan", groundSize, "pictures/ground.jpg");
    wallBuffer = new Buffer(gl, "plan", 1, "pictures/wall.jpg");
    
    // **camera**
    gCamera = new Camera(-groundSize/2 + 0.5, -groundSize/2 + 0.5, 0.5, 90, 0);
    
    // **meshes**
    // ground
    ground = new Mesh(gl, groundBuffer);
    gMeshList.push(ground);
    
    // front walls
    for(i = 0; i < gFrontWallMatrix.length; i++)
    {
	for(j = 0; j < gFrontWallMatrix[i].length; j++)
	{
	    if(gFrontWallMatrix[i][j])
	    {
    	        wall = new Mesh(gl, wallBuffer);
    	        wall.generateFrontWall(groundSize, i, j);
    	        gMeshList.push(wall);
	    }
	}
    }
    
    // side walls
    for(i = 0; i < gSideWallMatrix.length; i++)
    {
	for(j = 0; j < gSideWallMatrix[i].length; j++)
	{
	    if(gSideWallMatrix[i][j])
	    {
	        wall = new Mesh(gl, wallBuffer);
	        wall.generateSideWall(groundSize, i, j);
	        gMeshList.push(wall);
	    }
	}
    }
    
    console.log("labyrinth ready to be drawn: "+(gMeshList.length - 1)+" walls for ground size: "+groundSize);
    
    // init event listener
    gEventListener = new EventListener(gCamera, gMeshList);
    
    // clear the background
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    
    // keyboard
    $(document).keydown(gEventListener.handleKeyDown);
    $(document).keyup(gEventListener.handleKeyUp);
    
    // mouse
    $(canvas).mousedown(gEventListener.handleMouseDown);
    $(document).mouseup(gEventListener.handleMouseUp);
    $(document).mousemove(gEventListener.handleMouseMove);
    
    // loop
    tick();
}

function getMeshForId(id)
{
    var mesh = null;
    
    for (var i = 0; i < gMeshList.length; i++)
    {
	if(gMeshList[i].id == id)
	{
	    mesh = gMeshList[i];
	    break;
	}
    }
    
    return mesh;
}

// **loop**
function tick()
{
    // request a new frame (specified in webgl-utils.js)
    requestAnimFrame(tick);

    // check keyboard keys
    gEventListener.handleKeys();

    // draw scene
    drawScene(true, false);
    
    // animation function
    animate();
}

// **draw the scene**
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
    
    // set camera
    gCamera.set(gMvMatrix);
    
    // link the lighting variable with the shader program
    gl.uniform1i(gShaderProgram.useLightingUniform, lighting);
    
    // draw meshes
    for (var i = 0; i < gMeshList.length; i++)
    {
        // draw
	gMeshList[i].draw(gShaderProgram, gPMatrix, gMvMatrix);
    }
}

// **animation function**
function animate()
{
    // recuperate the current time
    var timeNow = new Date().getTime();

    if (gLastTime != 0)
    {
	// calculate the elapsed time
	var elapsed = timeNow - gLastTime;
	
	// animate camera
	gCamera.animate(elapsed);
	
	// animate mesh list
	for (var i = 0; i < gMeshList.length; i++)
	{
	    gMeshList[i].animate(elapsed);
	}
    }

    // set the last time
    gLastTime = timeNow;
}