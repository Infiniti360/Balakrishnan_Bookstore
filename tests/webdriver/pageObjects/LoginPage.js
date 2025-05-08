class LoginPage {
    // Page elements
    get emailInput() { return $('input[name="email"]'); }
    get passwordInput() { return $('input[name="password"]'); }
    get loginButton() { return $('.btn-primary'); }
    get registerLink() { return $('=Register'); }
    get errorMessage() { return $('.alert-error'); }
    
    /**
     * Open login page
     */
    async open() {
        await browser.url('/login');
    }
    
    /**
     * Login with email and password
     * @param {string} email 
     * @param {string} password 
     */
    async login(email, password) {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.loginButton.click();
    }
    
    /**
     * Navigate to register page
     */
    async goToRegister() {
        await this.registerLink.click();
    }
    
    /**
     * Get error message text if present
     */
    async getErrorMessage() {
        try {
            return await this.errorMessage.getText();
        } catch (error) {
            return null;
        }
    }
    
    /**
     * Check if user is on login page
     */
    async isOnPage() {
        return await this.loginButton.isDisplayed();
    }
}

module.exports = new LoginPage(); 