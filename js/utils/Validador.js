(function (App) {
  'use strict';

  var PLACA_ANTIGA = /^[A-Z]{3}-?[0-9]{4}$/;
  var PLACA_MERCOSUL = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

  App.Validador = {
    validarPlaca: function (placa) {
      var normalizada = String(placa || '').toUpperCase().replace(/\s/g, '');
      return PLACA_ANTIGA.test(normalizada) || PLACA_MERCOSUL.test(normalizada);
    },

    normalizarTextoBusca: function (valor) {
      return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    },
  };
})(window.ParkingApp = window.ParkingApp || {});
