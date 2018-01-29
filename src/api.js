// import { ObservableBoolean } from './observable/observable';
import {RouteSwitcher} from './router/router-switcher';
import { Component } from './component/component';

class API {
    constructor() {
        // this.isReady = new ObservableBoolean(false);
        this.rootComponent = null;
        this.rootInstance = null;
        this.config = {};
        this.COMPONENTS = [];
        this.CUSTOM_DIRECTIVES = [];
        this._SERVICES = [];
        this._READY_SERVICES = [];
    }

    setServices(options) {
        options.forEach(r => {
            if (Array.isArray(r)) {
                r.forEach(r => {
                    this._SERVICES.push(r);
                })
            } else {
                this._SERVICES.push(r);
            }
        });
    }

    injectorGet(service, Class) {
        let instanceName = (Class ? Class.name : '');
        if (typeof service !== 'function') {
            throw new Error('Is not a service; ' + instanceName);
        }

        let injectedService = this._SERVICES.filter(r => r === service)[0];
        let readyService = this._READY_SERVICES.filter(r => {
            if (!service.class) throw new Error(service.name + ' service must be injected; See ' + instanceName);
            return r instanceof service.class;
        });
        if (readyService.length) {
            return readyService[0];
        } else {
            if (injectedService) {
                let readyService = new injectedService();
                this._READY_SERVICES.push(readyService);
                return readyService
            } else {
                if (service.class) {
                    throw new Error('Service doesn\'t exist; ' + service.class.name + '; See ' + instanceName);
                } else {
                    throw new Error(service.name + ' service must be injected; See ' + instanceName);
                }

            }
        }
    }

    register(options) {
        this.loadStyle(options.styles);

        if (options.services && options.services.length) {
            this.setServices(options.services);
        }

        RouteSwitcher.ROUTES = options.routes;
        this.rootComponent = options.root;

        options.components.forEach(c => this.registerComponent(c));

        if (options.directives) {
            if (options.directives instanceof Array) {
                options.directives.forEach(d => this.registerDirective(d));
            } else {
                throw new Error('directives must be an array');
            }
        }

        if (options.import instanceof Array) {
            options.import.forEach(module => {
                if (Array.isArray(module)) {
                    module.forEach(component => {
                        this.registerComponent(component);
                    });
                } else {
                    throw new Error('imported data must be an array');
                }
            });
        } else {
            throw new Error('imported data must be an array');
        }

        let rootEl = document.querySelectorAll(options.root.selector)[0];
        if (rootEl) {
            let rootComponent = new options.root(rootEl);
            rootComponent.root.setAttribute('ac-version', VERSION);
        } else {
            console.warn('There is no root component');
        }

        // this.isReady.set(true);
    }

    registerComponent(component) {
        //avoid repeated components
        if (this.COMPONENTS.map(r => r.selector).indexOf(component.selector) > -1) {
            throw new Error('Duplicate declaration; ' + component.selector);
        }

        if (component instanceof Component.constructor) {
            this.COMPONENTS.push(component);
        } else {
            console.warn('Wrong type of component');
        }
    }

    registerDirective(directive) {
        //avoid repeated directives
        directive.params.selector;
        if (this.CUSTOM_DIRECTIVES.map(r => r.params.selector).indexOf(directive.params.selector) > -1) {
            throw new Error('Duplicate declaration; ' + directive.params.selector);
        }

        this.CUSTOM_DIRECTIVES.push(directive);
    }


    loadStyle(styles) {
        if (styles) {
            let css = styles.toString(),
                style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            // document.head.append(style);
            document.getElementsByTagName('head')[0].appendChild(style);
        }
    }
}

export default new API();