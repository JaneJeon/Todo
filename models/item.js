let Item
exports.init = (db, Sequelize) => {
	Item = db.define('Item', {
		id: {
			primaryKey: true,
			type: Sequelize.INTEGER,
			autoIncrement: true
		},
		body: {
			type: Sequelize.TEXT,
			allowNull: false
		},
		description: {
			type: Sequelize.TEXT
		},
		completed: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},
		important: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},
		due: {
			type: Sequelize.DATE
		},
		tags: {
			type: Sequelize.ARRAY(Sequelize.TEXT)
		}
	})

	return Item
}

exports.model = () => Item
