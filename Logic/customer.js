class Customer {
  constructor(username, password, url) {
    this._username = username;
    this._password = password;
    this._weburl = weburl;
  }

  present() {
    return this._username + ":" + this._password + " -> " + this._weburl;
  }
  get username() {
    return this._username;
  }
  get password() {
    return this._password;
  }
  get weburl() {
    return this._weburl;
  }
}
