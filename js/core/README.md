# p$.js

p$.js is the physics and drawing engine for the simulations running at NewtonDreams.com.
It allows the user to focus on the mathematical aspect of the simulation while the library handles the drawing of objects. This means the user can program equations that use real units such as meters or seconds, and the library will handle the scaling to pixels.

The library provides different methods for handling shapes, images, particles, vectors, graphs, buttons, sliders, result labels, and many other functions. Furthermore, this library uses some optimizations techniques behind the scenes in order to optimize the use of resources on the target device (see `Renderer.js`).

Since the website NewtonDreams.com is a responsive website, it was important for the library to be also responsive. The library handles the resizing of the canvas and allow the user to create responsive simulations that will work seamlessly between the browser on a computer and a mobile phone.

The library runs on a  `<canvas>` HTML object. Therefore, a latest browser is needed for developing simulations using this library.  It’s important to note that the whole library is wrapped around the namespace `p$`. This means that whenever an object, function or constant wants to be called `p$.` must be prepended to the object’s name.

The base object for all simulations is a `World` object (see `world.js`). Essentially, the world is the canvas, and all objects are handled by the world. Objects can be later added to the world, and such objects will be displayed depending on the properties set by the user. 

The library provides basic functions used by all objects (see `utils.js`) and constants (see `constants.js`). All shapes added to the canvas are children from the parent class `WorldElement`. It is important to understand how this object works, since all objects are based on this object.

One of the main upgrades made to the library was the addition of the `Box` object. This object allows the user to display results and graphs on top of the simulation. It is a window-like object that can be moved around by the user.

## Start Developing

To start developing simulations with p$.js download the following template. The zip file contains a single HTML file and a JavaScript file. The file can be opened locally without the need of having a local server. Nonetheless it is required to have an internet connection since the required files for the simulations are downloaded from the NewtonDreams.com server.

Furthermore, these files are a stripped down version of the real template files. The files provided in the zip do not have the PHP code required for displaying the navigation, date, and titles from the file database.

<a href="template.zip">Download Template</a>

## Author(s)

Enrique Mireles Gutierrez - enrique.mireles@udem.edu
