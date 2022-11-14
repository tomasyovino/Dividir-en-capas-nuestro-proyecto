class MongoDbContainer {
    constructor(collection) {
        this.collection = collection;
    }

    async listAll() {
        const elements = await this.collection.find().lean();
        return elements;
    }

    async list(id) {
        const element = await this.collection.findById(id);
        return element;
    }

    async delete(id) {
        const element = await this.collection.findByIdAndDelete(id);
        return this.listAll();
    }

    async update(obj) {
        const element = await this.collection.findByIdAndUpdate(obj.id, { $set: obj }, { new: true });
        return element;
    }
}

export default MongoDbContainer;