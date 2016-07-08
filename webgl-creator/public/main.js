// WebGL variable
var gl;

// shader program
var gShaderProgram;

// projection matrix
var gPMatrix = mat4.create();

// model view matrix
var gMvMatrix = mat4.create();

// mesh list
var gMeshList = new Array();

// event listener
var gEventListener;

// animation
var gLastTime = 0;

// buffer dictionary
var gBufferSrcDic = {};
gBufferSrcDic["cube"] = "pictures/crate.gif";
gBufferSrcDic["plan"] = "pictures/wall.jpg";
gBufferSrcDic["sphere"] = "pictures/moon.gif";

// **start the WebGL program**
function webGLStart(canvas)
{
    console.log("webGLStart");
    
    // init gl and shader program
    gl = initGL(canvas);
    gShaderProgram = initShaderProgram(gl);
    
    // init event listener
    gEventListener = new EventListener(-20, gMeshList);
    
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

function addMesh(size, type)
{
    console.log("addMesh "+size+" "+type);
    
    var mesh = new Mesh(gl, new Buffer(gl, type, size, gBufferSrcDic[type]));
    gMeshList.push(mesh);
    
    return mesh;
}

function deleteMesh(id)
{
    console.log("deleteMesh "+id);
    
    var mesh = getMeshForId(id);
    
    if(mesh != null)
    {
	var mesh_index = gMeshList.indexOf(mesh);
	gMeshList.splice(mesh_index, 1);
    }
    
    return mesh;
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
    
    // go to the center of the scene
    mat4.translate(gMvMatrix, [ 0.0, 0, -5.0 ]);
    
    // zoom
    mat4.translate(gMvMatrix, [ 0, 0, gEventListener.getZZoom() ]);
    
    // drag and drop effect
    mat4.multiply(gMvMatrix, gEventListener.getDragRotationMatrix());
    
    // link the lighting variable with the shader program
    gl.uniform1i(gShaderProgram.useLightingUniform, lighting);
    
    // draw mesh list
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
	
	// draw mesh list
	for (var i = 0; i < gMeshList.length; i++)
	{
	    gMeshList[i].animate(elapsed);
	}
    }

    // set the last time
    gLastTime = timeNow;
}