// import {Component, Router} from '../../../core';
import {ComponentDecorator} from '../../../decorators';
import Tpl from './header.component.html';
// import ProjectsStore from 'stores/projects.store';
// import UserStore from 'stores/user.store';
@ComponentDecorator({
    template: Tpl
})
export class HeaderComponent {
    constructor(params) {

    }

    onInit() {
        this;
    }

    onDestroy() {

    }
}