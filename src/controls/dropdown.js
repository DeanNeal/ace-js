import { Component } from '../component/component';

export class DropdownComponent extends Component {
    constructor(params, options) {
        super(params, options);
    }

    openMenu(e) {
        if(this.getRoot().getAttribute('readonly') === null){
            this.props.set('_show', !this.props.get('_show'))
        }
    }

    outside() {
        this.close();
    }

    close() {
        if(this.props.get('_show')) {
            this.props.set('_show', false)
        }
    }
}
