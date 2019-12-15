// import {PRIVATES} from '../private';
import {Utils} from '../../core';
import {createEventObject} from './event';
import api from '../../api';

function camelCase(str) { 
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
} 

export function _init(root, directive, newArray) {
    let array = newArray || [];
    let host = root.host || root;

    let attr = root.getAttribute ? root.getAttribute(directive) : null;
    if (attr && !Utils.isCustomElement(root)) { // only for loops
        let obj = {
            elem: root,
            attr,
            items: [],
            parent: root.parentNode,
            cached: root
        };

        array.push(obj);
        root.removeAttribute(directive);
    }

    //syntax sugar [params]=""
    if(directive === 'bind-params' && Utils.isCustomElement(host)) {
        
        api.REGISTERED_COMPONENTS.forEach(compName=> {
         
            root.querySelectorAll(`${compName}`).forEach(elem=>{
                  
                const attrAr = [...elem.attributes].map((attr)=> {
                    let matchReg = /\[.*?\]/g;
                    let match = attr.name.match(matchReg);
                    
                    if(match) {
                        if(match[0] === '[]') throw new Error('The name of passed property must be specified: ' + this.constructor.name);
                        elem.removeAttribute(attr.name);
                        return {
                            [camelCase(attr.name.replace(/\[(.*?)\]/g,"$1"))]: attr.value
                        };
                    }
                }).filter(r=> r);
    
                if(attrAr.length) {
                    let obj = {
                        elem: elem,
                        attrs: attrAr
                    }
                    
                    array.push(obj);
                }
            });
        })
        return array;
    }


    root.querySelectorAll(`[${directive}]`).forEach(elem=>{
        let attr = elem.getAttribute(directive);
        
        // exclude inner loops
        if (directive === 'bind-for' && elem.querySelectorAll('[bind-for]').length) {
            for (let innerElem of elem.querySelectorAll(`[bind-for]`)) {
                innerElem.setAttribute('bind-inner-loop', true);
            }
        }

        if (directive === 'bind-for' && elem.getAttribute('bind-inner-loop')) {
            elem.removeAttribute('bind-inner-loop');
            return;
        }
        
        let obj = {
            elem,
            attr,
            items: [],
            parent: elem.parentNode,
            cached: elem
        };
        
        // only for certain directives
        if(directive === 'bind-for' || directive === 'bind-if') {
            obj.comment = Utils.insertAfter(document.createComment(directive + ': ' + attr), elem);
            obj.cachedIndexes = [];
            obj.rootCached = null;
            obj.interpolationArray = [];
        }
        array.push(obj);
        elem.removeAttribute(directive);
        if (directive === 'bind-for') elem.remove();
    });

    return array;
}


export function _initEvent(root, directive, newArray, data, loopParams) {
    let array = newArray || [];
    let targets = root.querySelectorAll(`[bind-${directive}]`);
    if (root.getAttribute && root.getAttribute(`bind-${directive}`)) {
        let obj = createEventObject.call(this, root, directive, data, loopParams);
        array.get ? array.get(this).push(obj) : array.push(obj);
    }

    for (let elem of targets) {
        let obj = createEventObject.call(this, elem, directive, data, loopParams);
        array.get ? array.get(this).push(obj) : array.push(obj);
    }
    return array;
}