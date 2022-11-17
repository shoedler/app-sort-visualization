import { CSSClassNames, CSSColorRules } from "./constants";

export interface IObservableArrayVisualizerConfigProvider {
  readonly arrayContainerId: string;
}

export interface IObservableArrayVisualizer {
  setStyle(index: number, type: keyof typeof CSSColorRules): void;
  clearStyles(): void;
  setValue(index: number, value: number): void;
  getValue(index: number): number;
  getLength(): number;

  rebuildArray(sourceArray: number[]): void;
}

export default function useObservableArrayVisualizer(configProvider: IObservableArrayVisualizerConfigProvider) {
  return new ObservableArrayVisualizer(configProvider);
}

class ObservableArrayVisualizer implements IObservableArrayVisualizer {
  private readonly _configProvider: IObservableArrayVisualizerConfigProvider;
  private readonly _arrayContainer: HTMLDivElement;
  private readonly _controlsContainer: HTMLDivElement;

  public constructor(configProvider: IObservableArrayVisualizerConfigProvider) {
    this._configProvider = configProvider;
    this._arrayContainer = document.createElement("div");
    this._arrayContainer.className = CSSClassNames.arrayContainer

    document.getElementById(this._configProvider.arrayContainerId)
      .append(this._arrayContainer);
  }

  private _array: HTMLCollection;

  public get controlsContainer(): HTMLDivElement { return this._controlsContainer }

  // Helper to access array indicies, since we always have to retrieve `.children[0]`
  private get = (index: number): HTMLDivElement => this._array[index].children[0] as HTMLDivElement

  public getLength(): number {
    return this._arrayContainer.children.length
  }

  public clearStyles(): void {
    for (let i = 0; i < this._array.length; i++) {
      this.get(i).removeAttribute("class");
    }
  }

  public setStyle = (index: number, type: keyof typeof CSSColorRules): void => {
    this.get(index).className = CSSColorRules[type] // TODO: Move these to CSSClassNames
  }

  public setValue = (index: number, value: number): void => {
    this.get(index).children[0].innerHTML = value.toString();
    (this.get(index) as HTMLElement).style.height = `${value}%`;
  }

  public getValue = (index: number): number => {
    return parseInt(this.get(index).children[0].innerHTML);
  }

  public rebuildArray = (sourceArray: number[]): void => {
    this._arrayContainer.replaceChildren(...[]);

    for (let i = 0; i < sourceArray.length; i++) {
      const barWrapper = document.createElement("div");
      const bar = document.createElement("div");
      const barLabel = document.createElement("label");

      bar.style.height = `${sourceArray[i]}%`;
      barLabel.innerHTML = sourceArray[i].toString();

      bar.appendChild(barLabel);
      barWrapper.appendChild(bar)
      this._arrayContainer.appendChild(barWrapper);
    }

    this._array = this._arrayContainer.children;
  };
}