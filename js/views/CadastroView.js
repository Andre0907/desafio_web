(function (App) {
  'use strict';

  class CadastroView {
    constructor() {
      this.form = document.getElementById('form-reserva');
      this.campoPlaca = document.getElementById('placa');
      this.campoVaga = document.getElementById('vaga');
      this.botaoSalvar = document.getElementById('btn-salvar');
      this.erroEl = document.getElementById('form-erro');
      this.resumoEl = document.getElementById('resumo-vagas');
      this.livresEl = document.getElementById('livres-count');
      this.ocupadasEl = document.getElementById('ocupadas-count');
      this.totalEl = document.getElementById('total-count');
      this.progressoEl = document.getElementById('progress-bar');
      this.modal = new App.Modal(document.getElementById('modal'));
      this.aoEnviarCallback = null;

      this.vincularEventos();
    }

    vincularEventos() {
      var self = this;

      this.form.addEventListener('submit', function (evento) {
        evento.preventDefault();
        self.limparErro();

        if (typeof self.aoEnviarCallback === 'function') {
          self.aoEnviarCallback(self.lerDados());
        }
      });

      this.form.addEventListener('reset', function () {
        window.setTimeout(function () {
          self.limparErro();
        }, 0);
      });

      this.campoPlaca.addEventListener('input', function () {
        var posicao = self.campoPlaca.selectionStart;
        self.campoPlaca.value = App.Formatadores.normalizarPlaca(
          self.campoPlaca.value
        );
        self.campoPlaca.setSelectionRange(posicao, posicao);
      });
    }

    aoEnviar(callback) {
      this.aoEnviarCallback = callback;
    }

    lerDados() {
      return {
        placa: App.Formatadores.texto(this.campoPlaca.value),
        proprietario: App.Formatadores.texto(
          document.getElementById('proprietario').value
        ),
        apartamento: App.Formatadores.texto(
          document.getElementById('apartamento').value
        ),
        bloco: App.Formatadores.texto(
          document.getElementById('bloco').value
        ),
        modelo: App.Formatadores.texto(
          document.getElementById('modelo').value
        ),
        cor: App.Formatadores.texto(document.getElementById('cor').value),
        vaga: Number(this.campoVaga.value),
      };
    }

    preencherVagas(disponiveis) {
      this.campoVaga.innerHTML = '';

      if (!disponiveis.length) {
        this.campoVaga.appendChild(
          new Option('Nenhuma vaga disponível', '')
        );
        this.campoVaga.disabled = true;
        this.botaoSalvar.disabled = true;
        return;
      }

      this.campoVaga.disabled = false;
      this.botaoSalvar.disabled = false;

      var placeholder = new Option('Selecione uma vaga', '');
      placeholder.disabled = true;
      placeholder.selected = true;
      this.campoVaga.appendChild(placeholder);

      disponiveis.forEach(function (numero) {
        this.campoVaga.appendChild(
          new Option(
            'Vaga ' + App.Formatadores.vaga(numero) + ' — livre',
            String(numero)
          )
        );
      }, this);
    }

    atualizarResumo(model) {
      var disponiveis = model.totalDisponiveis();

      this.resumoEl.textContent =
        disponiveis + ' de ' + model.totalVagas + ' vagas disponíveis';
      this.livresEl.textContent = disponiveis;
      this.ocupadasEl.textContent = model.totalOcupadas();
      this.totalEl.textContent = model.totalVagas;
      this.progressoEl.style.width = model.percentualDisponivel() + '%';
    }

    limparFormulario() {
      this.form.reset();
      this.limparErro();
    }

    mostrarErro(mensagem) {
      this.erroEl.textContent = mensagem;
      this.erroEl.hidden = false;
      this.erroEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    limparErro() {
      this.erroEl.textContent = '';
      this.erroEl.hidden = true;
    }

    mostrarSucesso(reserva) {
      this.modal.abrir({
        tipo: 'sucesso',
        titulo: 'Reserva cadastrada com sucesso!',
        mensagem:
          'A vaga ' + App.Formatadores.vaga(reserva.vaga) +
          ' foi reservada para ' + reserva.proprietario +
          ' (placa ' + reserva.placa + '). Os dados foram registrados.',
        acoes: [{ rotulo: 'Entendi', variante: 'primario' }],
      });
    }
  }

  App.CadastroView = CadastroView;
})(window.ParkingApp = window.ParkingApp || {});
