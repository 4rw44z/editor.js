import $ from '../dom';
import {InlineTool, SanitizerConfig} from '../../../types';


export default class FontFamilyTool implements InlineTool {

    public static isInline = true;

    public static title = 'FontFamily';
    private isDropDownOpen = false;
    public static get sanitize(): SanitizerConfig {
        return {
            p: {},
        } as SanitizerConfig;
    }
    private readonly commandName: string = 'insertHtml';
    private readonly CSS = {
        button: 'ce-inline-tool',
        buttonActive: 'ce-font-family-tool--active',
        buttonModifier: 'ce-inline-tool--font',

    }
    private selectedFontFamily = null;
    private nodes: {button : HTMLButtonElement}  = {
        button: undefined
    }
    private selectionList = undefined;
    private buttonWrapperText = undefined;
    createButton() {
        this.nodes.button = document.createElement('button') as HTMLButtonElement;
        this.nodes.button.type = 'button';
        this.nodes.button.classList.add(this.CSS.button, this.CSS.buttonModifier);
        this.nodes.button.setAttribute('id', 'font-family-btn');
        this.getFontSizeForButton();
        this.nodes.button.appendChild($.svg('toggler-down', 13, 13));
    }
    getFontSizeForButton() {
        this.buttonWrapperText = document.createElement('div');
        this.buttonWrapperText.classList.add('button-wrapper-text');
        const displaySelectedFontFamily = document.createElement('div');
        displaySelectedFontFamily.setAttribute('id', 'font-family-dropdown')
        displaySelectedFontFamily.innerHTML = '&nbsp;&nbsp';
        $.append(this.buttonWrapperText, displaySelectedFontFamily);
        $.append(this.nodes.button, this.buttonWrapperText);
    }
    public addFontSizeOptions() {
        const values = ['PT Mono', 'Segoe UI', 'Oxygen', 'Roboto', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'];
        this.selectionList = document.createElement('div');
        this.selectionList.setAttribute('class', 'selectionList');
        const selectionListWrapper = document.createElement('div');
        selectionListWrapper.setAttribute('class', 'selection-list-wrapper');
        for(const value of values) {
            const option = document.createElement('div');
            option.setAttribute('value', value);
            option.classList.add('selection-list-option');
            if(this.selectedFontFamily === value){
            option.classList.add('selection-list-option-active');
            }
            option.innerHTML = value;
            $.append(selectionListWrapper, option);
        }
        $.append(this.selectionList, selectionListWrapper);
        $.append(this.nodes.button, this.selectionList);
        this.selectionList.addEventListener('click', (event) => {
            this.selectedFontFamily = event.target.innerHTML;
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
            if(!this.isDropDownOpen && ((<HTMLElement>$event.target).id === 'font-family-dropdown'|| (<HTMLElement>(<HTMLElement>(<HTMLElement>$event.target).parentNode)).id) === 'font-family-btn') {
                this.addFontSizeOptions();
                this.isDropDownOpen = true;
            }
        });
        return this.nodes.button;
    }
    public surround(range: Range): void {
        // if(this.selectedFontFamily) {
        //     const selectedDocument = document.getSelection().toString();
        //     const fontSize = (size, unit) => {
        //         const font = `${size}${unit}`;
        //         const spanString = document.createElement('span');
        //         spanString.setAttribute('text', selectedDocument);
        //         spanString.innerHTML = selectedDocument;
        //         spanString.style.fontSize = font;
        //         document.execCommand(this.commandName, false, spanString.outerHTML);
        //     }
        //     fontSize(this.selectedFontFamily, 'px');
        // }
    }

    public checkState(selection: Selection){
        const isActive =  document.queryCommandState(this.commandName);
        // const computedFontSize= window.getComputedStyle(selection.anchorNode.parentElement, null).getPropertyValue('font-family');
        // this.selectedFontFamily = computedFontSize.slice(0, computedFontSize.indexOf('p'));
        // this.replaceFontSizeInWrapper(this.selectedFontFamily);
        return isActive;
    }
    public replaceFontSizeInWrapper(size) {
        const displaySelectedFontFamily = document.getElementById('font-family-dropdown')
        displaySelectedFontFamily.innerHTML = size;
    }

}