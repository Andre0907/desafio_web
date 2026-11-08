(function (App) {
  'use strict';

  class CadastroController {
    constructor(model, view) {
      this.model = model;
      this.view = view;

      this.view.aoEnviar(this.salvar.bind(this));
      this.view.preencherVagas(this.model.vagasDisponiveis());
      this.view.atualizarResumo(this.model);
    }

    salvar(dados) {
      try {
        if (!App.Validador.validarPlaca(dados.placa)) {
          throw new Error(
            'Informe uma placa válida no formato ABC1D23 (Mercosul) ou ABC-1234.'
          );
        }

        if (!dados.vaga) {
          throw new Error('Selecione o número da vaga que será reservada.');
        }

        var reserva = new App.Reserva(dados);
        var salva = this.model.salvar(reserva);

        console.log('Reserva cadastrada com sucesso:', salva.toJSON());

        this.view.limparFormulario();
        this.view.preencherVagas(this.model.vagasDisponiveis());
        this.view.atualizarResumo(this.model);
        this.view.mostrarSucesso(salva);
      } catch (erro) {
        console.error('Erro ao cadastrar reserva:', erro);
        this.view.mostrarErro(erro.message);
      }
    }
  }

  App.CadastroController = CadastroController;
})(window.ParkingApp = window.ParkingApp || {});
