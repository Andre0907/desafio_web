(function (App) {
  'use strict';

  var ICONES = {
    sucesso:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    erro:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/></svg>',
    perigo:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12"/><path d="M10 11v5"/><path d="M14 11v5"/></svg>',
    info:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>',
  };

  class Modal {
    constructor(elemento) {
      this.elemento = elemento;
      this.tituloEl = elemento.querySelector('[data-modal-title]');
      this.mensagemEl = elemento.querySelector('[data-modal-message]');
      this.iconeEl = elemento.querySelector('[data-modal-icon]');
      this.acoesEl = elemento.querySelector('[data-modal-actions]');
      this.ultimoFoco = null;

      this.aoPressionarTecla = this.aoPressionarTecla.bind(this);

      var fechadores = elemento.querySelectorAll('[data-modal-close]');
      Array.prototype.forEach.call(fechadores, function (fechador) {
        fechador.addEventListener('click', this.fechar.bind(this));
      }, this);
    }

    abrir(opcoes) {
      opcoes = opcoes || {};

      var tipo = opcoes.tipo || 'info';
      var acoes = opcoes.acoes || [{ rotulo: 'Fechar', variante: 'primario' }];

      this.ultimoFoco = document.activeElement;
      this.tituloEl.textContent = opcoes.titulo || '';
      this.mensagemEl.textContent = opcoes.mensagem || '';
      this.iconeEl.className = 'modal__icon modal__icon--' + tipo;
      this.iconeEl.innerHTML = ICONES[tipo] || ICONES.info;
      this.acoesEl.innerHTML = '';

      var self = this;
      acoes.forEach(function (acao) {
        var botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'btn btn--' + (acao.variante || 'primario');
        botao.textContent = acao.rotulo;

        botao.addEventListener('click', function () {
          self.fechar();
          if (typeof acao.aoClicar === 'function') {
            acao.aoClicar();
          }
        });

        self.acoesEl.appendChild(botao);
      });

      this.elemento.hidden = false;
      document.body.classList.add('modal-aberto');
      document.addEventListener('keydown', this.aoPressionarTecla);

      var primeiroBotao = this.acoesEl.querySelector('button');
      if (primeiroBotao) {
        primeiroBotao.focus();
      }
    }

    fechar() {
      if (this.elemento.hidden) {
        return;
      }

      this.elemento.hidden = true;
      document.body.classList.remove('modal-aberto');
      document.removeEventListener('keydown', this.aoPressionarTecla);

      if (this.ultimoFoco && typeof this.ultimoFoco.focus === 'function') {
        this.ultimoFoco.focus();
      }
    }

    aoPressionarTecla(evento) {
      if (evento.key === 'Escape') {
        this.fechar();
      }
    }
  }

  App.Modal = Modal;
})(window.ParkingApp = window.ParkingApp || {});
