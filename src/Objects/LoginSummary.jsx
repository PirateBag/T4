class LoginSummary {
    constructor(username, password, token, lastLoginTime) {
        this.userName = username;
        this.token = token;
        this.password = password;
        this.lastLoginTime = (lastLoginTime == null) ? "yyyy-mm-dd hh:mm:ss" : lastLoginTime ;
    }

    toString() {
        return `${this.userName}  ${this.lastLoginTime}`;
    }
}

export default LoginSummary;