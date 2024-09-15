import state from '../State.js';

export function deepCopy(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepCopy(item));
    }

    const copy = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepCopy(obj[key]);
        }
    }
    return copy;
}

export function incrementCurrentMatchIndex() {
    const currentMatchIndex = state.get('tournament.currentMatchIndex');
    state.set('tournament.currentMatchIndex', currentMatchIndex + 1);

    const matches = state.get('tournament.matches');
    state.set('tournament.currentMatch', matches[currentMatchIndex + 1]);
}