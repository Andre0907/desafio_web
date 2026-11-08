(function (App) {
  'use strict';

  class ListaController {
    constructor(model, view) {
      this.model = model;
      this.view = view;
      this.termoBusca = '';

      this.view.aoBuscar(this.buscar.bind(this));
      this.view.aoRemover(this.remover.bind(this));

      this.renderizar();
    }

    buscar(termo) {
      this.termoBusca = termo;
      this.renderizar();
    }

    renderizar() {
      var todas = this.model.listar().sort(function (a, b) {
        return Number(a.vaga) - Number(b.vaga);
      });

      var filtradas = this.filtrar(todas, this.termoBusca);

      this.view.renderizar(filtradas);
      this.view.atualizarResumo(this.model);
    }

    filtrar(reservas, termo) {
      var busca = App.Validador.normalizarTextoBusca(termo);

      if (!busca) {
        return reservas;
      }

      return reservas.filter(function (reserva) {
        var alvo = [
          reserva.vaga,
          App.Formatadores.vaga(reserva.vaga),
          reserva.placa,
          reserva.proprietario,
          reserva.apartamento,
          reserva.bloco,
          reserva.modelo,
          reserva.cor,
        ].join(' ');

        return App.Validador.normalizarTextoBusca(alvo).indexOf(busca) !== -1;
      });
    }

    remover(id) {
      var self = this;
      var reserva = this.model.buscarPorId(id);

      if (!reserva) {
        this.view.mostrarErro(
          'A reserva selecionada não foi encontrada. Atualize a página e tente novamente.'
        );
        return;
      }

      this.view.confirmarRemocao(reserva, function () {
        try {
          var removida = self.model.remover(id);

          console.log('Reserva removida com sucesso:', removida.toJSON());

          self.renderizar();
          self.view.mostrarAviso(
            'Reserva da vaga ' + App.Formatadores.vaga(removida.vaga) +
            ' removida com sucesso.'
          );
        } catch (erro) {
          console.error('Erro ao remover reserva:', erro);
          self.view.mostrarErro(erro.message);
        }
      });
    }
  }

  App.ListaController = ListaController;
})(window.ParkingApp = window.ParkingApp || {});
