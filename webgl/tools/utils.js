//link the projection, model view and normal matrices with the shader program
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

//degree to radian conversion
function degToRad(degrees)
{
    return degrees * Math.PI / 180;
}