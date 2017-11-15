// import {Component, Utils, Store, ObservableModel} from '../core';
import {Utils} from '../utils/utils';
import {Store} from '../store';
import {ObservableModel} from '../observable/observable';


class ModalsStore extends Store{
    constructor() {
        super();
        this.modal = new ObservableModel({
            visible: false,
            modalData: null
        });
    }

    init() {

    }

    open(type, params = {}) {
        setTimeout(() => {
            this.type = type;
            this.modal.set({
                type,
                visible: true,
                modalData: params.data || {},
                callback: params.callback
            });
        })
    }

    close(type) {
        if (type === this.type) {
            this.modal.set({
                visible: false
            });
        }
    }
}

let ModalStore = new ModalsStore();

class ModalComponent{
    onInit() {
        this.root.className = 'modal-container';
        this.setSubscriptions(
            ModalStore.modal.sub(r => {
                if (r.visible && this.type === r.type) {
                    this.root.style.display = 'block';
                    this.onOpen();
                    this.props.set(r);
                } else {
                    if(this.root.style.display !== 'none'){                    
                        this.root.style.display = 'none';
                        // this.props.clear();
                        this.onClose();
                        this.props.set(r);
                    }
                }
            })
        );
    }

    onOpen() {

    }

    onClose() {

    }

    close() {
        ModalStore.close(this.type);
    }

    cancel() {
        ModalStore.close(this.type);
    }


    outside(e, item) {
        ModalStore.close(this.type);
    }

    onDestroy() {

    }
}


export {
    ModalStore,
    ModalComponent
}