(function (App) {
  'use strict';

  var ICONE_REMOVER =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>' +
    '<path d="M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12"/>' +
    '<path d="M10 11v5"/><path d="M14 11v5"/></svg>';

  class ListaView {
    constructor() {
      this.tabela = document.getElementById('tabela-vagas');
      this.corpo = document.getElementById('tabela-corpo');
      this.vazioEl = document.getElementById('tabela-vazia');
      this.contadorEl = document.getElementById('contador-resultados');
      this.campoBusca = document.getElementById('busca');
      this.statTotal = document.getElementById('stat-total');
      this.statOcupadas = document.getElementById('stat-ocupadas');
      this.statLivres = document.getElementById('stat-livres');
      this.modal = new App.Modal(document.getElementById('modal'));
      this.toastEl = document.getElementById('toast');
      this.toastMensagem = document.getElementById('toast-mensagem');
      this.temporizadorToast = null;

      this.aoBuscarCallback = null;
      this.aoRemoverCallback = null;

      this.vincularEventos();
    }

    vincularEventos() {
      var self = this;

      this.campoBusca.addEventListener('input', function () {
        if (typeof self.aoBuscarCallback === 'function') {
          self.aoBuscarCallback(self.campoBusca.value);
        }
      });

      this.corpo.addEventListener('click', function (evento) {
        var botao = evento.target.closest('[data-remover]');
        if (botao && typeof self.aoRemoverCallback === 'function') {
          self.aoRemoverCallback(botao.getAttribute('data-remover'));
        }
      });
    }

    aoBuscar(callback) {
      this.aoBuscarCallback = callback;
    }

    aoRemover(callback) {
      this.aoRemoverCallback = callback;
    }

    renderizar(reservas) {
      this.corpo.innerHTML = '';

      var fragmento = document.createDocumentFragment();
      var self = this;

      reservas.forEach(function (reserva) {
        fragmento.appendChild(self.criarLinha(reserva));
      });

      this.corpo.appendChild(fragmento);
      this.tabela.hidden = reservas.length === 0;
      this.vazioEl.hidden = reservas.length > 0;

      if (reservas.length === 0) {
        this.contadorEl.textContent = 'Nenhuma reserva encontrada';
      } else {
        this.contadorEl.textContent =
          reservas.length + (reservas.length === 1
            ? ' reserva encontrada'
            : ' reservas encontradas');
      }
    }

    criarLinha(reserva) {
      var linha = document.createElement('tr');

      var vagaCelula = document.createElement('td');
      var vagaPill = document.createElement('span');
      vagaPill.className = 'pill';
      vagaPill.textContent = 'Vaga ' + App.Formatadores.vaga(reserva.vaga);
      vagaCelula.appendChild(vagaPill);

      var placaCelula = document.createElement('td');
      var placa = document.createElement('span');
      placa.className = 'plate';
      placa.textContent = reserva.placa;
      placaCelula.appendChild(placa);

      var proprietarioCelula = this.criarCelulaTexto(reserva.proprietario);
      var apartamentoCelula = this.criarCelulaTexto(
        'Apto ' + reserva.apartamento + ' · Bloco ' + reserva.bloco
      );
      var modeloCelula = this.criarCelulaTexto(reserva.modelo);
      var corCelula = this.criarCelulaTexto(reserva.cor);

      var acoesCelula = document.createElement('td');
      acoesCelula.className = 'text-right';

      var botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'icon-btn';
      botao.setAttribute('data-remover', reserva.id);
      botao.setAttribute(
        'aria-label',
        'Remover reserva da vaga ' + reserva.vaga
      );
      botao.title = 'Remover reserva';
      botao.innerHTML = ICONE_REMOVER;
      acoesCelula.appendChild(botao);

      linha.appendChild(vagaCelula);
      linha.appendChild(placaCelula);
      linha.appendChild(proprietarioCelula);
      linha.appendChild(apartamentoCelula);
      linha.appendChild(modeloCelula);
      linha.appendChild(corCelula);
      linha.appendChild(acoesCelula);

      return linha;
    }

    criarCelulaTexto(texto) {
      var celula = document.createElement('td');
      celula.textContent = texto;
      return celula;
    }

    atualizarResumo(model) {
      this.statTotal.textContent = model.totalVagas;
      this.statOcupadas.textContent = model.totalOcupadas();
      this.statLivres.textContent = model.totalDisponiveis();
    }

    confirmarRemocao(reserva, aoConfirmar) {
      this.modal.abrir({
        tipo: 'perigo',
        titulo: 'Remover reserva?',
        mensagem:
          'A reserva da vaga ' + App.Formatadores.vaga(reserva.vaga) +
          ' (' + reserva.placa + ') de ' + reserva.proprietario +
          ' será removida. Essa ação não pode ser desfeita.',
        acoes: [
          { rotulo: 'Cancelar', variante: 'secundario' },
          {
            rotulo: 'Remover',
            variante: 'perigo',
            aoClicar: aoConfirmar,
          },
        ],
      });
    }

    mostrarErro(mensagem) {
      this.modal.abrir({
        tipo: 'erro',
        titulo: 'Não foi possível remover',
        mensagem: mensagem,
        acoes: [{ rotulo: 'Fechar', variante: 'primario' }],
      });
    }

    mostrarAviso(mensagem) {
      var self = this;

      this.toastMensagem.textContent = mensagem;
      this.toastEl.hidden = false;

      window.clearTimeout(this.temporizadorToast);
      this.temporizadorToast = window.setTimeout(function () {
        self.toastEl.hidden = true;
      }, 4000);
    }
  }

  App.ListaView = ListaView;
})(window.ParkingApp = window.ParkingApp || {});
