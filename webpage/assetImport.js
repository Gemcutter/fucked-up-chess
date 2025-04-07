let assetDict = [];

class Asset {
    constructor (path, name, callback) {
        const img = document.createElement("img");
        img.src = path;
        // img.width = 64;
        // img.height = 64;
        img.onload = callback;
        this.image = img;
        this.name = name;
        assetDict[name] = this;
    }

    delete() {
        delete assetDict[this.name];
    }
}