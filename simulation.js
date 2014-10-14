var d3 = require('d3');

function Simulation(opts) {
  var self = this;
  if (!(self instanceof Simulation)) {
    return new Simulation(opts);
  }

  var selection = opts.selection || "#simulation";

  self.domainMin = opts.domainMin || -5;
  self.domainMax = opts.domainMin || 5;

  Simulation.prototype.renderFrame = opts.renderFrame;

  self.container = d3.select(selection);

  self.stopped = false;
  self.d3canvas = d3.select(selection + " canvas")
    .on('click', function () {
      self.stopped = !self.stopped;
      if (!self.stopped)
          self.run();
    });
}

exports.Simulation = Simulation;

Simulation.prototype.run = function() {
  var self = this;
  d3.timer(function doOneFrame() {
    self.updateWindow();
    var context = self.d3canvas.node().getContext("2d");
    context.clearRect(0, 0, self.width, self.height);
    self.renderFrame(context, self.x, self.y);
    return self.stopped;
  });
};

Simulation.prototype.updateWindow = function() {
  var self = this;

  self.width = self.container[0][0].clientWidth;
  self.height = self.container[0][0].clientHeight;

  // We'll scale such that height is always the full range [domainMin..domainMax]
  // Width will be same resolution.
  var pixelsPerUnit = self.height / (self.domainMax - self.domainMin);

  self.d3canvas
    .attr("width", self.width)
    .attr("height", self.height);

  self.x = d3.scale.linear()
    .domain([0, 1])
    .range([self.width/2, pixelsPerUnit + self.width/2]);

  self.y = d3.scale.linear()
    .domain([self.domainMin, self.domainMax])
    .range([self.height, 0]);
};


