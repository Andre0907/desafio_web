(function (App) {
  'use strict';

  class StorageService {
    constructor(chave) {
      this.chave = chave;
    }

    carregar() {
      try {
        var conteudo = window.localStorage.getItem(this.chave);
        return conteudo ? JSON.parse(conteudo) : null;
      } catch (erro) {
        console.error('Não foi possível ler as reservas salvas neste navegador.', erro);
        return null;
      }
    }

    salvar(dados) {
      try {
        window.localStorage.setItem(this.chave, JSON.stringify(dados));
      } catch (erro) {
        console.error('Não foi possível salvar as reservas neste navegador.', erro);
      }
    }
  }

  App.StorageService = StorageService;
})(window.ParkingApp = window.ParkingApp || {});
