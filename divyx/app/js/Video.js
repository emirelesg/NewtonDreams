var video = {
  loaded: false,
  is_playing: false,
  current_frame: 1,
  total_frames: 0,
  fps: 0,
  inv_fps: 0,
  w: 0,
  h: 0,
  video_w: 0,
  video_h: 0,
  video_kw: 1,
  video_kh: 1,
  video_x0: 0,
  video_y0: 0,
  total_time: 0,
  current_time: 0,
  muted: true,
  _changed_fps: false,
  _canvas_id: undefined,
  _video_id: undefined,
  _canvas: undefined,
  _ctx: undefined,
  _video: undefined,
  _draw_frame_callback: undefined,
  _ready_callback: undefined,
  _fps_list: [60, 59.94, 50, 30, 29.97, 25, 24, 23.98],
  _fps_index: 0,
  _ref_img: undefined,
  _ref_img_time: 0,
  _fps_frame_found: false,
  _fps_skipped: false,
  _animation_id: undefined,
  _background_color: "#e5e5e5",
  _canplay: false,
  _fps_count: 0,
  _fps_calculated: false,

};

/*

  ############ PUBLIC METHODS ############

*/

video.init = function(canvas_id, video_id) {
  /*
    Initialize the canvas and the video objects.
  */

  // Canvas init
  this._canvas = document.getElementById(canvas_id);
  this._ctx = this._canvas.getContext('2d');

  // Video init
  var self = this;
  this._video = document.getElementById(video_id);
  this._video.load();
  this._video.addEventListener('loadedmetadata', function() { self._loadedmetadata(); }, false);
  this._video.addEventListener('timeupdate', function() { self._timeupdate(); }, false);

}

video.toggleMute = function() {
  /*
    Toggle mute.
  */

  if (this.muted) {
    $(this._video).prop('muted', false);
  } else {
    $(this._video).prop('muted', true);
  }
  this.muted = !this.muted;

}

video.promptFPS = function() {
  /*
    Ask the user for the video's fps.
  */

  // Stop the video if it is playing
  if (this.is_playing) this.pause();

  // Ask the user for a valid frame rate
  var fps = prompt("Please enter the video's frame rate (fps)", this.fps) || this.fps;
  while (!$.isNumeric(fps) || fps <= 0) {
    fps = prompt("Please enter a valid frame rate (fps)", this.fps) || video.fps;
  }

  // If the fps changed then recalculate everything
  if (fps != this.fps) {
    this._changed_fps = true;
    this.fps = fps;
    this.inv_fps = 1/fps;
    this.total_frames = Math.round(this._video.duration/this.inv_fps);
    this._video.currentTime = 0;
  }

}

video.setSpeed = function(speed) {
  /*
    Set the playback speed of the video.
  */

  this._video.playbackRate = speed;

}

video.play = function() {
  /*
    Start playing the video only if its not playing.
  */

  if (!this.is_playing) {
    this._video.play();
    this.is_playing = true;
    this._loop();
  }

}

video.pause = function() {
  /*
    Pause the video only if its playing.
  */

  if (this.is_playing) {
    this._video.pause();
    this.is_playing = false;
    this.goToNearestFrame();
  }

}

video.nextFrame = function() {
  /*
    Skip to the next frame.
  */

  this.pause();
  this.goToFrame(this.current_frame+1);

}

video.prevFrame = function() {
  /*
    Go to the previous frame.
  */

  this.pause();
  this.goToFrame(this.current_frame-1);

}

video.goToNearestFrame = function(time) {
  /*
    Skip to the nearest frame by rounding the time.
  */

  if (time != undefined) {
    this._video.currentTime = Math.round(time/this.inv_fps)*this.inv_fps;
  } else {
    this._video.currentTime = Math.round(this._video.currentTime/this.inv_fps)*this.inv_fps;
  }

}

video.goToFrame = function(frame) {
  /*
    Skip to a certain frame. Check that it is within range.
  */

  if (frame > this.total_frames) frame = this.total_frames;
  if (frame < 0) frame = 0;
  if (frame != this.current_frame) this._video.currentTime = frame*this.inv_fps;

}

video.setSize = function(w, h, px_ratio) {
  /*
    Change the size of the canvas player.
  */

  // Update size
  this.w = w;
  this.h = h;
  this._canvas.width = Math.floor(this.w*px_ratio);
  this._canvas.height = Math.floor(this.h*px_ratio);
  if (px_ratio > 1) {
    this._canvas.style.width = w + "px";
    this._canvas.style.height = h + "px";
    this._ctx.scale(px_ratio, px_ratio);
  }

  // Video background color
  this._ctx.fillStyle = this._background_color;
  this._ctx.fillRect(0, 0, w, h);

  // Fit video to container
  this._scaleVideo();

  // Redraw screen
  if (this.loaded && !this.is_playing) this._drawFrame();

}

video.ready = function(callback) {
  /*
    Set the callback for when the video is loaded.
  */

  this._ready_callback = callback;

}

video.onDrawFrame = function(callback) {
  /*
    Set the canplay callback.
  */

  this._draw_frame_callback = callback;

}

video.reload = function(source) {
  /*
    Reload video. Reset everything so the fps will be calculated for the new
    video.
  */

  // Reset variables
  this._fps_calculated = false;
  this._changed_fps = false;
  this._fps_index = 0;
  this._ref_img = undefined;
  this._ref_img_time = 0;
  this._fps_frame_found = false;
  this._fps_skipped = false;
  this._canplay = false;
  this._fps_count = 0;
  this.fps = 0;
  this.inv_fps = 0;
  this.current_frame = 1;
  this.total_frames = 0;
  this.loaded = false;
  this.video_w = 0;
  this.video_h = 0;
  this.video_kw = 1;
  this.video_kh = 1;
  this.video_x0 = 0;
  this.video_y0 = 0;
  this.muted = true;

  // Clear the canvas
  this._ctx.clearRect(0, 0, this.w, this.h);

  // Mute the video
  $(this._video).prop('muted', true);

  // Change the video source
  if (source) {
    this._video.src = source;
    this._video.load();
  } else {
    this._drawFrame();
  }

}

/*

  ############ PRIVATE METHODS ############

*/

video._scaleVideo = function() {
  /*
    Fit the video to the container.
  */

  var mode = 0;

  if (this.video_w > this.w && this.video_h > this.h) {
  // The video is bigger in width and height

    if (this.video_h >= this.video_w) {
      mode = 1;
    } else {
      // Landscape mode
      mode = 2;
    }
    
  } else if (this.video_w > this.w && this.video_h <= this.h) {
  // The video is bigger in width  

    mode = 2;

  } else if (this.video_w <= this.w && this.video_h > this.h) {
  // The video is bigger in height  

    mode = 1;

  } else {
    // The video fits perfectly
    
    mode = 0;

  }

  // Change the scale of the video according to the mode
  switch (mode) {

    default: case 0:
      // No scaling done, video fits perfectly
      this.video_x0 = Math.floor(this.w - this.video_w)/2;
      this.video_y0 = Math.floor(this.h - this.video_h)/2;
      this.video_kh = 1;
      this.video_kw = 1; 
      break;

    case 1:
      // Scale height
      this.video_kh = this.h/this.video_h;
      this.video_kw = this.video_kh;
      this.video_x0 = Math.floor(this.w - this.video_w*this.video_kw)/2;
      this.video_y0 = 0;
      break;

    case 2:
      // Scale width
      this.video_kw = this.w/this.video_w;
      this.video_kh = this.video_kw;
      this.video_x0 = 0;
      this.video_y0 = Math.floor(this.h - this.video_h*this.video_kh)/2; 
      break;

  }

}

video._call = function(c) {
  /*
    Makes sure the callback is a function and then calls it.
  */

  if (typeof(c) === "function") c();

}

video._loop = function() {
  /*
    Draw frames while the video is playing
  */

  this._drawFrame();

  // Check that the video has not ended
  if (this.current_frame < this.total_frames && this.is_playing) {
    var self = this;
    this._animation_id = window.requestAnimationFrame(function() {
      self._loop();
    });
  } else {
    window.cancelAnimationFrame(this._animation_id);
    this.is_playing = false;
    if (this.current_frame > this.total_frames) this.current_frame = this.total_frames;
    this._call(this._draw_frame_callback);
  }

}

video._drawFrame = function() {
  /*
    Callback for the canplay event. Draw a frame in the canvas.
    If it is the first time being loaded, then calculate the fps
  */

  // Draw image to the canvas
  this._ctx.drawImage(this._video, this.video_x0, this.video_y0, this.video_w*this.video_kw, this.video_h*this.video_kh);

  if (this.loaded) {

    // Calculate the current frame and time
    this.current_time = this._video.currentTime;
    this.current_frame = Math.round(this._video.currentTime/this.inv_fps);

    // Callback for canplay event
    this._call(this._draw_frame_callback);

  }

}


video._loadedmetadata = function() {
  /*
    Function called when the video is first loaded. 
  */

  // Fit the video to the screen
  this.video_w = this._video.videoWidth;
  this.video_h = this._video.videoHeight;
  this._scaleVideo();

  // Just to remove the loading part
  // this._call(this._ready_callback);

  // Go to a random part of the video
  this._canplay = true;
  this._video.currentTime = Math.random()*this._video.duration*0.5;

}

video._timeupdate = function() {
  /*
    Function called everytime the current time of the video is changed.
  */

  // If a video has just loaded.
  if (this._canplay) {

    // If it is the first time the video is loaded and no fps are calculated,
    // calculate them.
    if (this.fps == 0) {
      
      this._fpsCalculation();

      // If fps were calculated
      if (this.fps > 0) {
      
        // Get the inverse of the fps and call the callback
        this.inv_fps = 1/this.fps;
        this.total_time = this._video.duration;
        this.total_frames = Math.round(this._video.duration/this.inv_fps);
        this.loaded = true;
        this._video.currentTime = 0;
        this._call(this._ready_callback);
        this._call(this._draw_frame_callback);
      
      }

    // If at any other moment the time is changed draw the new frame.
    } else if (!this.is_playing) {

      this._drawFrame();

    }
    
  }

}

video._fpsCalculation = function() {
  /*
    Function to calculate the fps.
  */

  // Draw the video full screen
  this._ctx.drawImage(this._video, 0, 0, this.w, this.h);

  // If no reference image has been taken grab one
  if (!this._ref_img) {

    this._ref_img = this._ctx.getImageData(0, 0, this.w, this.h);
    this._ref_img_time = this._video.currentTime;

  } else {

    // Take an img of the current time
    var img = this._ctx.getImageData(0, 0, this.w, this.h);
    var time = this._video.currentTime;

    // Iterate through every channel in the image
    for (var i = 0; i < this._ref_img.data.length; i += 4) {

      // If a change occurs of the image with respect to the reference image
      // a frame has been detected
      if (Math.abs(this._ref_img.data[i] - img.data[i]) > 0) {

        // If no frame has been found
        if (!this._fps_frame_found) {

          // Increase the count of frames found
          this._fps_count++;

          // Save the current image as the new reference image
          this._ref_img = img;
          this._ref_img_time = time;

          // Wait until nore than two samples are found
          if (this._fps_count > 2) this._fps_frame_found = true;

        } else {

          // The fps have been calculated
          this.fps = this._fps_list[this._fps_index];

        }

        break;

      }

    }

  }

  // If no frame has been found
  if (!this._fps_frame_found) {

    // Skip a small amount to detect a change in the framerate
    this._video.currentTime += 0.002;
  
  } else {

    // Skip a known frame rate to determine on which frame it changes
    this._video.currentTime = this._ref_img_time + 1/this._fps_list[this._fps_index];
    this._fps_index++;

    // If no frame rate has been found ask the user for the frame rate.
    if (this._fps_index >= this._fps_list.length) this.promptFPS();

  }

}