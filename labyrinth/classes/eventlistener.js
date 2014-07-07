// keyboard
var gCurrentlyPressedKeys = {}; // hash table

// mouse
var gMouseDown = false;
var gLastMouseX = null;
var gLastMouseY = null;

// drag rotation matrix
var gDragRotationMatrix = mat4.create();
mat4.identity(gDragRotationMatrix);

// camera
var gCamera;

// wall list
var gMeshList;

function EventListener(camera, meshList)
{
    console.log("new EventListener");
    
    gCamera = camera;
    gMeshList = meshList;
}

EventListener.prototype.getDragRotationMatrix = function()
{
    return gDragRotationMatrix;
}

// keyboard events
EventListener.prototype.handleKeyDown = function(event)
{
    gCurrentlyPressedKeys[event.keyCode] = true;
}

EventListener.prototype.handleKeyUp = function(event)
{
    gCurrentlyPressedKeys[event.keyCode] = false;
}

// check keyboard keys
EventListener.prototype.handleKeys = function()
{
    gCamera.handleKeys(gCurrentlyPressedKeys);
    
    for(var i = 0; i < gMeshList.length; i++)
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