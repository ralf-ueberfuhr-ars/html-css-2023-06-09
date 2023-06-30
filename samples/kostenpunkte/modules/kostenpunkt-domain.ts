import { Kostenart } from "./kostenart-domain.js";

type Kostenpunkt = {
  id?: number,
  date: Date,
  value: number,
  type: Kostenart,
  comment?: string

};

type KostenpunktListener = (Kostenpunkten: Kostenpunkt[]) => void;

const LOCAL_STORAGE_KEY = 'Kostenpunkten';

class KostenpunktService {

  private readonly _kostenpunkte: Kostenpunkt[] = [];

  private readonly _listeners: KostenpunktListener[] = [];
  private idCounter = 0;

  get kostenpunkte(): Kostenpunkt[] {
    return this._kostenpunkte;
  }

  set kostenpunkte(kostenpunkte: Kostenpunkt[]) {
    this._kostenpunkte.length = 0;
    this._kostenpunkte.push(...kostenpunkte);
    this.notifyListeners();
  }

  add(kostenpunkt: Kostenpunkt): void {
    kostenpunkt.id = this.idCounter;
    this.idCounter++;
    this._kostenpunkte.push(kostenpunkt);
    this.notifyListeners();
  }

  remove(id: number): boolean {
    const newKostenpunkte = this.kostenpunkte.filter(kp => kp.id !== id);
    if (newKostenpunkte.length !== this.kostenpunkte.length) {
      this.kostenpunkte = newKostenpunkte;
      return true;
    } else {
      return false;
    }
  }

  private notifyListeners() {
    this._listeners.forEach(listener => listener(this._kostenpunkte));
  }

  onKostenpunktenChanged(listener: KostenpunktListener): void {
    this._listeners.push(listener);
  }
}

export {
  Kostenpunkt,
  KostenpunktListener,
  KostenpunktService
}