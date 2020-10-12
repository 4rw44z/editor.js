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
    private readonly commandName: string = 'fontName';
    private readonly CSS = {
        button: 'ce-inline-tool',
        buttonActive: 'ce-font-family-too=l--active',
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
        this.getFontFamilyForButton();
        this.nodes.button.appendChild($.svg('toggler-down', 13, 13));
    }
    getFontFamilyForButton() {
        this.buttonWrapperText = document.createElement('div');
        this.buttonWrapperText.classList.add('button-wrapper-text-font-family');
        const displaySelectedFontFamily = document.createElement('div');
        displaySelectedFontFamily.classList.add('selected-font-family')
        displaySelectedFontFamily.setAttribute('id', 'font-family-dropdown');
        displaySelectedFontFamily.innerHTML = '&nbsp;&nbsp';
        $.append(this.buttonWrapperText, displaySelectedFontFamily);
        $.append(this.nodes.button, this.buttonWrapperText);
    }
    public addFontFamilyOptions() {
        const values = ['Arial','Arial Black','Charcoal',
        'Comic Sans MS','Courier New', 'Geneva', 'Helvetica',
        'Helvetica Neue','Impact', 'Lucida Sans Unicode','Monaco',
        'PT Mono', 'Segoe UI', 'Verdana',
        ];
        this.selectionList = document.createElement('div');
        this.selectionList.setAttribute('class', 'selectionList');
        const selectionListWrapper = document.createElement('div');
        selectionListWrapper.setAttribute('class', 'selection-list-wrapper-font');
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
            if(!this.isDropDownOpen && ((<HTMLElement>$event.target).id === 'font-family-dropdown'|| (<HTMLElement>(<HTMLElement>(<HTMLElement>$event.target).parentNode)).id === 'font-family-btn')) {
                this.addFontFamilyOptions();
                this.isDropDownOpen = true;
            }
        });
        return this.nodes.button;
    }
    public surround(range: Range): void {
      if(this.selectedFontFamily) {
          document.execCommand(this.commandName, false, this.selectedFontFamily);
      }
    }

    public checkState(selection: Selection){
        const isActive =  document.queryCommandState(this.commandName);
        let selectedFont= window.getComputedStyle(selection.anchorNode.parentElement, null).getPropertyValue('font-family');
        selectedFont = selectedFont.slice(1, -1);
         this.replaceFontSizeInWrapper(selectedFont);
        return isActive;
    }
    public replaceFontSizeInWrapper(size) {
        const displaySelectedFontFamily = document.getElementById('font-family-dropdown')
        displaySelectedFontFamily.innerHTML = size;
    }

}