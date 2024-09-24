import state from '../State.js';
import { GameModes } from '../constants.js';

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

export function buttonIdToGameMode(id) {
    switch (id) {
        case 'btn_singleplayer':
            return GameModes.SINGLE;
        case 'btn_multiplayer':
            return GameModes.MULTI;
        case 'btn_online':
            return GameModes.ONLINE;
        default:
            return GameModes.SINGLE;
    }
}

export function standingsTableRow(playerStats) {
    return `
        <tr>
            <td>${player.rank}</td>
            <td>${player.name}</td>
            <td>${player.wins}</td>
            <td>${player.losses}</td>
            <td>${player.draws}</td>
        </tr>
    `;
}