class RegisterPage {
    // Page elements
    get usernameInput() { return $('input[name="username"]'); }
    get emailInput() { return $('input[name="email"]'); }
    get passwordInput() { return $('input[name="password"]'); }
    get confirmPasswordInput() { return $('input[name="confirmPassword"]'); }
    get registerButton() { return $('.btn-primary'); }
    get loginLink() { return $('=Login'); }
    get errorMessage() { return $('.alert-error'); }
    
    /**
     * Open register page
     */
    async open() {
        await browser.url('/register');
    }
    
    /**
     * Register a new user
     * @param {string} username 
     * @param {string} email 
     * @param {string} password 
     * @param {string} confirmPassword 
     */
    async register(username, email, password, confirmPassword) {
        await this.usernameInput.setValue(username);
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.confirmPasswordInput.setValue(confirmPassword || password);
        await this.registerButton.click();
    }
    
    /**
     * Navigate to login page
     */
    async goToLogin() {
        await this.loginLink.click();
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
     * Check if user is on register page
     */
    async isOnPage() {
        return await this.registerButton.isDisplayed();
    }
}

module.exports = new RegisterPage(); 