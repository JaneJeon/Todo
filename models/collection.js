let Collection
exports.init = (db, Sequelize) => {
	Collection = db.define('Collection', {
		id: {
			primaryKey: true,
			type: Sequelize.INTEGER,
			autoIncrement: true
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false
		}
	})

	return Collection
}

exports.model = () => Collection
