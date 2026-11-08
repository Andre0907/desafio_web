(function (App) {
  'use strict';

  class DisponiveisView {
    constructor() {
      this.grid = document.getElementById('grid-vagas');
      this.totalEl = document.getElementById('disp-total');
      this.livresEl = document.getElementById('disp-livres');
      this.ocupadasEl = document.getElementById('disp-ocupadas');
      this.percentualEl = document.getElementById('disp-percentual');
      this.barraEl = document.getElementById('disp-barra');
      this.resumoEl = document.getElementById('disp-resumo');
    }

    renderizar(model) {
      var disponiveis = new Set(model.vagasDisponiveis());
      var fragmento = document.createDocumentFragment();

      for (var numero = 1; numero <= model.totalVagas; numero += 1) {
        var livre = disponiveis.has(numero);
        var vaga = document.createElement('div');
        var numeroEl = document.createElement('span');
        var statusEl = document.createElement('span');

        vaga.className = 'vaga ' + (livre ? 'vaga--livre' : 'vaga--ocupada');

        numeroEl.className = 'vaga__numero';
        numeroEl.textContent = App.Formatadores.vaga(numero);

        statusEl.className = 'vaga__status';
        statusEl.textContent = livre ? 'Disponível' : 'Ocupada';

        vaga.appendChild(numeroEl);
        vaga.appendChild(statusEl);
        fragmento.appendChild(vaga);
      }

      this.grid.innerHTML = '';
      this.grid.appendChild(fragmento);

      this.totalEl.textContent = model.totalVagas;
      this.livresEl.textContent = model.totalDisponiveis();
      this.ocupadasEl.textContent = model.totalOcupadas();
      this.percentualEl.textContent = model.percentualDisponivel() + '%';
      this.barraEl.style.width = model.percentualDisponivel() + '%';
      this.resumoEl.textContent = model.totalDisponiveis() +
        ' vagas livres de ' + model.totalVagas;
    }
  }

  App.DisponiveisView = DisponiveisView;
})(window.ParkingApp = window.ParkingApp || {});
