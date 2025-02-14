class BaseDAO {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id) {
    return await this.model.findByPk(id);
  }

  async findAll() {
    return await this.model.findAll();
  }
}

module.exports = BaseDAO;
