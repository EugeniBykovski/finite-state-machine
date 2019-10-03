class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {

            this.initial = "normal";
            this.states = config.states;
            this.history = new LinkedList();
            this.history.append("normal");
            this.redoStorage = new LinkedList();
            var message = {
                failure: 'Failure: config isn\'t passed.'
            };

            if (!config) {
                throw new Error(message.failure);
            }
        }
        /**
         * Returns active state.
         * @returns {String}
         */
    getState() {
            return this.initial;
        }
        /**
         * Goes to specified state.
         * @param state
         */
    changeState(state) {

            var message = {
                failure: 'Failure: state isn\'t exist.'
            };
            var count = 0;

            for (var key in this.states) {
                //console.log(key); 
                if (key === state) {
                    count++;
                }
            }
            if (!count) {
                throw new Error(message.failure);
            }
            this.initial = state;
            this.history.append(state);
            this.redoStorage.length = 0;
        }
        /**
         * Changes state according to event transition rules.
         * @param event
         */
    trigger(event) {
            var message = {
                failure: 'Failure: event in current state isn\'t exist.'
            };
            var count = 0;

            var obj = this.states[this.initial].transitions;

            for (var key in obj) {

                if (key === event) {
                    this.initial = obj[key];
                    count++;
                    this.history.append(obj[key]);
                    this.redoStorage.length = 0;
                    return;
                }
            }
            if (!count) {
                throw new Error(message.failure);
            }
        }
        /**
         * Resets FSM state to initial.
         */
    reset() {
            this.initial = "normal";
            this.history.length = 1;
        }
        /**
         * Returns an array of states for which there are specified event transition rules.
         * Returns all states if argument is undefined.
         * @param event
         * @returns {Array}
         */
    getStates(event) {
            var arr = [];

            if (!event) {
                for (var key in this.states) {
                    arr.push(key);
                }
                return arr;
            }
            for (var key in this.states) {
                var obj = this.states[key].transitions;
                for (var i in obj) {
                    //console.log(i);
                    if (event === i) {

                        arr.push(key);

                    }
                }
            }
            return arr;
        }
        /**
         * Goes back to previous state.
         * Returns false if undo is not available.
         * @returns {Boolean}
         */
    undo() {
            if (this.history.length === 1) {
                return false;
            }
            if (this.history.length > 1) {

                this.initial = this.history.at(this.history.length - 2);
                this.redoStorage.append(this.history.at(this.history.length - 1));
                this.history.length--;

                return true;
            }
        }
        /**
         * Goes redo to state.
         * Returns false if redo is not available.
         * @returns {Boolean}
         */
    redo() {
        if (this.redoStorage.length === 0) {
            return false;
        }
        this.initial = this.redoStorage.at(this.redoStorage.length - 1);
        this.redoStorage.length--;
        this.history.length++;
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = ['normal'];
    }
}
class LinkedList {
    constructor() {
        this.length = 0;
        this._head = null;
        this._tail = null;
    }
    append(data) {

        var node = new Node(data);

        if (this.length === 0) {
            this._head = node;
            this._tail = node;
        } else {
            this._tail.next = node;
            node.prev = this._tail;
            this._tail = node;
        }

        this.length++;
        return this;
    }
    head() {
        return this._head.data;
    }
    tail() {
        return this._tail.data;
    }
    at(index) {
        return this.nodeAt(index).data;
    }

    nodeAt(index) {
        var currentNode = this._head;
        var length = this.length;
        var count = 0;
        var message = {
            failure: 'Failure: non-existent node in this list.'
        };

        if (length === 0 || index < 0 || index > length) {
            throw new Error(message.failure);
        }

        while (count < index) {
            currentNode = currentNode.next;
            count++;
        }
        return currentNode;
    }


    insertAt(index, data) {

        if (index > this.length || index < 0) {
            var message = {
                failure: 'Failure: error.'
            };
            throw new Error(message.failure);
        }
        if (index === this.length) {
            var node = new Node(data);
            node.prev = this._tail;
            this._tail = node;
        } else {
            var node = new Node(data);

            this.nodeAt(index).data = data;
        }
        this.length++;

        return this;
    }
    isEmpty() {
        if (this.length == 0) {
            return true;
        } else {
            return false;
        }
    }
    clear() {
        this.length = 0;
        this._head.data = null;
        this._tail.data = null;
        return this;
    }
    deleteAt(index) {
        if (this.length === 0) {
            return;
        }
        if (index < 0 || index >= this.length) {
            var message = {
                failure: 'Failure: non-existent node in this list.'
            };
            throw new Error(message.failure);
        }
        if (this.length === 1) {
            this._head.data = null;
            this._tail.data = null;
        } else if (index === 0) {
            this.nodeAt(1).prev = null;
            this._head = this.nodeAt(1);
        } else if (index === this.length - 1) {
            this.nodeAt(index - 1).next = null;
            this._tail = this.nodeAt(index - 1);
        } else {
            this.nodeAt(index - 1).next = this.nodeAt(index + 1);
            this.nodeAt(index + 1).prev = this.nodeAt(index - 1);

        }
        this.length--;
        return this;
    }

    reverse() {
        var node_buf = {
            data: null,
            next: null,
            prev: null,
        }

        var node_head = this._head;
        var node_tail = this._tail;

        var i = 0;

        while (i < Math.floor(this.length / 2)) {
            node_buf.data = node_tail.data;
            node_tail.data = node_head.data;
            node_head.data = node_buf.data;
            node_head = node_head.next;
            node_tail = node_tail.prev;
            i++;
        }
        this.writeList();
        return this;
    }
    writeList() {
        var s = '';
        for (var j = 0; j < this.length; j++) {
            s = s + this.at(j) + ' ';
        }
        console.log(s + ' length = ' + this.length);
    }
    indexOf(data) {

        var node = this._head;
        var i = -1;
        while (node != null) {
            i++;
            if (data === node.data) {
                return i;
            }
            node = node.next;
        }
        return -1;
    }

}
class Node {
    constructor(data = null, prev = null, next = null) {
        this.data = data;
        this.prev = prev;
        this.next = next;
    }
}
module.exports = FSM;

/** @Created by Uladzimir Halushka **/