(function (App) {
  'use strict';

  class ReservaModel {
    constructor(storage, totalVagas) {
      this.storage = storage;
      this.totalVagas = Number(totalVagas);
      this.reservas = [];
      this.carregar();
    }

    carregar() {
      var dados = this.storage.carregar();

      if (Array.isArray(dados)) {
        this.reservas = dados.map(function (item) {
          return App.Reserva.fromJSON(item);
        });
        return;
      }

      this.reservas = (App.seedReservas || []).map(function (item, indice) {
        return App.Reserva.fromJSON(
          Object.assign({}, item, { id: 'seed-' + (indice + 1) })
        );
      });
      this.persistir();
    }

    listar() {
      return this.reservas.slice();
    }

    buscarPorId(id) {
      return this.reservas.find(function (reserva) {
        return reserva.id === id;
      });
    }

    salvar(reserva) {
      if (!(reserva instanceof App.Reserva)) {
        throw new Error('Não foi possível salvar: dados da reserva inválidos.');
      }

      if (this.vagaOcupada(reserva.vaga)) {
        throw new Error(
          'A vaga ' + App.Formatadores.vaga(reserva.vaga) +
          ' já está ocupada. Escolha outra vaga disponível.'
        );
      }

      if (this.placaCadastrada(reserva.placa)) {
        throw new Error(
          'Já existe uma reserva cadastrada para a placa ' + reserva.placa + '.'
        );
      }

      this.reservas.push(reserva);
      this.persistir();
      return reserva;
    }

    remover(id) {
      var indice = this.reservas.findIndex(function (reserva) {
        return reserva.id === id;
      });

      if (indice === -1) {
        throw new Error('Reserva não encontrada. Atualize a página e tente novamente.');
      }

      var removida = this.reservas.splice(indice, 1)[0];
      this.persistir();
      return removida;
    }

    vagasOcupadas() {
      return this.reservas
        .map(function (reserva) {
          return Number(reserva.vaga);
        })
        .sort(function (a, b) {
          return a - b;
        });
    }

    vagasDisponiveis() {
      var ocupadas = new Set(this.vagasOcupadas());
      var disponiveis = [];

      for (var numero = 1; numero <= this.totalVagas; numero += 1) {
        if (!ocupadas.has(numero)) {
          disponiveis.push(numero);
        }
      }

      return disponiveis;
    }

    totalOcupadas() {
      return this.reservas.length;
    }

    totalDisponiveis() {
      return Math.max(this.totalVagas - this.totalOcupadas(), 0);
    }

    percentualDisponivel() {
      if (!this.totalVagas) {
        return 0;
      }
      return Math.round((this.totalDisponiveis() / this.totalVagas) * 100);
    }

    vagaOcupada(numero) {
      var vaga = Number(numero);
      return this.vagasOcupadas().indexOf(vaga) !== -1;
    }

    placaCadastrada(placa) {
      var normalizada = String(placa || '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');

      return this.reservas.some(function (reserva) {
        return reserva.placa.replace(/[^A-Z0-9]/g, '') === normalizada;
      });
    }

    persistir() {
      this.storage.salvar(
        this.reservas.map(function (reserva) {
          return reserva.toJSON();
        })
      );
    }
  }

  App.ReservaModel = ReservaModel;
})(window.ParkingApp = window.ParkingApp || {});
