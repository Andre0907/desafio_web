(function (App) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var storage = new App.StorageService(App.config.storageKey);
    var model = new App.ReservaModel(storage, App.config.totalVagas);
    var view = new App.CadastroView();

    new App.CadastroController(model, view);
  });
})(window.ParkingApp = window.ParkingApp || {});
