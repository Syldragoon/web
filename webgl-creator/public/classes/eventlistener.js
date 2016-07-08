// zoom
var gZZoom = 0;

// drag rotation matrix
var gDragRotationMatrix = mat4.create();
mat4.identity(gDragRotationMatrix);

// mesh list
var gmeshList;

// keyboard
var gCurrentlyPressedKeys = {}; // hash table

// mouse
var gMouseDown = false;
var gLastMouseX = null;
var gLastMouseY = null;

function EventListener(zZoom, meshList)
{
    console.log("new EventListener "+zZoom)
    
    gZZoom = zZoom;
    gmeshList = meshList;
}

// getters for global variables
EventListener.prototype.getZZoom = function()
{
    return gZZoom;
}

EventListener.prototype.getDragRotationMatrix = function()
{
    return gDragRotationMatrix;
}

// keyboard events
EventListener.prototype.handleKeyDown = function(event)
{
    gCurrentlyPressedKeys[event.keyCode] = true;
    
    for (var i = 0; i < gMeshList.length; i++)
    {
	gMeshList[i].handleKeyDown(event);
    }
}

EventListener.prototype.handleKeyUp = function(event)
{
    gCurrentlyPressedKeys[event.keyCode] = false;
}

// check keyboard keys
EventListener.prototype.handleKeys = function()
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

// mouse events
EventListener.prototype.handleMouseDown = function(event)
{
    gMouseDown = true;
    gLastMouseX = event.clientX;
    gLastMouseY = event.clientY;
}

EventListener.prototype.handleMouseUp = function(event)
{
    gMouseDown = false;
}

EventListener.prototype.handleMouseMove = function(event)
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