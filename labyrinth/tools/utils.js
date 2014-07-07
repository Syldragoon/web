// model view matrix stack used for recording (push) and loading (pop)
var gMvMatrixStack = new Array();

// load file with XMLHttpRequest
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

// link the projection, model view and normal matrices with the shader program
function setMatrixUniforms(gl, shaderProgram, pMatrix, mvMatrix)
{
    // projection matrix
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);

    // model view matrix
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    // normal matrix
    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

// record the model view matrix
function mvPushMatrix(mvMatrix)
{
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    gMvMatrixStack.push(copy);
}

// load the last recorded model view matrix
function mvPopMatrix(mvMatrix)
{
    if (gMvMatrixStack.length == 0)
    {
	throw "Invalid popMatrix!";
    }
    mat4.set(gMvMatrixStack.pop(), mvMatrix);
}

// degree to radian conversion
function degToRad(degrees)
{
    return degrees * Math.PI / 180;
}