Web Projects
============

arduino-portal:
---------------
JQuery and PHP are used to communicate with an Arduino through serial port.

Several buttons are present on web site:
* green ones: order Arduino to play a sound with buzzer (keyboard: wxcvbn,;)
* blue ones: order Arduino to switch on/switch off/toggle led (keyboard: 12~)
* red one: order Arduino to get temperature (keyboard t)

For now, the Arduino code is not added but could be in a next Git repo.

webgl-creator:
------
JQuery, Javascript and WebGL are used to draw a 3D scene.

The scene is firstly empty, you can add objects in the scene with the following parameters:
* size
* type: cube or sphere

When you added your mesh, you can set its position and rotating speed dynamically.
You can enter a new value or type on the plus and minus buttons.
If you want to delete your mesh, press delete button.

The arrow keys allow to make the meshes rotate, the f keyboard key allows to switch between several texture renderings.
The scene can be zoomed down or up (Page Up/Page Down) and dragged and dropped with the mouse.

classes:
* Buffer: load buffer and textures used for meshes
* Mesh: object from the scene which has own position and rotating speed

shaders:
* vertex.shdr: used for vertex positions and lighting
* fragment.shdr: used for colors and blending

labyrinth:
------
coded in JQuery, Javascript and WebGL

walk within a 3D labyrinth with arrow keys to move around
