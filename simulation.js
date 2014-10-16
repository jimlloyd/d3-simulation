var d3 = require('d3');

function Simulation(opts) {
  var self = this;
  if (!(self instanceof Simulation)) {
    return new Simulation(opts);
  }

  self.domainMin = opts.domainMin || -5;
  self.domainMax = opts.domainMin || 5;
  Simulation.prototype.renderFrame = opts.renderFrame;

  var viewSelector = opts.selection || "#simulation";
  self.viewContainer = d3.select(viewSelector).node();

  self.stopped = false;
  self.d3canvas = d3.select(viewSelector + " canvas")
    .on('click', function () {
      self.stopped = !self.stopped;
      if (!self.stopped)
          self.run();
    });

  self.canvas = self.d3canvas.node();
  self.ctx = self.canvas.getContext("2d");
}

exports.Simulation = Simulation;

Simulation.prototype.clearCanvas = function() {
  var self = this;
  self.ctx.clearRect(0, 0, self.width, self.height);
}

Simulation.prototype.run = function() {
  var self = this;
  d3.timer(function doOneFrame(elapsed) {
    // this.t -> absolute time in millis when this timer was started
    // elapsed -> the number of milliseconds since this timer started.
    // this.t + elapsedTime -> now
    self.updateView();
    self.clearCanvas();
    self.renderFrame();
    return self.stopped;
  });
};

Simulation.prototype.updateView = function() {
  var self = this;

  // Get the dimensions of the DOM element containing our canvas, e.g. the div#simulation,
  // and ensure the canvas has the same dimensions. We do this every frame, since it
  // seems to have trivial cost and allows seamless resizing.
  var width = self.viewContainer.clientWidth;
  var height = self.viewContainer.clientHeight;

  if (width!==self.width || height!=self.height) {
    self.width = width;
    self.height = height;
    self.d3canvas
      .attr("width", width)
      .attr("height", height);

    // We'll scale such that height is always the full range [domainMin..domainMax]
    // Width will be same resolution.
    // TODO: provide option to fix width to full range instead of height.
    var pixelsPerUnit = height / (self.domainMax - self.domainMin);

    self.x = d3.scale.linear()
      .domain([0, 1])
      .range([width/2, pixelsPerUnit + width/2]);

    self.y = d3.scale.linear()
      .domain([self.domainMin, self.domainMax])
      .range([height, 0]);
  }
};


