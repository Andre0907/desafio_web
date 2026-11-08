(function (App) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var storage = new App.StorageService(App.config.storageKey);
    var model = new App.ReservaModel(storage, App.config.totalVagas);
    var view = new App.DisponiveisView();

    new App.DisponiveisController(model, view);
  });
})(window.ParkingApp = window.ParkingApp || {});
