class LS {

  constructor (init) {

    if (typeof(Storage) !== "undefined") {
      if(localStorage.getItem(init) === null) {
        const newStorage = {
          version: 1,
          a: 1,
          s: "0",
          n: 1,
          c: 0
        };
        localStorage.setItem(init, JSON.stringify(newStorage));
      } else {
        this._storageKey = init;
        this._getState = window.localStorage.getItem(init);
      }
    } else {
      throw new Error('LocalStorage - Not supported');
    }
  }

    putState (updateState) {
      let curState = this.getState();
      let newState = {...curState, ...updateState};
      localStorage.setItem(this._storageKey, JSON.stringify(newState));
    }

    removeState (updateState) {
      let curState = this.getState();
      delete curState[updateState];
      localStorage.setItem(this._storageKey, JSON.stringify(curState));
    }

    getState () {
      const serialized = localStorage.getItem(this._storageKey);
      return serialized ? JSON.parse(serialized) : undefined;
    }

}

module.exports = LS;
