import $ from '../dom';
import { InlineTool, SanitizerConfig } from '../../../types';


export default class FontFamilyTool implements InlineTool {

    public static isInline = true;

    public static title = 'Font Family';
    private isDropDownOpen = false;
    public static get sanitize(): SanitizerConfig {
        return {
            font: {
                size: true,
                face: true
            },
        } as SanitizerConfig;
    }
    private readonly commandName: string = 'fontName';
    private readonly CSS = {
        button: 'ce-inline-tool',
        buttonActive: 'ce-font-family-too=l--active',
        buttonModifier: 'ce-inline-tool--font',

    }
    private selectedFontFamily = null;
    private nodes: { button: HTMLButtonElement } = {
        button: undefined
    }
    private selectionList = undefined;
    private buttonWrapperText = undefined;
    private togglingCallback = null;
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
        const values = ['Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold',
            'Avant Garde', 'Baskerville', 'Bodoni MT', 'Book Antiqua', 'Big Caslon', 'Calibri', 'Calisto MT', 'Cambria', 'Candara', 'Century Gothic',
            'Charcoal', 'Copperplate',
            'Comic Sans MS', 'Courier New',
            'Didot',
            'Franklin Gothic Medium',
            'Futura', 'Geneva', 'Gill Sans', 'Garamond', 'Georgia', 'Goudy Old Style',
            'Hoefler Text',
            'Helvetica',
            'Helvetica Neue', 'Impact', 'Lucida Sans Unicode','Lato','Lucida Grande', 'Lucida Bright', 'Monaco', 'Optima', 'Papyrus',
            'PT Mono', 'Palatino', 'Perpetua', 'Rockwell', 'Roboto', 'Rockwell Extra Bold', 'Segoe UI', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana',
        ];
        this.selectionList = document.createElement('div');
        this.selectionList.setAttribute('class', 'selectionList');
        const selectionListWrapper = document.createElement('div');
        selectionListWrapper.setAttribute('class', 'selection-list-wrapper-font');
        for (const value of values) {
            const option = document.createElement('div');
            option.setAttribute('value', value);
            option.setAttribute('style', `font-family:${value}`);
            option.classList.add('selection-list-option');
            if (document.getElementById('font-family-dropdown').innerHTML === value || this.selectedFontFamily === value) {
                option.classList.add('selection-list-option-active');
            }
            option.innerHTML = value;
            $.append(selectionListWrapper, option);
        }
        $.append(this.selectionList, selectionListWrapper);
        $.append(this.nodes.button, this.selectionList);
        this.selectionList.addEventListener('click', (event) => {
            this.selectedFontFamily = event.target.innerHTML;
            this.toggle();
        });
        setTimeout(() => {
            if (typeof this.togglingCallback === 'function') {
                this.togglingCallback(true);
            }
        }, 50);
    };
    public removeFontOptions() {
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
            if (((<HTMLElement>$event.target).id === 'font-family-dropdown' || (<HTMLElement>(<HTMLElement>(<HTMLElement>$event.target).parentNode)).id === 'font-family-btn')) {
                this.toggle((toolbarOpened) => {
                    if (toolbarOpened) {
                        this.isDropDownOpen = true;
                    }
                });
            }
        });
        return this.nodes.button;
    }
    public toggle(togglingCallback?: (openedState: boolean) => void): void {
        if (!this.isDropDownOpen && togglingCallback) {
            this.addFontFamilyOptions();
        } else {
            this.removeFontOptions();
        }
        if (typeof togglingCallback === 'function') {
            this.togglingCallback = togglingCallback;
        }
    }
    public surround(range: Range): void {
        if (this.selectedFontFamily) {
            document.execCommand(this.commandName, false, this.selectedFontFamily);
        }
    }

    public checkState(selection: Selection) {
        const isActive = document.queryCommandState(this.commandName);
        let anchoreElementSelectedFont = window.getComputedStyle(selection.anchorNode.parentElement, null).getPropertyValue('font-family');
        const focusElementSelectedFont = window.getComputedStyle(selection.focusNode.parentElement, null).getPropertyValue('font-family');
        if(anchoreElementSelectedFont === focusElementSelectedFont) {
            if(anchoreElementSelectedFont.slice(0,1) === '"'){
                anchoreElementSelectedFont = anchoreElementSelectedFont.slice(1, -1);
            }
            else if(anchoreElementSelectedFont.slice(0,1) === '-') {
                const updatedFont = anchoreElementSelectedFont.slice(anchoreElementSelectedFont.indexOf('"')+1, anchoreElementSelectedFont.indexOf('"',anchoreElementSelectedFont.indexOf('"')+1));
                anchoreElementSelectedFont = updatedFont;
            }
            else if(anchoreElementSelectedFont.indexOf(',')) {
                anchoreElementSelectedFont = anchoreElementSelectedFont.slice(0, anchoreElementSelectedFont.indexOf(','));
            }
            this.replaceFontSizeInWrapper(anchoreElementSelectedFont);
        }
        else {
            const emptyWrapper = '&nbsp;&nbsp'
            this.replaceFontSizeInWrapper(emptyWrapper);
        }
        return isActive;
    }
    public replaceFontSizeInWrapper(fontFamily) {
        const displaySelectedFontFamily = document.getElementById('font-family-dropdown')
        displaySelectedFontFamily.innerHTML = fontFamily;
    }
    public clear() {
        this.toggle();
        this.selectedFontFamily = null;
    }
}