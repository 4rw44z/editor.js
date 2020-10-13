import $ from '../dom';
import {InlineTool, SanitizerConfig} from '../../../types';


export default class FontSizeInlineTool implements InlineTool {

    public static isInline = true;

    public static title = 'Font Size';
    private isDropDownOpen = false;
    private togglingCallback = null;
    public static get sanitize(): SanitizerConfig {
        return {
            font: {},
        } as SanitizerConfig;
    }
    public commandName: string = 'fontSize';
    private readonly CSS = {
        button: 'ce-inline-tool',
        buttonActive: 'ce-font-size-tool--active',
        buttonModifier: 'ce-inline-tool--font',

    }
    private selectedFontSize = null;
    private nodes: {button : HTMLButtonElement}  = {
        button: undefined
    }
    public selectionList = undefined;
    private buttonWrapperText = undefined;
    createButton() {
        this.nodes.button = document.createElement('button') as HTMLButtonElement;
        this.nodes.button.type = 'button';
        this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
        this.nodes.button.setAttribute('id', 'font-size-btn');
        this.getFontSizeForButton();
        this.nodes.button.appendChild($.svg('toggler-down', 13, 13));
    }
    getFontSizeForButton() {
        this.buttonWrapperText = document.createElement('div');
        this.buttonWrapperText.classList.add('button-wrapper-text');
        const displaySelectedFontSize = document.createElement('div');
        displaySelectedFontSize.setAttribute('id', 'font-size-dropdown')
        displaySelectedFontSize.innerHTML = '&nbsp;&nbsp';
        $.append(this.buttonWrapperText, displaySelectedFontSize);
        $.append(this.nodes.button, this.buttonWrapperText);
    }
    public addFontSizeOptions() {
        const fontSizeList = [
            {label: '10', value: '1' },
            {label: '13', value: '2'},
            {label: '16', value: '3'},
            {label: '18', value: '4'},
            {label: '24', value: '5'},
            {label: '32', value: '6'},
            {label: '48', value: '7'}
        ];
        this.selectionList = document.createElement('div');
        this.selectionList.setAttribute('class', 'selectionList');
        const selectionListWrapper = document.createElement('div');
        selectionListWrapper.setAttribute('class', 'selection-list-wrapper');
        for(const value of fontSizeList) {
            const option = document.createElement('div');
            option.setAttribute('value', value.value);
            option.setAttribute('id', value.value);
            option.classList.add('selection-list-option');
            if((document.getElementById('font-size-dropdown').innerHTML === value.value) || (this.selectedFontSize === value.value)){
            option.classList.add('selection-list-option-active');
            }
            option.innerHTML = value.label;
            $.append(selectionListWrapper, option);
        }
        $.append(this.selectionList, selectionListWrapper);
        $.append(this.nodes.button, this.selectionList);
        this.selectionList.addEventListener('click', (event) => {
            this.selectedFontSize = event.target.id;
            this.toggle();
        });
        setTimeout(() => {
            if(typeof this.togglingCallback ==='function') {
                this.togglingCallback(true);
            }
        }, 50);
    };
    public removeFontSizeOptions() {
        if(this.selectionList) {
        this.isDropDownOpen = false;
        this.selectionList = this.selectionList.remove();
        }
        if (typeof this.togglingCallback === 'function') {
            this.togglingCallback(false);
        }
    }
    public render(): HTMLElement {
        this.createButton();
        this.nodes.button.addEventListener('click', ($event) => {
            if(((<HTMLElement>$event.target).id === 'font-size-dropdown'|| (<HTMLElement>(<HTMLElement>(<HTMLElement>$event.target).parentNode)).id === 'font-size-btn')) {
                this.toggle((toolbarOpened) => {
                    if(toolbarOpened) {
                        this.isDropDownOpen = true;
                    }
                })
            }
        });
        return this.nodes.button;
    }
    public toggle(togglingCallback ?: (openedState:boolean) => void):void {
        if(!this.isDropDownOpen && togglingCallback) {
            this.addFontSizeOptions();
        } else {
            this.removeFontSizeOptions();
        }
        if(typeof togglingCallback === 'function') {
            this.togglingCallback = togglingCallback;
        }
    }
    public surround(range: Range): void {
      
        if(this.selectedFontSize) {
            document.execCommand('fontSize', false, this.selectedFontSize);
        }
    }

    public checkState(selection: Selection){
        const isActive = document.queryCommandState('fontSize');
        let computedFontSize= window.getComputedStyle(selection.anchorNode.parentElement, null).getPropertyValue('font-size');
        computedFontSize = computedFontSize.slice(0, computedFontSize.indexOf('p'));
        this.replaceFontSizeInWrapper(computedFontSize);
        return isActive;
    }
    public replaceFontSizeInWrapper(size) {
        const displaySelectedFontSize = document.getElementById('font-size-dropdown')
        displaySelectedFontSize.innerHTML = size;
    }

    public clear() {
        this.toggle();
        this.selectedFontSize = null;
    }

}