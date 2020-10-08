import $ from '../dom';
import {InlineTool, SanitizerConfig} from '../../../types';


export default class FontSizeInlineTool implements InlineTool {

    public static isInline = true;

    public static title = 'FontSize';
    private isDropDownOpen = false;
    public static get sanitize(): SanitizerConfig {
        return {
            p: {},
        } as SanitizerConfig;
    }
    private readonly commandName: string = 'insertHtml';
    private readonly CSS = {
        button: 'ce-inline-tool',
        buttonActive: 'ce-font-size-tool--active',
        buttonModifier: 'ce-inline-tool--font',

    }
    private selectedFontSize = null;
    private nodes: {button : HTMLButtonElement}  = {
        button: undefined
    }
    private selectionList = undefined;
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
        const values = ['8', '9', '10', '11', '12', '14', '18', '24', '30', '36','48', '60', '72', '96'];
        this.selectionList = document.createElement('div');
        this.selectionList.setAttribute('class', 'selectionList');
        const selectionListWrapper = document.createElement('div');
        selectionListWrapper.setAttribute('class', 'selection-list-wrapper');
        for(const value of values) {
            const option = document.createElement('div');
            option.setAttribute('value', value);
            option.classList.add('selection-list-option');
            if(this.selectedFontSize === value){
            option.classList.add('selection-list-option-active');
            }
            option.innerHTML = value;
            $.append(selectionListWrapper, option);
        }
        $.append(this.selectionList, selectionListWrapper);
        $.append(this.nodes.button, this.selectionList);
        this.selectionList.addEventListener('click', (event) => {
            this.selectedFontSize = event.target.innerHTML;
            this.removeFontSizeOptions();
        });
    };
    public removeFontSizeOptions() {
        this.isDropDownOpen = false;
        this.selectionList.remove();
    }
    public render(): HTMLElement {
        this.createButton();
        this.nodes.button.addEventListener('click', ($event) => {
            console.log($event);
            if(!this.isDropDownOpen && ((<HTMLElement>$event.target).id === 'font-size-dropdown'|| (<HTMLElement>(<HTMLElement>(<HTMLElement>$event.target).parentNode)).id) === 'font-size-btn') {
                this.addFontSizeOptions();
                this.isDropDownOpen = true;
            }
        });
        return this.nodes.button;
    }
    public surround(range: Range): void {
        if(this.selectedFontSize) {
            const selectedDocument = document.getSelection().toString();
            const fontSize = (size, unit) => {
                const font = `${size}${unit}`;
                const spanString = document.createElement('span');
                spanString.setAttribute('text', selectedDocument);
                spanString.innerHTML = selectedDocument;
                spanString.style.fontSize = font;
                document.execCommand(this.commandName, false, spanString.outerHTML);
            }
            fontSize(this.selectedFontSize, 'px');
        }
    }

    public checkState(selection: Selection){
        const isActive =  document.queryCommandState(this.commandName);
        const computedFontSize= window.getComputedStyle(selection.anchorNode.parentElement, null).getPropertyValue('font-size');
        this.selectedFontSize = computedFontSize.slice(0, computedFontSize.indexOf('p'));
        this.replaceFontSizeInWrapper(this.selectedFontSize);
        return isActive;
    }
    public replaceFontSizeInWrapper(size) {
        const displaySelectedFontSize = document.getElementById('font-size-dropdown')
        displaySelectedFontSize.innerHTML = size;
    }

}