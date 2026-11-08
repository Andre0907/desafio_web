(function (App) {
  'use strict';

  class DisponiveisController {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.view.renderizar(this.model);
    }
  }

  App.DisponiveisController = DisponiveisController;
})(window.ParkingApp = window.ParkingApp || {});
