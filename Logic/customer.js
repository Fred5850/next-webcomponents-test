class Customer {
  constructor(username, password, url) {
    this._username = username;
    this._password = password;
    this._url = url;
  }
  present() {
    return this._username + ":" + this._password + " -> " + this._url;
  }
  get username() {
    return this._username;
  }
  get password() {
    return this._password;
  }
  get url() {
    return this._url;
  }
}
