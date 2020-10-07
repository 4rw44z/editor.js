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
    public render(): HTMLElement {
        this.createButton();
        this.nodes.button.addEventListener('click', (event) => {
            if(this.isDropDownOpen) {
                event.stopPropagation();
            }
            this.isDropDownOpen = true;
            this.addFontSizeOptions();
        });
        return this.nodes.button;
    }
    createButton() {
        this.nodes.button = document.createElement('button') as HTMLButtonElement;
        this.nodes.button.type = 'button';
        this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
        this.getFontSizeForButton();
        this.nodes.button.appendChild($.svg('toggler-down', 13, 13));
    }
    getFontSizeForButton() {
        this.buttonWrapperText = document.createElement('div');
        this.buttonWrapperText.classList.add('button-wrapper-text');
        const displaySelectedFontSize = document.createElement('div');
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
            option.setAttribute('class', 'selection-list-option');
            if(this.selectedFontSize === value){
                option.setAttribute('class', 'selection-list-option-active');
            }
            option.innerHTML = value;
            $.append(selectionListWrapper, option);
        }
        $.append(this.selectionList, selectionListWrapper);
        $.append(this.nodes.button, this.selectionList);
        this.selectionList.addEventListener('click', (event) => {
            console.log(event.target);
            this.selectedFontSize = event.target.innerHTML;
            this.removeFontSizeOptions(event);
        });
    };
    public removeFontSizeOptions($event) {
        this.selectionList.remove();
        this.isDropDownOpen = false;
        // $event.stopPropagation();

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
        const isActive = document.queryCommandState(this.commandName);
        // const computedFontSize= window.getComputedStyle(selection.anchorNode.parentElement, null).getPropertyValue('font-size');
        // this.selectedFontSize = computedFontSize.slice(0, computedFontSize.indexOf('p'));
        // this.replaceFontSizeInWrapper(this.selectedFontSize);
        return isActive;
    }
    public replaceFontSizeInWrapper(size) {
        const displaySelectedFontSize = document.createElement('div');
        displaySelectedFontSize.innerHTML = size;
        this.buttonWrapperText.replaceChild(displaySelectedFontSize, this.buttonWrapperText.childNodes[0]);
    }

}