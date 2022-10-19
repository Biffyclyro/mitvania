// @ts-nocheck
class ConfigObjec {
	#config = {}

	set config(config) {
		this.#config = JSON.parse(config)
		console.log(this.#config)
	}

	get config() {
		return this.#config
	}
}

exports.ConfigObjec = new ConfigObjec()