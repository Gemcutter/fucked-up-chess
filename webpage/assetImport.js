let assetDict = [];

class Asset {
    constructor (path, name) {
        const img = document.createElement("img");
        img.src = path;
        img.width = 64;
        img.height = 64;
        this.image = img;
        this.name = name;
        assetDict[name] = this;
    }

    delete() {
        delete assetDict[this.name];
    }
}