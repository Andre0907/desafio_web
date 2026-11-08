(function (App) {
  'use strict';

  class Reserva {
    constructor(dados) {
      dados = dados || {};

      this.id = dados.id || Reserva.gerarId();
      this.placa = String(dados.placa || '').trim().toUpperCase();
      this.proprietario = String(dados.proprietario || '').trim();
      this.apartamento = String(dados.apartamento || '').trim();
      this.bloco = String(dados.bloco || '').trim().toUpperCase();
      this.modelo = String(dados.modelo || '').trim();
      this.cor = String(dados.cor || '').trim();
      this.vaga = Number(dados.vaga);
    }

    static gerarId() {
      if (window.crypto && typeof window.crypto.randomUUID === 'function') {
        return window.crypto.randomUUID();
      }

      return 'reserva-' + Date.now() + '-' + Math.random().toString(16).slice(2);
    }

    static fromJSON(dados) {
      return new Reserva(dados);
    }

    toJSON() {
      return {
        id: this.id,
        placa: this.placa,
        proprietario: this.proprietario,
        apartamento: this.apartamento,
        bloco: this.bloco,
        modelo: this.modelo,
        cor: this.cor,
        vaga: this.vaga,
      };
    }
  }

  App.Reserva = Reserva;
})(window.ParkingApp = window.ParkingApp || {});
