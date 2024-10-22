import Router from '../router.js';
import * as UserService from '../services/api/userService.js';
import * as Notification from '../services/notification.js';

export class TwoFactorView {
    constructor() {
        this.template = 'two-factor';
        this.UIelements = null;
    }

    async init() {
        const content = await Router.loadTemplate(this.template);
        document.getElementById('app').innerHTML = content;
        
        this.UIelements = this.getUIElements();
        this.addEventListener();
    }

    update() {}

    getUIElements() {
        return {
            input: document.getElementById('twoFactorCode'),
            submitButton: document.getElementById('twoFactorSubmit')
        };
    }

    async submitCode() {
        const code = this.UIelements.input.value;
        try {
            const response = await UserService.submitTwoFactorCode(code);
            if (response.success) {
                window.history.pushState({}, "", "/game-setup");
                Router.handleLocationChange();
            } else {
                Notification
                console.log('Invalid code');
            }
        } catch (error) {
            console.error('Error submitting code', error);
        }
    }

    addEventListener() {
        this.UIelements.submitButton.addEventListener('click', async (e) => {
            e.preventDefault();
            await this.submitCode();
        });
    }
}