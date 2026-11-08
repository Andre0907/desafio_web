(function (App) {
  'use strict';

  App.Formatadores = {
    normalizarPlaca: function (valor) {
      return String(valor || '')
        .toUpperCase()
        .replace(/[^A-Z0-9-]/g, '')
        .slice(0, 8);
    },

    vaga: function (numero) {
      return String(numero).padStart(2, '0');
    },

    texto: function (valor) {
      return String(valor || '').trim();
    },
  };
})(window.ParkingApp = window.ParkingApp || {});
