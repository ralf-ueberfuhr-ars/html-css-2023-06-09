type Kostenart = {
  id: number,
  name: string,
  description?: string
};

type KostenartListener = (kostenarten: Kostenart[]) => void;

const LOCAL_STORAGE_KEY = 'kostenarten';

class KostenartService {

  private readonly _kostenarten: Kostenart[] = [];

  private readonly _listeners: KostenartListener[] = [
    data => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
  ];

  get kostenarten(): Kostenart[] {
    return this._kostenarten;
  }

  set kostenarten(kostenarten: Kostenart[]) {
    this._kostenarten.length = 0;
    this._kostenarten.push(...kostenarten);
    this.notifyListeners();
  }

  private notifyListeners() {
    this._listeners.forEach(listener => listener(this._kostenarten));
  }

  onKostenartenChanged(listener: KostenartListener): void {
    this._listeners.push(listener);
  }

  initialisiereDaten(url: string): Promise<Kostenart[]> {
    return fetch(url)
      .then(body => body.json())
      .catch(err => {
        console.error(err);
        const cachedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cachedValue) {
          return JSON.parse(cachedValue);
        } else {
          throw err;
        }
      })
      .then((loadedKostenarten: Kostenart[]) => {
        this.kostenarten = loadedKostenarten;
        return this.kostenarten;
      })

  }

  erzeugeKostenart(name: string): Kostenart {
    // find next kostenart id
    const nextId = Math.max(...this._kostenarten.map(ka => ka.id)) + 1;
    const result: Kostenart = {
      id: nextId,
      name
    };
    this._kostenarten.push(result);
    this.notifyListeners();
    return result;
  }


}

export {
  Kostenart,
  KostenartListener,
  KostenartService
}