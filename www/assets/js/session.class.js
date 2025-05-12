/* globals atenea */

// eslint-disable-next-line no-unused-vars
class session_ {
    constructor() {
		const self = this;
		self.session = atenea.localStorage.getItem("session");		
	}
	
	update(obj) {
		const self = this;
		self.session = obj;
		atenea.localStorage.setItem("session", obj);
		return self;
	}
	
	get() {
		return this.session;
	}

}