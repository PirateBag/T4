class LoginSummary {
    constructor(username, token, lastLoginTime) {
        this.username = username;
        this.token = token;
        this.lastLoginTime = (lastLoginTime == null) ? "yyyy-mm-dd hh:mm:ss" : lastLoginTime ;
    }

    toString() {
        return `${this.username}  ${this.lastLoginTime}`;
    }
}

export default LoginSummary;